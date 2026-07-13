"use client";
import { Play, MousePointerClick, Tv, Trophy } from "lucide-react";
import { useT } from "./LangProvider";

const meta = [
  { icon: Play, color: "bg-sea" },
  { icon: MousePointerClick, color: "bg-leaf" },
  { icon: Tv, color: "bg-sun" },
  { icon: Trophy, color: "bg-berry" },
];

export default function HowItWorks() {
  const t = useT();
  return (
    <section id="how" className="scroll-mt-16 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-extrabold uppercase tracking-wide text-sea">{t.how.kicker}</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-navy">{t.how.title}</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.how.steps.map((s, i) => {
            const M = meta[i];
            return (
              <div key={i} className="relative rounded-chunk bg-white p-6 shadow-pop transition-transform hover:-translate-y-1">
                <span className="absolute right-5 top-4 font-display text-2xl font-bold text-sky-200">{i + 1}</span>
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${M.color} text-white shadow-pop-sm`}>
                  <M.icon size={24} />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-slate">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
