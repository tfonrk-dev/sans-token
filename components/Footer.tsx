"use client";
import { Send, Twitter, Instagram, Play, Youtube } from "lucide-react";
import { SITE } from "@/config/site";
import { useT } from "./LangProvider";

const socials = [
  { href: SITE.telegram, label: "Telegram", icon: Send },
  { href: SITE.twitter, label: "Twitter", icon: Twitter },
  { href: SITE.instagram, label: "Instagram", icon: Instagram },
  { href: SITE.youtube, label: "YouTube", icon: Youtube },
];

export default function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-sky-200/70 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-b from-sky-100 to-sky-200 text-lg shadow-pop-sm">🐺</span>
              <span className="font-display text-lg font-bold tracking-wide text-navy">SANS</span>
            </div>
            <p className="mt-3 max-w-sm text-sm font-semibold text-slate">{t.footer.tagline}</p>
            <a
              href={SITE.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-sun px-4 py-2.5 text-sm font-extrabold text-[#5a3a00] shadow-sun"
            >
              <Play size={14} /> {t.footer.play}
            </a>
          </div>

          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate shadow-pop-sm transition-colors hover:text-sea"
              >
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-sky-100 pt-6">
          <p className="text-xs font-medium leading-relaxed text-mute">
            <span className="font-bold text-slate">{t.footer.disclaimerTitle}</span> {t.footer.disclaimer}
          </p>
          <p className="mt-4 text-xs font-bold text-mute">© 2026 SANS · {SITE.domain}</p>
        </div>
      </div>
    </footer>
  );
}
