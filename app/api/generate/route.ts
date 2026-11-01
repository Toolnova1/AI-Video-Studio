import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const prompt = String(form.get("prompt") ?? "").trim();
  const mode = String(form.get("mode") ?? "text");
  const durationSeconds = Number(form.get("durationSeconds") ?? 0);
  const aspectRatio = String(form.get("aspectRatio") ?? "16:9");
  const resolution = String(form.get("resolution") ?? "720p");

  if (!prompt) return NextResponse.json({ message: "A video prompt is required." }, { status: 400 });
  if (!Number.isFinite(durationSeconds) || durationSeconds < 1 || durationSeconds > 3600) {
    return NextResponse.json({ message: "Duration must be between 1 and 3600 seconds." }, { status: 400 });
  }
  if (!["text", "image"].includes(mode)) return NextResponse.json({ message: "Unsupported generation mode." }, { status: 400 });

  // Provider integration intentionally remains disabled until a real GPU/provider is configured.
  if (!process.env.VIDEO_PROVIDER || !process.env.VIDEO_PROVIDER_API_KEY) {
    return NextResponse.json({
      status: "not_configured",
      message: "Your request was validated, but no AI video provider is connected yet. This scaffold does not generate a video. Next: connect a GPU worker or inference provider.",
      request: { mode, durationSeconds, aspectRatio, resolution }
    }, { status: 503 });
  }

  return NextResponse.json({ status: "not_implemented", message: "A provider is configured, but its adapter has not been implemented yet." }, { status: 501 });
}