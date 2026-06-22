import { Send, Twitter, Terminal, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink-950">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-signal/40 bg-ink-900">
                <Terminal size={14} className="text-signal" />
              </span>
              <span className="font-display text-base font-bold tracking-[0.15em] text-ink-50">
                SANS
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-ink-400">
              Watch ads. Earn crypto. Win the pool. A Web3 ecosystem built on
              transparency and real engagement.
            </p>
          </div>

          <div className="flex gap-3">
            
              href="https://t.me/sanslicekilisduyuru"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SANS Token on Telegram"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-ink-700 text-ink-300 transition-colors hover:border-signal/50 hover:text-signal"
            >
              <Send size={16} />
            </a>
            
              href="https://twitter.com/sanslioffical"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SANS Token on Twitter"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-ink-700 text-ink-300 transition-colors hover:border-signal/50 hover:text-signal"
            >
              <Twitter size={16} />
            </a>
            
              href="https://instagram.com/sanslicekilisofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SANS Token on Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-ink-700 text-ink-300 transition-colors hover:border-signal/50 hover:text-signal"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-800 pt-8">
          <p className="text-xs leading-relaxed text-ink-500">
            <span className="font-semibold text-ink-400">Disclaimer:</span> SANS
            is a utility token designed for use within the SANS ecosystem
            (advertising engagement, in-app rewards, and ecosystem access). It
            is not a security, investment contract, or financial instrument,
            and holding SANS does not represent equity, profit-sharing, or
            ownership in any entity. Cryptocurrency involves risk, including
            potential loss of principal. Nothing on this site constitutes
            financial advice — please do your own research before
            participating in the presale.
          </p>
          <p className="mt-4 text-xs text-ink-600">
            © 2026 SANS Token · sanslicekilis.com · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}