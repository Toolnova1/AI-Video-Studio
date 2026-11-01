import { NextResponse } from "next/server";

export const runtime = "nodejs";

const QUEUE_BASE = "https://queue.fal.run/alibaba/wan-3.0";

export async function GET(
  _request: Request,
  { params }: { params: { requestId: string } }
) {
  const apiKey = process.env.FAL_KEY || process.env.VIDEO_PROVIDER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ status: "not_configured", message: "fal.ai API key is missing." }, { status: 503 });
  }

  const requestId = params.requestId;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId)) {
    return NextResponse.json({ status: "invalid_request", message: "Invalid generation request ID." }, { status: 400 });
  }

  try {
    const statusResponse = await fetch(`${QUEUE_BASE}/requests/${requestId}/status`, {
      headers: { Authorization: `Key ${apiKey}` },
      cache: "no-store"
    });
    const statusData = await statusResponse.json();

    if (!statusResponse.ok) {
      return NextResponse.json({ status: "provider_error", message: statusData.detail || "Could not read generation status." }, { status: statusResponse.status });
    }

    if (statusData.status !== "COMPLETED") {
      return NextResponse.json({
        status: statusData.status,
        queuePosition: statusData.queue_position ?? null
      });
    }

    if (statusData.error) {
      return NextResponse.json({ status: "FAILED", message: statusData.error });
    }

    const resultResponse = await fetch(`${QUEUE_BASE}/requests/${requestId}`, {
      headers: { Authorization: `Key ${apiKey}` },
      cache: "no-store"
    });
    const resultData = await resultResponse.json();

    if (!resultResponse.ok) {
      return NextResponse.json({ status: "provider_error", message: resultData.detail || "Generation finished but the result could not be retrieved." }, { status: 502 });
    }

    const videoUrl = resultData.video?.url;
    if (!videoUrl) {
      return NextResponse.json({ status: "FAILED", message: "The provider completed the job but did not return a video URL." });
    }

    return NextResponse.json({
      status: "COMPLETED",
      videoUrl,
      duration: resultData.duration ?? resultData.video?.duration ?? null,
      actualPrompt: resultData.actual_prompt ?? null
    });
  } catch {
    return NextResponse.json({ status: "provider_error", message: "Could not reach fal.ai while checking the job." }, { status: 502 });
  }
}
