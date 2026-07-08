"use client";

import { useState } from "react";
import { Menu, X, Play } from "lucide-react";
import { SITE } from "@/config/site";

const links = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Presale", href: "#presale" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <a href="#" className="group flex items-center gap-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-signal/40 bg-ink-900 text-lg transition-shadow group-hover:shadow-signal">
            🐺
          </span>
          <span className="font-display text-lg font-bold tracking-[0.15em] text-ink-50">
            SANS
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-mono text-xs uppercase tracking-widest text-ink-300 transition-colors hover:text-signal"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={SITE.botUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-md bg-signal px-5 py-2.5 text-sm font-semibold tracking-wide text-ink-950 transition-all hover:bg-signal-glow hover:shadow-signal active:scale-[0.98] md:inline-flex"
        >
          <Play size={15} /> Play Free
        </a>

        {/* Mobile toggle */}
        <button
          className="text-ink-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-ink-700/60 bg-ink-950 px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-mono text-sm uppercase tracking-widest text-ink-300 hover:text-signal"
              >
                {l.label}
              </a>
            ))}
            <a
              href={SITE.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-signal px-5 py-3 text-sm font-semibold tracking-wide text-ink-950"
            >
              <Play size={15} /> Play Free
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
