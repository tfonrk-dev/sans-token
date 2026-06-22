"use client";

import { useState } from "react";
import { Menu, X, Terminal } from "lucide-react";
import ConnectWalletButton from "./ConnectWalletButton";

const links = [
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Whitepaper", href: "/sans-token-whitepaper.pdf" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-signal/40 bg-ink-900 group-hover:shadow-signal transition-shadow">
            <Terminal size={16} className="text-signal" />
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

        <div className="hidden md:block">
          <ConnectWalletButton />
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-ink-100"
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
            <div className="pt-2">
              <ConnectWalletButton fullWidth />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
