import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL = "alibaba/wan-3.0/text-to-video";
const QUEUE_URL = "https://queue.fal.run/alibaba/wan-3.0/text-to-video";

export async function POST(request: Request) {
  const apiKey = process.env.FAL_KEY || process.env.VIDEO_PROVIDER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      status: "not_configured",
      message: "fal.ai is not connected yet. Add your FAL_KEY to .env.local, then restart the development server."
    }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const prompt = String(form.get("prompt") ?? "").trim();
  const mode = String(form.get("mode") ?? "text");
  const duration = Number(form.get("durationSeconds") ?? 5);
  const aspectRatio = String(form.get("aspectRatio") ?? "16:9");
  const resolution = String(form.get("resolution") ?? "720p");

  if (!prompt) return NextResponse.json({ message: "A video prompt is required." }, { status: 400 });
  if (prompt.length > 2000) return NextResponse.json({ message: "Prompt must be 2,000 characters or fewer." }, { status: 400 });
  if (mode !== "text") {
    return NextResponse.json({ message: "Image-to-video is not connected in this first provider milestone. Text-to-video is available first." }, { status: 501 });
  }
  if (![5, 10, 15].includes(duration)) {
    return NextResponse.json({ message: "For the first Wan 3 test, choose 5, 10 or 15 seconds. Longer videos will be assembled from scenes later." }, { status: 400 });
  }
  if (!["16:9", "9:16", "1:1"].includes(aspectRatio)) {
    return NextResponse.json({ message: "Unsupported aspect ratio." }, { status: 400 });
  }
  if (!["720p", "1080p"].includes(resolution)) {
    return NextResponse.json({ message: "Unsupported resolution." }, { status: 400 });
  }

  try {
    const response = await fetch(QUEUE_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        duration,
        aspect_ratio: aspectRatio,
        resolution,
        audio: true,
        enable_prompt_expansion: true,
        enable_safety_checker: true
      }),
      cache: "no-store"
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({
        status: "provider_error",
        message: data.detail || data.message || `fal.ai rejected the request (HTTP ${response.status}). Check your API key and account billing.`
      }, { status: response.status >= 500 ? 502 : response.status });
    }

    if (!data.request_id) {
      return NextResponse.json({ status: "provider_error", message: "fal.ai did not return a request ID." }, { status: 502 });
    }

    return NextResponse.json({
      status: data.status || "IN_QUEUE",
      requestId: data.request_id,
      queuePosition: data.queue_position ?? null,
      model: MODEL,
      message: "Your video request has been submitted to fal.ai. The generation may take a few minutes."
    });
  } catch {
    return NextResponse.json({ status: "provider_error", message: "Could not reach fal.ai. Check your internet connection and try again." }, { status: 502 });
  }
}
