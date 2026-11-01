import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL_BY_MODE = {
  text: "alibaba/wan-3.0/text-to-video",
  image: "alibaba/wan-3.0/image-to-video"
} as const;

export async function GET(
  request: Request,
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

  const mode = new URL(request.url).searchParams.get("mode") || "text";
  if (mode !== "text" && mode !== "image") {
    return NextResponse.json({ status: "invalid_request", message: "Invalid generation mode." }, { status: 400 });
  }
  const model = MODEL_BY_MODE[mode];

  try {
    const statusResponse = await fetch(`https://queue.fal.run/${model}/requests/${requestId}/status`, {
      headers: { Authorization: `Key ${apiKey}` },
      cache: "no-store"
    });
    const statusData = await statusResponse.json();

    if (!statusResponse.ok) {
      return NextResponse.json({ status: "provider_error", message: statusData.detail || "Could not read generation status." }, { status: statusResponse.status });
    }

    if (statusData.status !== "COMPLETED") {
      if (statusData.status === "FAILED") {
        return NextResponse.json({ status: "FAILED", message: statusData.error || "The provider could not generate this video." });
      }
      return NextResponse.json({
        status: statusData.status,
        queuePosition: statusData.queue_position ?? null
      });
    }

    const resultResponse = await fetch(`https://queue.fal.run/${model}/requests/${requestId}`, {
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
