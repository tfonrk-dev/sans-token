"use client";

import { RefreshCw } from "lucide-react";

const segments = [
  { label: "Presale", pct: 30, color: "#2DE2C5" },
  { label: "Liquidity", pct: 25, color: "#1B9E8A" },
  { label: "P2E Rewards", pct: 20, color: "#E2A02D" },
  { label: "Marketing", pct: 15, color: "#4A6B82" },
  { label: "Team", pct: 10, color: "#2A4356" },
];

// Build stroke-dasharray donut from segment percentages
const RADIUS = 80;
const CIRC = 2 * Math.PI * RADIUS;

function buildArcs() {
  let cumulative = 0;
  return segments.map((s) => {
    const length = (s.pct / 100) * CIRC;
    const arc = {
      ...s,
      dasharray: `${length} ${CIRC - length}`,
      offset: -((cumulative / 100) * CIRC),
    };
    cumulative += s.pct;
    return arc;
  });
}

export default function Tokenomics() {
  const arcs = buildArcs();

  return (
    <section id="tokenomics" className="relative border-b border-ink-700/60 py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            Supply Allocation
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink-50 sm:text-4xl">
            Tokenomics
          </h2>
          <p className="mt-4 text-ink-300">
            $SANS is a 1B fixed-supply jetton on TON — transparent allocation
            designed to fund growth without diluting holders, backed by a
            deflationary buyback that retires SANS from circulation as the game
            grows.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* donut chart */}
          <div className="flex justify-center">
            <div className="relative h-72 w-72 sm:h-80 sm:w-80">
              <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#0E1722" strokeWidth="24" />
                {arcs.map((a) => (
                  <circle
                    key={a.label}
                    cx="100"
                    cy="100"
                    r={RADIUS}
                    fill="none"
                    stroke={a.color}
                    strokeWidth="24"
                    strokeDasharray={a.dasharray}
                    strokeDashoffset={a.offset}
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold text-ink-50">1B</span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400">
                  Total Supply
                </span>
              </div>
            </div>
          </div>

          {/* legend + buyback note */}
          <div>
            <ul className="space-y-3">
              {segments.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-sm text-ink-200">{s.label}</span>
                  </div>
                  <span className="font-mono text-sm text-ink-50">{s.pct}%</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-3 rounded-lg border border-signal/30 bg-signal/5 p-4">
              <RefreshCw size={18} className="mt-0.5 shrink-0 text-signal" />
              <div>
                <p className="text-sm font-semibold text-ink-50">
                  Deflationary Buyback Mechanism
                </p>
                <p className="mt-1 text-sm text-ink-300">
                  A portion of ad-revenue and transaction fees is routed to an
                  on-chain treasury that periodically buys back SANS from the
                  open market and burns it — reducing circulating supply as
                  ecosystem usage grows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
