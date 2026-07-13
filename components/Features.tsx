"use client";
import { Crown, Zap, Gift, Users, BarChart3, Wallet, Tv, ShieldCheck } from "lucide-react";
import { useT } from "./LangProvider";

const meta = [
  { icon: Crown, color: "text-sun-dark bg-sun/15" },
  { icon: Zap, color: "text-sea bg-sea/15" },
  { icon: Tv, color: "text-coral-dark bg-coral/15" },
  { icon: Gift, color: "text-leaf-dark bg-leaf/15" },
  { icon: Users, color: "text-berry bg-berry/15" },
  { icon: BarChart3, color: "text-sea bg-sea/15" },
  { icon: Wallet, color: "text-berry bg-berry/15" },
  { icon: ShieldCheck, color: "text-leaf-dark bg-leaf/15" },
];

export default function Features() {
  const t = useT();
  return (
    <section id="features" className="scroll-mt-16 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-extrabold uppercase tracking-wide text-sea">{t.features.kicker}</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-navy">{t.features.title}</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.features.items.map((f, i) => {
            const M = meta[i];
            return (
              <div key={i} className="rounded-3xl bg-white p-5 shadow-pop-sm transition-transform hover:-translate-y-1">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${M.color}`}>
                  <M.icon size={20} />
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-navy">{f.title}</h3>
                <p className="mt-1.5 text-sm font-semibold leading-relaxed text-slate">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
