import { ShieldCheck, Server, Send } from "lucide-react";
import { SITE } from "@/config/site";

const badges = [
  {
    icon: Server,
    title: "Server-authoritative",
    desc: "Balances, energy and rewards are computed and validated on the server — no client-side tampering.",
  },
  {
    icon: ShieldCheck,
    title: "Fixed supply on TON",
    desc: "1B $SANS jetton on TON with anti-abuse rewarded ads (server-verified) and rate-limited earning.",
  },
  {
    icon: Send,
    title: "Live & open",
    desc: "Playable right now inside Telegram — no install, no signup. Try it before you buy.",
  },
];

export default function TrustBadges() {
  return (
    <section className="border-b border-ink-700/60 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-ink-500">
          Why SANS
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {badges.map((b) => (
            <div
              key={b.title}
              className="flex flex-col items-center gap-3 rounded-xl border border-ink-700 bg-ink-900/60 px-6 py-8 text-center transition-colors hover:border-signal/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-signal/30 bg-signal/10">
                <b.icon size={20} className="text-signal" />
              </span>
              <h3 className="font-display text-base font-bold text-ink-50">{b.title}</h3>
              <p className="text-sm text-ink-400">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={SITE.botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-ink-600 px-6 py-3 text-sm font-semibold text-ink-100 transition-colors hover:border-signal/60 hover:text-signal"
          >
            🐺 Play SANS free in Telegram
          </a>
        </div>
      </div>
    </section>
  );
}
