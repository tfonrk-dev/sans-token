import { Play, MousePointerClick, Tv, Trophy } from "lucide-react";

const steps = [
  { icon: Play, color: "bg-sea", title: "Telegram'da aç", desc: "Tek dokunuşla mini uygulamayı başlat — kurulum yok, kayıt yok. Saniyeler içinde oyundasın." },
  { icon: MousePointerClick, color: "bg-leaf", title: "Kurdu besle", desc: "Her dokunuş kurdu et stokundan besler ve sana $SANS kazandırır. Et zamanla dolar." },
  { icon: Tv, color: "bg-sun", title: "Reklam izle → 2×", desc: "İstersen reklam izle: 30 dk 2× kazanç, bedava SANS, et dolumu ve ekstra çevirme." },
  { icon: Trophy, color: "bg-berry", title: "Tırman & büyüt", desc: "10 seviye ve özel skinlerle yüksel, lider tablosuna çık, TON cüzdanını bağla." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-extrabold uppercase tracking-wide text-sea">60 saniyede başla</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-navy">Nasıl çalışır?</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-chunk bg-white p-6 shadow-pop transition-transform hover:-translate-y-1">
              <span className="absolute right-5 top-4 font-display text-2xl font-bold text-sky-200">{i + 1}</span>
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.color} text-white shadow-pop-sm`}>
                <s.icon size={24} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-navy">{s.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
