"use client";

import Link from "next/link";
import { ArrowUpRight, Cpu, ExternalLink, Film, Image, Info } from "lucide-react";

const textNotebook = "https://colab.research.google.com/drive/1DUffhcjrU-uz7_cpuJO3E_D4BaJT7OPa?usp=sharing";
const imageNotebook = "https://colab.research.google.com/drive/17CqYCqSwz39nZAX2YyonDxosVKUZGzcX?usp=sharing";

export default function FreeGpuPage() {
  return (
    <main className="min-h-screen bg-[#090c13] px-5 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-violet-300 hover:text-violet-200">← Back to AI Video Studio</Link>
        <div className="mt-8 flex items-center gap-3 text-violet-300"><Cpu size={22}/><span className="text-xs font-semibold tracking-[.2em]">EXPERIMENTAL FREE GPU WORKFLOW</span></div>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">CogVideoX Free GPU Lab</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-400">Try open-source video generation in Google Colab without using the fal.ai API. The official CogVideo project provides an INT8 text-to-video notebook intended for free-tier T4 Colab sessions.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a href={textNotebook} target="_blank" rel="noreferrer" className="rounded-2xl border border-violet-400/30 bg-violet-500/10 p-5 transition hover:bg-violet-500/15">
            <Film className="text-violet-300"/><h2 className="mt-4 text-lg font-semibold">Text to Video · INT8</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Official CogVideoX-5B quantized Colab notebook. The project README estimates around 30 minutes per generation run.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm text-violet-200">Open in Google Colab <ArrowUpRight size={16}/></span>
          </a>
          <a href={imageNotebook} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/[.03] p-5 transition hover:bg-white/[.06]">
            <Image className="text-violet-300"/><h2 className="mt-4 text-lg font-semibold">Image to Video</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Official CogVideoX-5B image-to-video Colab notebook. GPU availability and memory limits still apply.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm text-violet-200">Open in Google Colab <ArrowUpRight size={16}/></span>
          </a>
        </div>

        <section className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/[.05] p-5">
          <div className="flex items-center gap-2 text-amber-200"><Info size={18}/><h2 className="font-semibold">Important limitations</h2></div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
            <li>Choose T4 only if Colab actually allocates it. Free GPU access is limited and not guaranteed.</li>
            <li>INT8 quantization reduces memory use but generation is slow; the official README estimates about 30 minutes per run.</li>
            <li>Colab runs are temporary. Download each finished MP4 before the session expires.</li>
            <li>This is a separate Colab workflow, not yet connected to this website's Generate Video button.</li>
            <li>Do not select paid compute or enter payment details if keeping this workflow at $0 is essential.</li>
          </ul>
        </section>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <a className="inline-flex items-center gap-2 text-violet-300 hover:underline" href="https://github.com/zai-org/CogVideo" target="_blank" rel="noreferrer">Official source repository <ExternalLink size={14}/></a>
          <a className="inline-flex items-center gap-2 text-violet-300 hover:underline" href="https://github.com/zai-org/CogVideo/blob/main/README.md" target="_blank" rel="noreferrer">Model details and license <ExternalLink size={14}/></a>
        </div>
      </div>
    </main>
  );
}
