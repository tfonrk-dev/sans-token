import { Radio, ArrowRight, Check } from "lucide-react";
import { SITE } from "@/config/site";

const perks = [
  `Erken fiyat ${SITE.presale.price} · liste ${SITE.presale.listing}`,
  `${SITE.presale.bonus} erken alıcı bonusu`,
  "Oyun içi sahip çarpanı & rozet",
  "TON mainnet dağıtımında öncelik",
];

export default function Presale() {
  return (
    <section id="presale" className="scroll-mt-16 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-8 rounded-chunk bg-gradient-to-br from-sea to-sea-dark p-8 shadow-pop sm:p-10 lg:grid-cols-2">
          {/* copy */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide">
              <Radio size={13} className="animate-pulseSlow" />
              1. Faz Ön Satış
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold">Listelenmeden $SANS kap</h2>
            <p className="mt-3 max-w-xl font-semibold text-white/90">
              Oyunu erken destekle, en düşük fiyatı kilitle. Ön satış TON üzerinde
              gerçekleşir — katılmak ve zincir üstü alım açılınca haberdar olmak için
              Telegram duyuru kanalına gel.
            </p>
            <ul className="mt-6 space-y-2.5">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3 font-semibold">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/25">
                    <Check size={12} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* card */}
          <div className="rounded-chunk bg-cream p-6 shadow-pop sm:p-7">
            <div className="flex items-baseline justify-between border-b border-sky-100 pb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-mute">Token</span>
              <span className="font-display text-xl font-bold text-navy">$SANS · TON</span>
            </div>
            <dl className="mt-4 space-y-3 text-sm font-bold">
              <Row k="Ön satış fiyatı" v={`${SITE.presale.price} / SANS`} />
              <Row k="Liste fiyatı" v={SITE.presale.listing} highlight />
              <Row k="Minimum" v={SITE.presale.minBuy} />
              <Row k="Toplam arz" v={`${SITE.totalSupply} SANS`} />
              <Row k="Ön satış payı" v="30%" />
            </dl>
            <a
              href={SITE.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sun px-5 py-4 text-base font-extrabold text-[#5a3a00] shadow-sun transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            >
              Ön Satıştan Al <ArrowRight size={18} />
            </a>
            <p className="mt-3 text-center text-[11px] font-bold text-mute">
              Oyunda cüzdanını bağla → GRAM öde → SANS al
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate">{k}</dt>
      <dd className={highlight ? "font-display text-sea" : "text-navy"}>{v}</dd>
    </div>
  );
}
