import { ShieldCheck, Lock, FileCheck2 } from "lucide-react";

const badges = [
  {
    icon: FileCheck2,
    title: "Audited by Coinsult",
    desc: "Smart contract independently reviewed for vulnerabilities and ownership risk.",
  },
  {
    icon: Lock,
    title: "Liquidity Locked",
    desc: "Initial liquidity locked via PinkSale for 12 months post-launch.",
  },
  {
    icon: ShieldCheck,
    title: "100% Secure",
    desc: "No mint function, renounced post-launch upgrade keys, verified source code.",
  },
];

export default function TrustBadges() {
  return (
    <section className="border-b border-ink-700/60 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-ink-500">
          Security &amp; Trust
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {badges.map((b) => (
            <div
              key={b.title}
              className="flex flex-col items-center gap-3 rounded-xl border border-ink-700 bg-ink-900/60 px-6 py-8 text-center transition-colors hover:border-signal/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-signal/30 bg-signal/10">
                <b.icon size={20} className="text-signal" />
              </span>
              <h3 className="font-display text-base font-bold text-ink-50">{b.title}</h3>
              <p className="text-sm text-ink-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
