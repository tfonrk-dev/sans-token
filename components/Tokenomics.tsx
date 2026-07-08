"use client";

import { RefreshCw } from "lucide-react";

const segments = [
  { label: "Ön Satış", pct: 30, color: "#3b9dff" },
  { label: "Likidite", pct: 25, color: "#3fce7a" },
  { label: "Oyun Ödülleri", pct: 20, color: "#ffc23d" },
  { label: "Pazarlama", pct: 15, color: "#ff7a5c" },
  { label: "Ekip", pct: 10, color: "#9a6bff" },
];

const RADIUS = 80;
const CIRC = 2 * Math.PI * RADIUS;

function buildArcs() {
  let cumulative = 0;
  return segments.map((s) => {
    const length = (s.pct / 100) * CIRC;
    const arc = { ...s, dasharray: `${length} ${CIRC - length}`, offset: -((cumulative / 100) * CIRC) };
    cumulative += s.pct;
    return arc;
  });
}

export default function Tokenomics() {
  const arcs = buildArcs();

  return (
    <section id="tokenomics" className="scroll-mt-16 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-extrabold uppercase tracking-wide text-sea">Arz Dağılımı</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-navy">Tokenomics</h2>
          <p className="mx-auto mt-3 max-w-2xl font-semibold text-slate">
            $SANS, TON üzerinde 1 milyar sabit arzlı bir jetton. Şeffaf dağılım, sahipleri
            sulandırmadan büyümeyi finanse eder; oyun büyüdükçe geri-alım ile SANS yakılır.
          </p>
        </div>

        <div className="grid items-center gap-10 rounded-chunk bg-white p-8 shadow-pop lg:grid-cols-2">
          <div className="flex justify-center">
            <div className="relative h-72 w-72">
              <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#eef4fb" strokeWidth="26" />
                {arcs.map((a) => (
                  <circle key={a.label} cx="100" cy="100" r={RADIUS} fill="none" stroke={a.color} strokeWidth="26" strokeDasharray={a.dasharray} strokeDashoffset={a.offset} strokeLinecap="round" />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-bold text-navy">1Mr</span>
                <span className="text-[11px] font-extrabold uppercase text-mute">Toplam Arz</span>
              </div>
            </div>
          </div>

          <div>
            <ul className="space-y-2.5">
              {segments.map((s) => (
                <li key={s.label} className="flex items-center justify-between rounded-2xl bg-sky-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="font-bold text-navy">{s.label}</span>
                  </div>
                  <span className="font-display font-bold text-navy">{s.pct}%</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex gap-3 rounded-2xl bg-leaf/10 p-4">
              <RefreshCw size={18} className="mt-0.5 shrink-0 text-leaf-dark" />
              <div>
                <p className="font-display font-bold text-navy">Deflasyonist geri-alım</p>
                <p className="mt-1 text-sm font-semibold text-slate">
                  Reklam gelirinin ve işlem ücretlerinin bir kısmı zincir üstü hazineye gider;
                  periyodik olarak SANS geri alınıp yakılır — kullanım arttıkça arz azalır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
