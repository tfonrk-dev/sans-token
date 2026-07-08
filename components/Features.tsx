import { Crown, Zap, Gift, Users, BarChart3, Wallet, Tv, ShieldCheck } from "lucide-react";

const features = [
  { icon: Crown, color: "text-sun-dark bg-sun/15", title: "10 seviye & skin", desc: "Yavru Kurt'tan Alfa'ya — toplam $SANS arttıkça her seviye yeni animasyonlu bir kurt skini açar." },
  { icon: Zap, color: "text-sea bg-sea/15", title: "Yükseltme & pasif gelir", desc: "Çoklu dokunuş, daha büyük et deposu, hızlı dolum ve sen yokken biriken pasif kazanç." },
  { icon: Tv, color: "text-coral-dark bg-coral/15", title: "Ödüllü reklam & 2×", desc: "Reklam izle: 30 dk 2× kazanç, bedava SANS ya da anında et dolumu. Ya da reklamsız satın al." },
  { icon: Gift, color: "text-leaf-dark bg-leaf/15", title: "Günlük seri & çark", desc: "Her gün gel: artan ödüller ve bir bedava şans çarkı. Gün kaçırırsan seri sıfırlanır." },
  { icon: Users, color: "text-berry bg-berry/15", title: "Referans", desc: "Arkadaşını davet et — ikiniz de bonus kazanın, sürünüzü büyütün." },
  { icon: BarChart3, color: "text-sea bg-sea/15", title: "Canlı lider tablosu", desc: "Toplam kazanılan $SANS ile küresel sıralamada zirveye oyna." },
  { icon: Wallet, color: "text-berry bg-berry/15", title: "TON cüzdan & ödeme", desc: "TON Connect ile cüzdanını bağla, reklamsız veya boost için zincir üstünde öde." },
  { icon: ShieldCheck, color: "text-leaf-dark bg-leaf/15", title: "Sunucu doğrulamalı", desc: "Bakiye, enerji ve ödüller sunucuda hesaplanır — kurcalanamaz, hile yok." },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-16 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-extrabold uppercase tracking-wide text-sea">Tek uygulamada her şey</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-navy">Seni oyunda tutan tasarım</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-3xl bg-white p-5 shadow-pop-sm transition-transform hover:-translate-y-1">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${f.color}`}>
                <f.icon size={20} />
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-navy">{f.title}</h3>
              <p className="mt-1.5 text-sm font-semibold leading-relaxed text-slate">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
