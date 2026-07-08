"use client";

import { useState } from "react";
import { Menu, X, Play } from "lucide-react";
import { SITE } from "@/config/site";

const links = [
  { label: "Nasıl?", href: "#how" },
  { label: "Özellikler", href: "#features" },
  { label: "Token", href: "#tokenomics" },
  { label: "Yol Haritası", href: "#roadmap" },
  { label: "Ön Satış", href: "#presale" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-sky-200/70 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <a href="#" className="group flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-b from-sky-100 to-sky-200 text-xl shadow-pop-sm transition-transform group-hover:-translate-y-0.5">
            🐺
          </span>
          <span className="font-display text-xl font-bold tracking-wide text-navy">SANS</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm font-bold text-slate transition-colors hover:text-sea">
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={SITE.botUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-2xl bg-sun px-5 py-2.5 text-sm font-extrabold text-[#5a3a00] shadow-sun transition-transform hover:-translate-y-0.5 active:translate-y-0.5 md:inline-flex"
        >
          <Play size={15} /> Oyna
        </a>

        <button
          className="text-navy md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-sky-200/70 bg-cream px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-base font-bold text-slate hover:text-sea">
                {l.label}
              </a>
            ))}
            <a
              href={SITE.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-sun px-5 py-3 font-extrabold text-[#5a3a00] shadow-sun"
            >
              <Play size={15} /> Oyna
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
