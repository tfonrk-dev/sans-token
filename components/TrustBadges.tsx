"use client";
import { ShieldCheck, Server, Send } from "lucide-react";
import { SITE } from "@/config/site";
import { useT } from "./LangProvider";

const meta = [
  { icon: Server, color: "bg-sea" },
  { icon: ShieldCheck, color: "bg-leaf" },
  { icon: Send, color: "bg-berry" },
];

export default function TrustBadges() {
  const t = useT();
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-center text-sm font-extrabold uppercase tracking-wide text-sea">{t.trust.kicker}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {t.trust.badges.map((b, i) => {
            const M = meta[i];
            return (
              <div key={i} className="flex flex-col items-center gap-3 rounded-chunk bg-white px-6 py-8 text-center shadow-pop-sm transition-transform hover:-translate-y-1">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${M.color} text-white shadow-pop-sm`}>
                  <M.icon size={24} />
                </span>
                <h3 className="font-display text-lg font-bold text-navy">{b.title}</h3>
                <p className="text-sm font-semibold text-slate">{b.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={SITE.botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-sun px-8 py-4 text-base font-extrabold text-[#5a3a00] shadow-sun transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
          >
            {t.trust.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
