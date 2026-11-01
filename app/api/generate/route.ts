import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL_BY_MODE = {
  text: "alibaba/wan-3.0/text-to-video",
  image: "alibaba/wan-3.0/image-to-video"
} as const;

export async function POST(request: Request) {
  const apiKey = process.env.FAL_KEY || process.env.VIDEO_PROVIDER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      status: "not_configured",
      message: "fal.ai is not connected. Add FAL_KEY to .env.local, then restart the development server."
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
  if (mode !== "text" && mode !== "image") return NextResponse.json({ message: "Unsupported generation mode." }, { status: 400 });
  if (!Number.isInteger(duration) || duration < 2 || duration > 30) {
    return NextResponse.json({ message: "Choose a duration from 2 to 30 seconds." }, { status: 400 });
  }
  if (!["16:9", "9:16", "1:1", "4:3", "3:4"].includes(aspectRatio)) {
    return NextResponse.json({ message: "Unsupported aspect ratio." }, { status: 400 });
  }
  if (!["480p", "720p", "1080p"].includes(resolution)) {
    return NextResponse.json({ message: "Choose 480p, 720p or 1080p. Native 4K is not available on this model." }, { status: 400 });
  }

  const input: Record<string, unknown> = {
    prompt,
    duration,
    aspect_ratio: aspectRatio,
    resolution,
    audio: true,
    enable_prompt_expansion: true,
    enable_safety_checker: true
  };

  if (mode === "image") {
    const image = form.get("image");
    if (!(image instanceof File)) {
      return NextResponse.json({ message: "Upload a JPG, PNG or WEBP image for image-to-video." }, { status: 400 });
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
      return NextResponse.json({ message: "Only JPG, PNG and WEBP images are supported." }, { status: 400 });
    }
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "Image must be 10 MB or smaller." }, { status: 400 });
    }
    const bytes = Buffer.from(await image.arrayBuffer());
    input.start_image_url = `data:${image.type};base64,${bytes.toString("base64")}`;
  }

  const model = MODEL_BY_MODE[mode as keyof typeof MODEL_BY_MODE];

  try {
    const response = await fetch(`https://queue.fal.run/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input),
      cache: "no-store"
    });

    const data = await response.json();
    if (!response.ok) {
      const detail = typeof data.detail === "string" ? data.detail : data.detail?.[0]?.msg;
      return NextResponse.json({
        status: "provider_error",
        message: detail || data.message || `fal.ai rejected the request (HTTP ${response.status}). Check your API key, model access and account billing.`
      }, { status: response.status >= 500 ? 502 : response.status });
    }

    if (!data.request_id) {
      return NextResponse.json({ status: "provider_error", message: "fal.ai did not return a request ID." }, { status: 502 });
    }

    return NextResponse.json({
      status: data.status || "IN_QUEUE",
      requestId: data.request_id,
      mode,
      queuePosition: data.queue_position ?? null,
      message: "Your video request has been submitted. Keep this page open while Wan 3 generates the clip."
    });
  } catch {
    return NextResponse.json({ status: "provider_error", message: "Could not reach fal.ai. Check your internet connection and try again." }, { status: 502 });
  }
}
