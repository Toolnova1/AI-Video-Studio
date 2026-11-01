"use client";

import { useRef, useState } from "react";
import { Clapperboard, ImagePlus, Film, WandSparkles, Clock3, MonitorPlay, Settings2, Upload, Sparkles, FolderOpen, AudioLines } from "lucide-react";

type Mode = "text" | "image";
type Ratio = "16:9" | "9:16" | "1:1";
type Resolution = "720p" | "1080p";
type JobState = "idle" | "submitting";

export default function VideoStudio() {
  const [mode, setMode] = useState<Mode>("text");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("10");
  const [ratio, setRatio] = useState<Ratio>("16:9");
  const [resolution, setResolution] = useState<Resolution>("720p");
  const [file, setFile] = useState<File | null>(null);
  const [jobState, setJobState] = useState<JobState>("idle");
  const [notice, setNotice] = useState("Your studio is ready. Connect a video generation provider to render videos.");
  const inputRef = useRef<HTMLInputElement>(null);

  async function requestGeneration() {
    setNotice("");
    if (!prompt.trim()) { setNotice("Please describe the video first."); return; }
    if (mode === "image" && !file) { setNotice("Please upload a reference image for image-to-video."); return; }
    setJobState("submitting");
    try {
      const body = new FormData();
      body.append("prompt", prompt);
      body.append("mode", mode);
      body.append("durationSeconds", duration);
      body.append("aspectRatio", ratio);
      body.append("resolution", resolution);
      if (file) body.append("image", file);
      const response = await fetch("/api/generate", { method: "POST", body });
      const data = await response.json();
      setNotice(data.message ?? "Generation service response received.");
    } catch {
      setNotice("Could not reach the generation service. Check your connection and try again.");
    } finally {
      setJobState("idle");
    }
  }

  return <main className="min-h-screen">
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0d14]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3"><div className="rounded-xl bg-violet-500/15 p-2 text-violet-300"><Clapperboard size={22}/></div><div><div className="font-semibold tracking-wide">AI VIDEO STUDIO</div><div className="text-[11px] text-slate-500">YOUR CREATIVE WORKSPACE</div></div></div>
        <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex"><span className="h-2 w-2 rounded-full bg-amber-400"/><span>Generation provider not connected</span></div>
        <button className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"><Settings2 size={16} className="mr-2 inline"/>Settings</button>
      </div>
    </header>

    <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
      <section className="space-y-6">
        <div><div className="mb-3 flex items-center gap-2 text-sm text-violet-300"><Sparkles size={16}/> CREATION WORKSPACE</div><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Turn your ideas into <span className="text-violet-300">motion.</span></h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Create a video brief, choose your format and prepare a generation job. Actual rendering becomes available when a GPU worker or inference provider is connected.</p></div>

        <div className="rounded-3xl border border-white/10 bg-[#11141e] p-5 shadow-2xl shadow-black/20 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">New video</h2><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">Draft project</span></div>
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-black/25 p-1">
            <button onClick={() => setMode("text")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm transition ${mode === "text" ? "bg-violet-500 text-white shadow-lg shadow-violet-950/40" : "text-slate-400 hover:text-white"}`}><Film size={17}/> Text to video</button>
            <button onClick={() => setMode("image")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm transition ${mode === "image" ? "bg-violet-500 text-white shadow-lg shadow-violet-950/40" : "text-slate-400 hover:text-white"}`}><ImagePlus size={17}/> Image to video</button>
          </div>

          {mode === "image" && <div onClick={() => inputRef.current?.click()} className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/20 px-5 py-7 text-center hover:border-violet-400/60"><Upload className="mb-2 text-violet-300"/><span className="text-sm font-medium">{file ? file.name : "Upload a reference image"}</span><span className="mt-1 text-xs text-slate-500">PNG, JPG or WEBP</span><input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)}/></div>}

          <label className="mb-2 block text-sm font-medium">Describe your video</label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={6} placeholder="A cinematic aerial shot over a futuristic coastal city at sunset, warm golden light, realistic details, slow camera movement..." className="w-full resize-y rounded-2xl border border-white/10 bg-[#090c13] p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-violet-400/60"/>
          <div className="mt-2 flex justify-between text-xs text-slate-500"><span>Be specific about subject, action, camera and lighting.</span><span>{prompt.length}/2000</span></div>

          <div className="my-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div><label className="mb-2 block text-xs text-slate-400"><Clock3 size={14} className="mr-1 inline"/> Duration (seconds)</label><input type="number" min="1" max="3600" value={duration} onChange={e => setDuration(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#090c13] px-3 py-3 text-sm outline-none focus:border-violet-400/60"/></div>
            <div><label className="mb-2 block text-xs text-slate-400">Aspect ratio</label><select value={ratio} onChange={e => setRatio(e.target.value as Ratio)} className="w-full rounded-xl border border-white/10 bg-[#090c13] px-3 py-3 text-sm outline-none"><option>16:9</option><option>9:16</option><option>1:1</option></select></div>
            <div><label className="mb-2 block text-xs text-slate-400">Target resolution</label><select value={resolution} onChange={e => setResolution(e.target.value as Resolution)} className="w-full rounded-xl border border-white/10 bg-[#090c13] px-3 py-3 text-sm outline-none"><option>720p</option><option>1080p</option></select></div>
            <div><label className="mb-2 block text-xs text-slate-400">Audio</label><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#090c13] px-3 py-3 text-sm text-slate-400"><AudioLines size={16}/> Add later</div></div>
          </div>

          <button disabled={jobState === "submitting"} onClick={requestGeneration} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-60"><WandSparkles size={18}/>{jobState === "submitting" ? "Preparing request..." : "Generate video"}</button>
          {notice && <p role="status" className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-slate-300">{notice}</p>}
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#11141e] p-5 sm:p-7"><div className="mb-4 flex items-center gap-2"><FolderOpen size={18} className="text-violet-300"/><h2 className="font-semibold">Recent projects</h2></div><div className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center"><MonitorPlay size={24} className="mb-2 text-slate-600"/><p className="text-sm text-slate-400">No projects yet</p><p className="mt-1 text-xs text-slate-600">Your generated videos and drafts will appear here.</p></div></div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-[#11141e] p-5"><div className="mb-4 flex items-center gap-2"><MonitorPlay size={17} className="text-violet-300"/><h3 className="font-semibold">Preview</h3></div><div className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_center,_#24213b_0%,_#0b0d14_72%)] text-center"><Clapperboard size={30} className="mb-3 text-violet-300/70"/><p className="text-sm text-slate-400">Your video preview</p><p className="mt-1 text-xs text-slate-600">Waiting for a generation job</p></div><div className="mt-4 flex justify-between text-xs text-slate-500"><span>Output format</span><span>MP4 · H.264 (planned)</span></div></div>
        <div className="rounded-3xl border border-white/10 bg-[#11141e] p-5"><h3 className="mb-3 font-semibold">Build status</h3><div className="space-y-3 text-sm">{[["Studio interface","Ready",true],["Generation API","Scaffolded",true],["GPU worker","Not connected",false],["Video storage","Not configured",false],["Audio pipeline","Planned",false]].map(([name,status,ready])=><div key={String(name)} className="flex items-center justify-between gap-2"><span className="text-slate-400">{name}</span><span className={`text-xs ${ready ? "text-emerald-300" : "text-amber-300"}`}>{String(status)}</span></div>)}</div></div>
        <div className="rounded-3xl border border-violet-400/20 bg-violet-500/5 p-5"><div className="mb-2 flex items-center gap-2 text-violet-300"><Sparkles size={17}/><h3 className="font-semibold">Next milestone</h3></div><p className="text-xs leading-5 text-slate-400">Connect a GPU-backed model through a server-side provider adapter. Free services may impose quotas, queues and time limits.</p></div>
      </aside>
    </div>
    <footer className="border-t border-white/10 px-5 py-6 text-center text-xs text-slate-600">AI Video Studio · Personal project · GPU inference not yet connected</footer>
  </main>;
}