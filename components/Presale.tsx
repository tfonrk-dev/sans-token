import { Radio, ArrowRight, Check } from "lucide-react";
import { SITE } from "@/config/site";

const perks = [
  `Early price ${SITE.presale.price} · listing ${SITE.presale.listing}`,
  `${SITE.presale.bonus} early-buyer bonus`,
  "In-game holder multiplier & badge",
  "First access to TON mainnet claim",
];

export default function Presale() {
  return (
    <section id="presale" className="relative border-b border-ink-700/60 py-24 scroll-mt-16">
      <div className="absolute inset-0 bg-radial-fade opacity-60" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/5 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-signal">
              <Radio size={13} className="animate-pulseSlow" />
              Phase 1 Presale
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold text-ink-50 sm:text-4xl">
              Get $SANS before it lists
            </h2>
            <p className="mt-4 max-w-xl text-ink-300">
              Back the game early and lock in the lowest price. The presale
              settles on TON — join the announcement channel to buy in and get
              notified the moment on-chain purchase opens.
            </p>

            <ul className="mt-6 space-y-2.5">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-ink-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/15">
                    <Check size={12} className="text-signal" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* card */}
          <div className="relative w-full">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-signal/30 via-signal/0 to-signal/0 blur-sm" />
            <div className="relative overflow-hidden rounded-2xl border border-ink-600 bg-ink-900/90 p-6 shadow-2xl sm:p-8">
              <div className="flex items-baseline justify-between border-b border-ink-700 pb-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">Token</span>
                <span className="font-display text-lg font-bold text-ink-50">$SANS · TON</span>
              </div>

              <dl className="mt-5 space-y-3 font-mono text-sm">
                <Row k="Presale price" v={`${SITE.presale.price} / SANS`} />
                <Row k="Listing price" v={SITE.presale.listing} highlight />
                <Row k="Minimum" v={SITE.presale.minBuy} />
                <Row k="Total supply" v={`${SITE.totalSupply} SANS`} />
                <Row k="Presale allocation" v="30%" />
              </dl>

              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-signal px-5 py-3.5 text-sm font-semibold tracking-wide text-ink-950 transition-all hover:bg-signal-glow hover:shadow-signal"
              >
                Join the Presale
                <ArrowRight size={16} />
              </a>
              <p className="mt-3 text-center font-mono text-[11px] text-ink-500">
                On-chain purchase opens with TON mainnet
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-400">{k}</dt>
      <dd className={highlight ? "text-signal" : "text-ink-50"}>{v}</dd>
    </div>
  );
}
