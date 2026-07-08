import { Play, MousePointerClick, Tv, Trophy } from "lucide-react";

const steps = [
  {
    icon: Play,
    title: "Open in Telegram",
    desc: "Launch the SANS mini app in one tap — no install, no signup. You're playing in seconds.",
  },
  {
    icon: MousePointerClick,
    title: "Feed the wolf",
    desc: "Every tap feeds the wolf from your meat stock and mints $SANS. Meat refills over time.",
  },
  {
    icon: Tv,
    title: "Watch ads → 2× & more",
    desc: "Opt into rewarded ads for a 30-min 2× earnings boost, free SANS, meat refills and extra spins.",
  },
  {
    icon: Trophy,
    title: "Climb & cash out",
    desc: "Rise through 10 tiers with unique skins, top the leaderboard, and connect your TON wallet.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative border-b border-ink-700/60 py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Get started in 60 seconds</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink-50 sm:text-4xl">How it works</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-xl border border-ink-700 bg-ink-900/60 p-6 transition-colors hover:border-signal/40"
            >
              <span className="absolute right-5 top-5 font-mono text-sm text-ink-700">0{i + 1}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-signal/30 bg-signal/10">
                <s.icon size={20} className="text-signal" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-50">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
