"use client";

import { useState } from "react";
import { Menu, X, Play } from "lucide-react";
import { SITE } from "@/config/site";
import ThemeToggle from "./ThemeToggle";
import LangToggle from "./LangToggle";
import { useT } from "./LangProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const t = useT();
  const links = [
    { label: t.nav.how, href: "#how" },
    { label: t.nav.features, href: "#features" },
    { label: t.nav.token, href: "#tokenomics" },
    { label: t.nav.roadmap, href: "#roadmap" },
    { label: t.nav.presale, href: "#presale" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-sky-200/70 bg-cream/80 backdrop-blur-md dark:border-white/10 dark:bg-night/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <a href="#" className="group flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-b from-sky-100 to-sky-200 text-xl shadow-pop-sm transition-transform group-hover:-translate-y-0.5 dark:from-night-soft dark:to-night-card">
            🐺
          </span>
          <span className="font-display text-xl font-bold tracking-wide text-navy dark:text-sky-50">SANS</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-bold text-slate transition-colors hover:text-sea dark:text-sky-200/80 dark:hover:text-sun">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LangToggle />
          <ThemeToggle />
          <a
            href={SITE.botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-sun px-5 py-2.5 text-sm font-extrabold text-[#5a3a00] shadow-sun transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
          >
            <Play size={15} /> {t.nav.play}
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LangToggle />
          <ThemeToggle />
          <button
            className="text-navy dark:text-sky-50"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-sky-200/70 bg-cream px-5 py-5 dark:border-white/10 dark:bg-night md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-base font-bold text-slate hover:text-sea dark:text-sky-200/80">
                {l.label}
              </a>
            ))}
            <a
              href={SITE.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-sun px-5 py-3 font-extrabold text-[#5a3a00] shadow-sun"
            >
              <Play size={15} /> {t.nav.play}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
