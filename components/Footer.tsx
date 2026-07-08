import { Send, Twitter, Instagram, Play } from "lucide-react";
import { SITE } from "@/config/site";

const socials = [
  { href: SITE.telegram, label: "SANS on Telegram", icon: Send },
  { href: SITE.twitter, label: "SANS on Twitter", icon: Twitter },
  { href: SITE.instagram, label: "SANS on Instagram", icon: Instagram },
];

export default function Footer() {
  return (
    <footer className="bg-ink-950">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-signal/40 bg-ink-900 text-sm">
                🐺
              </span>
              <span className="font-display text-base font-bold tracking-[0.15em] text-ink-50">
                SANS
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-ink-400">
              Feed the wolf. Earn $SANS on TON. A Telegram tap-to-earn game built
              on transparency and real engagement.
            </p>
            <a
              href={SITE.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-signal px-4 py-2 text-sm font-semibold text-ink-950 transition-all hover:bg-signal-glow"
            >
              <Play size={14} /> Play Free
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
                className="flex h-10 w-10 items-center justify-center rounded-md border border-ink-700 text-ink-300 transition-colors hover:border-signal/50 hover:text-signal"
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-ink-800 pt-8">
          <p className="text-xs leading-relaxed text-ink-500">
            <span className="font-semibold text-ink-400">Disclaimer:</span> SANS
            is a utility token for use within the SANS ecosystem (game rewards,
            ad-engagement, and ecosystem access). It is not a security,
            investment contract, or financial instrument, and holding SANS does
            not represent equity, profit-sharing, or ownership in any entity.
            Cryptocurrency involves risk, including potential loss of principal.
            Nothing on this site is financial advice — do your own research
            before participating in the presale.
          </p>
          <p className="mt-4 text-xs text-ink-600">
            © 2026 SANS · {SITE.domain} · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
