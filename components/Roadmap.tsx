const phases = [
  {
    tag: "Phase 01",
    title: "Game Live",
    status: "complete",
    items: ["Telegram mini app live", "Server-authoritative engine", "10-tier progression + skins", "Ads, upgrades, referrals, leaderboard"],
  },
  {
    tag: "Phase 02",
    title: "TON & Presale",
    status: "active",
    items: ["SANS jetton on TON (testnet)", "TON Connect wallet + payments", "Phase 1 presale", "Monetag ad monetization"],
  },
  {
    tag: "Phase 03",
    title: "Mainnet & Growth",
    status: "upcoming",
    items: ["Mainnet jetton (fixed supply)", "DEX liquidity on TON", "Security audit", "Advertiser partnerships"],
  },
  {
    tag: "Phase 04",
    title: "Scale",
    status: "upcoming",
    items: ["On-chain rewards / airdrop", "Staking & buyback automation", "CEX listings", "DAO governance"],
  },
];

const statusStyles: Record<string, string> = {
  complete: "border-signal/50 bg-signal/10 text-signal",
  active: "border-amber-signal/50 bg-amber-signal/10 text-amber-signal",
  upcoming: "border-ink-600 bg-ink-800 text-ink-400",
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative border-b border-ink-700/60 py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            Execution Timeline
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink-50 sm:text-4xl">
            Roadmap
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((p) => (
            <div
              key={p.tag}
              className="relative rounded-xl border border-ink-700 bg-ink-900/60 p-6 transition-colors hover:border-signal/40"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-500">
                {p.tag}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-ink-50">{p.title}</h3>

              <span
                className={`mt-3 inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${statusStyles[p.status]}`}
              >
                {p.status}
              </span>

              <ul className="mt-5 space-y-2.5">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-ink-300">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
