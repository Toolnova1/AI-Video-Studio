import Link from "next/link";

const tools = [
  {
    name: "Google Flow",
    type: "Browser-based video generation",
    detail: "Try short cinematic clips with the free allowance shown in your Google account. Availability and credits can vary by country and account.",
    href: "https://labs.google/fx/tools/flow",
    action: "Open Google Flow"
  },
  {
    name: "Hugging Face – LTX Video",
    type: "Community-hosted demo",
    detail: "Try an open video model in a browser. Community demos can be busy, paused, or unavailable; free access is not guaranteed.",
    href: "https://huggingface.co/spaces",
    action: "Explore video Spaces"
  },
  {
    name: "Microsoft Clipchamp",
    type: "Free video editor",
    detail: "Use this to arrange generated clips, add titles, voiceover and music, then export a finished video. Check export settings in your account.",
    href: "https://clipchamp.com/",
    action: "Open Clipchamp"
  }
];

export default function FreeToolsPage() {
  return (
    <main className="min-h-screen bg-[#0b0d14] px-5 py-8 text-white lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-violet-300 hover:text-violet-200">← Back to AI Video Studio</Link>
        <p className="mt-8 text-sm font-medium tracking-widest text-violet-300">ZERO-BUDGET WORKFLOW</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Free video tools</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Use these browser tools for generation and editing without connecting a paid API to this app.
          Free credits, regional access, queues and watermarks are controlled by each provider and can change.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <article key={tool.name} className="rounded-2xl border border-white/10 bg-[#11141e] p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-violet-300">{tool.type}</p>
              <h2 className="mt-3 text-xl font-semibold">{tool.name}</h2>
              <p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">{tool.detail}</p>
              <a href={tool.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-400">
                {tool.action} ↗
              </a>
            </article>
          ))}
        </div>
        <section className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5">
          <h2 className="font-semibold text-amber-200">Important: what this page does not do</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            These are external services, not secretly integrated APIs. You open them yourself, generate/download clips,
            then edit them in Clipchamp. This avoids unexpected API charges. Do not upload private or sensitive footage
            unless you are comfortable with that provider's privacy terms.
          </p>
        </section>
      </div>
    </main>
  );
}
