/* eslint-disable @next/next/no-img-element */
"use client";
import { Play, ArrowRight } from "lucide-react";
import { SITE } from "@/config/site";
import { useT } from "./LangProvider";

export default function Hero() {
  const t = useT();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-sun-ray" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        {/* copy */}
        <div className="text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-leaf/40 bg-leaf/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-leaf-dark">
            <span className="h-2 w-2 rounded-full bg-leaf animate-pulseSlow" />
            {t.hero.badge}
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
            {t.hero.title1}
            <br />
            <span className="text-sea">{t.hero.title2}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg font-semibold leading-relaxed text-slate lg:mx-0">
            {t.hero.desc}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <a
              href={SITE.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sun px-7 py-4 text-base font-extrabold text-[#5a3a00] shadow-sun transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            >
              <Play size={18} /> {t.hero.playFree}
            </a>
            <a
              href="#presale"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-sea bg-white px-7 py-4 text-base font-extrabold text-sea shadow-pop-sm transition-transform hover:-translate-y-0.5"
            >
              {t.hero.buy}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-bold text-mute lg:justify-start">
            <span>{t.hero.t1}</span>
            <span>{t.hero.t2}</span>
            <span>{t.hero.t3}</span>
          </div>
        </div>

        {/* wolf mascot */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-x-6 bottom-6 top-10 rounded-chunk bg-gradient-to-b from-sky-200 to-sky-100 shadow-pop dark:from-night-soft dark:to-night-card" />
            <div className="relative px-8 pt-6">
              <div className="animate-floaty">
                <img src="/wolf.png" alt="SANS wolf" className="mx-auto w-64 drop-shadow-[0_18px_20px_rgba(20,40,80,0.25)]" draggable={false} />
              </div>
              <span className="absolute left-2 top-8 text-3xl animate-floaty" style={{ animationDelay: "0.4s" }}>🪙</span>
              <span className="absolute right-3 top-20 text-2xl animate-floaty" style={{ animationDelay: "1s" }}>🪙</span>
              <span className="absolute right-8 top-2 text-xl animate-floaty" style={{ animationDelay: "1.6s" }}>✨</span>
            </div>
            <div className="relative mx-6 -mt-2 mb-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-pop-sm">
              <div className="text-left">
                <div className="font-display text-2xl font-bold text-navy">128,540</div>
                <div className="text-[11px] font-bold uppercase text-mute">{t.hero.balanceLabel}</div>
              </div>
              <span className="rounded-xl bg-sun/20 px-3 py-1.5 text-sm font-extrabold text-sun-dark">{t.hero.boost}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
