import Link from "next/link";

const tools = [
  {
    name: "LTX-2.5 Video Demo",
    type: "Browser-based AI video generation · primary option",
    detail: "Generate a short video from a text prompt, or upload a starting image. This community demo sends requests to the official Lightricks LTX-2.5 Hugging Face Space. Shared free GPU quota is limited, so jobs can fail or wait.",
    href: "https://arpitkgoyal-ltx-2-5-demo.static.hf.space/index.html",
    action: "Open video generator"
  },
  {
    name: "Google Flow",
    type: "Alternative browser video studio",
    detail: "Google Flow may offer free daily credits on eligible accounts, but access and features depend on your account and supported region. Check the price/credit shown before generating.",
    href: "https://labs.google/fx/tools/flow",
    action: "Open Google Flow"
  },
  {
    name: "CogVideoX · Free Colab",
    type: "Open-source model · separate GPU notebook",
    detail: "Run the official quantized CogVideoX notebook in Google Colab when a free GPU is allocated. It takes setup and generation time; free T4 access is not guaranteed.",
    href: "/free-gpu",
    action: "Open CogVideoX Lab",
    internal: true
  },
  {
    name: "Microsoft Clipchamp",
    type: "Video editor",
    detail: "Combine generated clips, add titles, voiceover and music, then export your finished video. Check export settings in your account.",
    href: "https://clipchamp.com/",
    action: "Open video editor"
  }
];

export default function FreeToolsPage() {
  return (
    <main className="min-h-screen bg-[#0b0d14] px-5 py-8 text-white lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-violet-300 hover:text-violet-200">← Back to AI Video Studio</Link>
        <p className="mt-8 text-sm font-medium tracking-widest text-violet-300">ZERO-BUDGET WORKFLOW</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Free video generation tools</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Start with the browser-based LTX demo below. No fal.ai key is needed. Free GPU capacity is shared and limited, so no external free service can promise unlimited or uninterrupted generations.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {tools.map((tool) => {
            const card = (
              <article className="h-full rounded-2xl border border-white/10 bg-[#11141e] p-6 transition hover:border-violet-400/40">
                <p className="text-xs font-medium uppercase tracking-wide text-violet-300">{tool.type}</p>
                <h2 className="mt-3 text-xl font-semibold">{tool.name}</h2>
                <p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">{tool.detail}</p>
                <span className="mt-5 inline-flex rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white">
                  {tool.action} ↗
                </span>
              </article>
            );
            return tool.internal
              ? <Link key={tool.name} href={tool.href}>{card}</Link>
              : <a key={tool.name} href={tool.href} target="_blank" rel="noreferrer">{card}</a>;
          })}
        </div>
        <section className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5">
          <h2 className="font-semibold text-amber-200">Important limitations</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            These are external services, not an inference engine hosted by this website. Shared free GPU demos can show queue, quota or GPU-unavailable errors. Download each finished MP4 from the provider. The main Generate Video button still uses the Wan 3 fal.ai adapter and may incur charges; use these Free tools links to avoid submitting a paid Wan request.
          </p>
        </section>
      </div>
    </main>
  );
}
