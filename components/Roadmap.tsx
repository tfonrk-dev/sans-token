const phases = [
  { tag: "Faz 01", title: "Oyun Canlı", status: "done", items: ["Telegram mini uygulama canlı", "Sunucu-otoriter motor", "10 seviye + skinler", "Reklam, yükseltme, referans, lider tablosu"] },
  { tag: "Faz 02", title: "TON & Ön Satış", status: "active", items: ["SANS jetton TON'da (testnet)", "TON Connect cüzdan + ödeme", "1. Faz ön satış", "Monetag reklam geliri"] },
  { tag: "Faz 03", title: "Mainnet & Büyüme", status: "next", items: ["Mainnet jetton (sabit arz)", "TON'da DEX likidite", "Güvenlik denetimi", "Reklam ortaklıkları"] },
  { tag: "Faz 04", title: "Ölçeklenme", status: "next", items: ["Zincir üstü ödül / airdrop", "Stake & geri-alım otomasyonu", "CEX listeleri", "DAO yönetişimi"] },
];

const badge: Record<string, string> = {
  done: "bg-leaf/15 text-leaf-dark",
  active: "bg-sun/20 text-sun-dark",
  next: "bg-sky-100 text-mute",
};
const label: Record<string, string> = { done: "TAMAM", active: "AKTİF", next: "YAKINDA" };

export default function Roadmap() {
  return (
    <section id="roadmap" className="scroll-mt-16 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-extrabold uppercase tracking-wide text-sea">Yol Haritası</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-navy">Nereye gidiyoruz</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((p) => (
            <div key={p.tag} className="rounded-chunk bg-white p-6 shadow-pop-sm transition-transform hover:-translate-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wide text-mute">{p.tag}</span>
              <h3 className="mt-1 font-display text-xl font-bold text-navy">{p.title}</h3>
              <span className={`mt-3 inline-block rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${badge[p.status]}`}>
                {label[p.status]}
              </span>
              <ul className="mt-4 space-y-2">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm font-semibold text-slate">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sea" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
