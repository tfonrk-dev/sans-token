import { Crown, Zap, Gift, Users, BarChart3, Wallet, Tv, ShieldCheck } from "lucide-react";

const features = [
  { icon: Crown, title: "10 tiers & skins", desc: "From Pup to Alpha — every tier unlocks a unique animated wolf skin as your lifetime $SANS grows." },
  { icon: Zap, title: "Upgrades & passive income", desc: "Multi-tap, bigger meat capacity, faster refill and passive earnings that pile up while you're away." },
  { icon: Tv, title: "Rewarded ads & 2× boost", desc: "Watch an ad for a 30-min 2× boost, free SANS, or an instant meat refill. Or buy your way ad-free." },
  { icon: Gift, title: "Daily streaks & spin", desc: "Come back daily for escalating rewards and a free lucky spin. Miss a day and the streak resets." },
  { icon: Users, title: "Referrals", desc: "Invite friends — you both earn a bonus, and you keep growing your pack." },
  { icon: BarChart3, title: "Live leaderboard", desc: "Compete for the top of the global board by lifetime $SANS earned." },
  { icon: Wallet, title: "TON wallet & payments", desc: "Connect any TON wallet with TON Connect and pay on-chain to remove ads or grab boosts." },
  { icon: ShieldCheck, title: "Server-authoritative", desc: "Balances, energy and rewards are computed on the server — tamper-proof, no localStorage cheating." },
];

export default function Features() {
  return (
    <section id="features" className="relative border-b border-ink-700/60 py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Everything in one mini app</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink-50 sm:text-4xl">Built to keep you playing</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-ink-700 bg-ink-900/60 p-5 transition-colors hover:border-signal/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-signal/30 bg-signal/10 transition-colors group-hover:bg-signal/20">
                <f.icon size={18} className="text-signal" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink-50">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
