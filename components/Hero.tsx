import { Play, ArrowRight } from "lucide-react";
import { SITE } from "@/config/site";

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
            Live on Telegram · Built on {SITE.chain}
          </div>

          <h1 className="text-balance font-display text-4xl font-bold leading-[1.08] text-ink-50 sm:text-5xl lg:text-6xl">
            Feed the Wolf.
            <br />
            <span className="text-signal">Earn $SANS on TON.</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-ink-300 sm:text-lg">
            A Telegram tap-to-earn game where every tap feeds the wolf and mints
            you $SANS. Watch ads for 2× boosts, climb 10 tiers, invite friends,
            and connect your TON wallet — all inside Telegram, free to play.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href={SITE.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-signal px-6 py-3.5 text-sm font-semibold tracking-wide text-ink-950 transition-all hover:bg-signal-glow hover:shadow-signal"
            >
              <Play size={16} /> Play Free in Telegram
            </a>
            <a
              href="#presale"
              className="group inline-flex items-center justify-center gap-2 rounded-md border border-ink-600 px-6 py-3.5 text-sm font-semibold tracking-wide text-ink-100 transition-colors hover:border-signal/60 hover:text-signal"
            >
              Buy $SANS (Presale)
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* honest trust strip */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs text-ink-500">
            <span>Built on TON</span>
            <span className="h-1 w-1 rounded-full bg-ink-600" />
            <span>Server-authoritative · anti-cheat</span>
            <span className="h-1 w-1 rounded-full bg-ink-600" />
            <span>Free to play</span>
          </div>
        </div>

        {/* game mockup */}
        <div className="flex justify-center lg:justify-end">
          <GameMock />
        </div>
      </div>
    </section>
  );
}

function GameMock() {
  return (
    <div className="relative w-full max-w-[300px]">
      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-b from-signal/25 via-signal/0 to-signal/0 blur-2xl" />
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2rem] border border-ink-600 bg-gradient-to-b from-ink-850 to-ink-950 shadow-2xl">
        {/* top HUD */}
        <div className="flex items-center justify-between px-4 pt-5">
          <span className="rounded-full border border-ink-600 bg-ink-900/70 px-2.5 py-1 font-mono text-[10px] text-signal">
            Lv.7 · Diamond
          </span>
          <span className="rounded-full border border-amber-signal/40 bg-amber-signal/10 px-2.5 py-1 font-mono text-[10px] text-amber-signal">
            ⚡ 2× · 29m
          </span>
        </div>

        {/* balance */}
        <div className="mt-5 text-center">
          <div className="font-display text-3xl font-bold text-ink-50">128,540</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-500">$SANS balance</div>
        </div>

        {/* wolf */}
        <div className="mt-6 flex justify-center">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-signal/20 bg-signal/5">
            <div className="absolute inset-0 rounded-full bg-signal/10 blur-xl animate-pulseSlow" />
            <span className="relative text-7xl drop-shadow-[0_6px_16px_rgba(45,226,197,0.35)]">🐺</span>
            <span className="absolute -right-1 top-2 rounded-full bg-signal px-2 py-0.5 font-mono text-[10px] font-bold text-ink-950">
              +2
            </span>
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-ink-500">
          tap to feed
        </p>

        {/* meat bar */}
        <div className="mx-5 mt-5">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-800">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-amber-signal to-signal" />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[9px] text-ink-500">
            <span>🍖 Meat</span>
            <span>5,760 / 8,000</span>
          </div>
        </div>

        {/* bottom nav */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-ink-700/70 bg-ink-900/80 py-3 font-mono text-[9px] text-ink-400">
          <span className="text-signal">Home</span>
          <span>Boost</span>
          <span>Friends</span>
          <span>Wallet</span>
        </div>
      </div>
    </div>
  );
}
