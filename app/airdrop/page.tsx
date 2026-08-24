"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SITE } from "@/config/site";

// ---------------------------------------------------------------------------
// /airdrop — Görevler + puan + referans linki (büyüme motoru).
//
// NOT: Bu bir ön-yüz MVP'sidir. Puanlar şimdilik TARAYICIDA (localStorage)
// tutulur — kalıcı/sunucu tarafı bir puan sistemi ve gerçek token dağıtımı
// için ileride cüzdan doğrulamalı bir backend gerekir (sybil koruması).
// Sayfa bunu kullanıcıya da açıkça söyler.
// ---------------------------------------------------------------------------

type Task = {
  id: string;
  label: string;
  points: number;
  href: string;
  emoji: string;
};

const TASKS: Task[] = [
  { id: "play", label: "Oyunu oyna (Kurdu Besle)", points: 100, href: SITE.playUrl, emoji: "🎮" },
  { id: "tg", label: "Telegram duyuru kanalına katıl", points: 50, href: SITE.telegram, emoji: "📣" },
  { id: "screener", label: "Coin Screener'ı dene", points: 50, href: "/screener", emoji: "🔎" },
  { id: "tw", label: "Twitter/X'te takip et", points: 40, href: SITE.twitter, emoji: "🐦" },
  { id: "tonapp", label: "ton.app'te SANS'a oy ver", points: 40, href: SITE.tonapp, emoji: "⬆️" },
  { id: "ig", label: "Instagram'da takip et", points: 30, href: SITE.instagram, emoji: "📸" },
  { id: "yt", label: "YouTube'a abone ol", points: 30, href: SITE.youtube, emoji: "▶️" },
];

const WELCOME_BONUS = 25; // referans linkiyle gelene hoş geldin puanı

const LS = {
  done: "sans-airdrop-done",
  code: "sans-airdrop-code",
  refby: "sans-airdrop-refby",
  welcome: "sans-airdrop-welcome",
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, val: unknown) {
  try {
    localStorage.setItem(key, typeof val === "string" ? val : JSON.stringify(val));
  } catch {
    /* gizli sekme / kapalı depolama — sessiz geç */
  }
}
function makeCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function AirdropPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [code, setCode] = useState("");
  const [refBy, setRefBy] = useState<string | null>(null);
  const [welcome, setWelcome] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  // İlk yükleme: durum + referans kodu + gelen ?ref işleme.
  useEffect(() => {
    const d = readJSON<Record<string, boolean>>(LS.done, {});
    let c = "";
    try {
      c = localStorage.getItem(LS.code) || "";
    } catch {
      /* noop */
    }
    if (!c) {
      c = makeCode();
      write(LS.code, c);
    }

    let rb: string | null = null;
    let gotWelcome = false;
    try {
      rb = localStorage.getItem(LS.refby);
      gotWelcome = localStorage.getItem(LS.welcome) === "1";
      const params = new URLSearchParams(window.location.search);
      const incoming = params.get("ref");
      if (incoming && !rb && incoming !== c) {
        rb = incoming;
        write(LS.refby, incoming);
        write(LS.welcome, "1");
        gotWelcome = true;
      }
    } catch {
      /* noop */
    }

    setDone(d);
    setCode(c);
    setRefBy(rb);
    setWelcome(gotWelcome);
    setReady(true);
  }, []);

  const total = useMemo(() => {
    let t = TASKS.reduce((sum, task) => (done[task.id] ? sum + task.points : sum), 0);
    if (welcome) t += WELCOME_BONUS;
    return t;
  }, [done, welcome]);

  const maxPoints = useMemo(
    () => TASKS.reduce((s, t) => s + t.points, 0) + (welcome ? WELCOME_BONUS : 0),
    [welcome]
  );

  const completeTask = useCallback((id: string) => {
    setDone((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      write(LS.done, next);
      return next;
    });
  }, []);

  const refLink = useMemo(() => {
    const base =
      typeof window !== "undefined"
        ? `${window.location.origin}/airdrop`
        : `https://${SITE.domain}/airdrop`;
    return `${base}?ref=${code}`;
  }, [code]);

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const doneCount = TASKS.filter((t) => done[t.id]).length;
  const progress = Math.round((total / Math.max(maxPoints, 1)) * 100);

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <a href="/" className="text-sm text-sea hover:underline">← Ana sayfa</a>

        <header className="mt-3 text-center">
          <h1 className="font-display text-4xl font-bold text-navy">🎁 SANS Airdrop Görevleri</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate">
            Görevleri tamamla, puan topla, arkadaş davet et. Erken katılanlar ve
            en çok puan toplayanlar airdrop dağıtımında öne geçer.
          </p>
        </header>

        {/* Puan kartı */}
        <div className="mt-6 rounded-chunk bg-white p-6 text-center shadow-pop">
          <div className="text-xs font-extrabold uppercase tracking-wide text-mute">Toplam puanın</div>
          <div className="mt-1 font-display text-5xl font-bold text-sea">{ready ? total : "…"}</div>
          <div className="mt-1 text-sm text-mute">
            {doneCount}/{TASKS.length} görev tamam
            {welcome ? " · +25 hoş geldin bonusu 🎉" : ""}
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-sky-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sea to-leaf transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Görevler */}
        <section className="mt-6 space-y-3">
          {TASKS.map((task) => {
            const isDone = !!done[task.id];
            const internal = task.href.startsWith("/");
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-pop-sm"
              >
                <span className="text-2xl">{task.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-navy">{task.label}</div>
                  <div className="text-xs font-bold text-leaf-dark">+{task.points} puan</div>
                </div>
                {isDone ? (
                  <span className="whitespace-nowrap rounded-full bg-leaf/15 px-4 py-2 text-sm font-bold text-leaf-dark">
                    ✓ Tamam
                  </span>
                ) : (
                  <a
                    href={task.href}
                    target={internal ? undefined : "_blank"}
                    rel={internal ? undefined : "noopener noreferrer"}
                    onClick={() => completeTask(task.id)}
                    className="whitespace-nowrap rounded-full bg-sea px-4 py-2 text-sm font-bold text-white hover:bg-sea-dark"
                  >
                    Git & Kazan →
                  </a>
                )}
              </div>
            );
          })}
        </section>

        {/* Referans */}
        <section className="mt-6 rounded-chunk bg-navy p-6 text-white shadow-pop">
          <h2 className="font-display text-2xl font-bold">👥 Arkadaş davet et</h2>
          <p className="mt-1 text-sm text-white/80">
            Bu linkle gelen her arkadaşın +25 hoş geldin puanı alır. Davet ettiklerin
            arttıkça sıralamada yükselirsin (final airdrop sıralamasında sayılır).
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              readOnly
              value={ready ? refLink : "…"}
              className="w-full flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm text-white outline-none"
              onFocus={(e) => e.currentTarget.select()}
            />
            <button
              onClick={copyRef}
              className="whitespace-nowrap rounded-full bg-sun px-5 py-2.5 font-bold text-[#5a3a00] hover:brightness-105"
            >
              {copied ? "✓ Kopyalandı" : "Linki Kopyala"}
            </button>
          </div>
          {refBy && (
            <p className="mt-3 text-xs text-white/60">Seni davet eden kod: {refBy}</p>
          )}
        </section>

        {/* Dürüst not */}
        <p className="mt-6 rounded-2xl bg-sky-50 p-4 text-xs text-slate">
          ℹ️ Puanlar şu an cihazında tutulur (demo). Kalıcı puan, gerçek sıralama ve
          token dağıtımı için ileride cüzdan doğrulamalı bir sistem eklenecek — bu,
          sahte hesap (sybil) kötüye kullanımını önlemek için gereklidir. Airdrop
          miktarı/tarihi garanti değildir; proje ilerledikçe duyurulur.
        </p>
      </div>
    </main>
  );
}
