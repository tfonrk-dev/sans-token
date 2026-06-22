import { Download, ArrowRight } from "lucide-react";
import PresaleWidget from "./PresaleWidget";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-700/60">
      {/* background grid + radial glow */}
      <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute inset-0 bg-radial-fade" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-28">
        {/* copy */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-900/60 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulseSlow" />
            Telegram Mini App live now
          </div>

          <h1 className="text-balance font-display text-4xl font-bold leading-[1.08] text-ink-50 sm:text-5xl lg:text-6xl">
            Watch Ads. Earn Crypto.
            <br />
            <span className="text-signal">Win the $150 Pool.</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-ink-300 sm:text-lg">
            The ultimate Web3 ecosystem blending Web2 advertising with
            decentralized rewards. Buy SANS or earn it by interacting with
            our Telegram Mini App.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href="#presale"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-signal px-6 py-3.5 text-sm font-semibold tracking-wide text-ink-950 transition-all hover:bg-signal-glow hover:shadow-signal"
            >
              Buy SANS (Presale)
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="/sans-token-whitepaper.pdf"
              download
              className="inline-flex items-center justify-center gap-2 rounded-md border border-ink-600 px-6 py-3.5 text-sm font-semibold tracking-wide text-ink-100 transition-colors hover:border-signal/60 hover:text-signal"
            >
              <Download size={16} />
              Download Whitepaper
            </a>
          </div>

          {/* trust strip */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs text-ink-500">
            <span>Audited · Coinsult</span>
            <span className="h-1 w-1 rounded-full bg-ink-600" />
            <span>Liquidity Locked · PinkSale</span>
            <span className="h-1 w-1 rounded-full bg-ink-600" />
            <span>Multichain Ready</span>
          </div>
        </div>

        {/* presale widget */}
        <div id="presale" className="flex justify-center lg:justify-end scroll-mt-24">
          <PresaleWidget />
        </div>
      </div>
    </section>
  );
}
