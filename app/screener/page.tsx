"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// /screener — Solana "1000x adayı" tarayıcı.
//
// Ne yapar: DexScreener'ın canlı trend verisinden, filtrelere uyan küçük /
// yeni / hareketli Solana tokenlarını çekip skora göre sıralar.
// Ne YAPMAZ: geleceği tahmin edemez, kazanç garantisi vermez, scam'i tam
// tespit edemez. Bu bir ELEME aracı — "spray & pray" için aday listesi çıkarır.
// ---------------------------------------------------------------------------

type Safety = {
  level: "good" | "warn" | "danger" | "unknown";
  scoreNormalised: number | null;
  risks: { name: string; level: string }[];
  mintAuthority: boolean | null;
  freezeAuthority: boolean | null;
  lpLockedPct: number | null;
  topHolderPct: number | null;
  checkedAt: number;
};

type Candidate = {
  name: string;
  symbol: string;
  address: string;
  priceUsd: number;
  liquidityUsd: number;
  fdv: number;
  volume24: number;
  change1h: number;
  change6h: number;
  change24h: number;
  buys24: number;
  sells24: number;
  ageDays: number;
  dexUrl: string;
  imageUrl: string | null;
  score: number;
  flags: string[];
  safety: Safety | null;
};

type ApiResponse = {
  ok: boolean;
  error?: string;
  candidates: Candidate[];
  meta: {
    scanned: number;
    passed?: number;
    returned?: number;
    dangerFiltered?: number;
    notCleanFiltered?: number;
    filters: Record<string, number>;
    generatedAt: number;
    source?: string;
  };
};

const PRESETS = {
  // Varsayılan: en sıkı güvenlik + hâlâ yükselme potansiyeli (küçük cap + erken).
  denge: { minLiq: 10000, maxLiq: 250000, minVol24: 25000, maxAgeDays: 10, maxFdv: 1500000, minTxns24: 250, limit: 30, hideDanger: 1, onlyClean: 1, maxChange24: 150, maxChurn: 15, maxTopHolderPct: 15, minLpLockedPct: 50 },
  // Vahşi: daha erken/riskli ama güvenlik yine sıkı.
  vahsi: { minLiq: 6000, maxLiq: 150000, minVol24: 15000, maxAgeDays: 5, maxFdv: 800000, minTxns24: 150, limit: 30, hideDanger: 1, onlyClean: 1, maxChange24: 200, maxChurn: 20, maxTopHolderPct: 18, minLpLockedPct: 40 },
  // En sıkı: manipülasyon sinyaline sıfır tolerans, boş gelse de.
  guvenli: { minLiq: 20000, maxLiq: 400000, minVol24: 40000, maxAgeDays: 14, maxFdv: 2500000, minTxns24: 400, limit: 30, hideDanger: 1, onlyClean: 1, maxChange24: 100, maxChurn: 10, maxTopHolderPct: 10, minLpLockedPct: 70 },
} as const;

type FilterState = { [K in keyof (typeof PRESETS)["denge"]]: number };

// SOL'ün mint adresi — Jupiter linkinde "SOL" yazısı yerine bunu kullanmak
// daha güvenilir çalışıyor.
const SOL_MINT = "So11111111111111111111111111111111111111112";
const jupUrl = (mint: string) => `https://jup.ag/swap/${SOL_MINT}-${mint}`;

const usd = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(1)}K`
    : `$${n.toFixed(0)}`;

const price = (n: number) =>
  n === 0 ? "-" : n < 0.001 ? `$${n.toExponential(2)}` : `$${n.toPrecision(3)}`;

function pct(n: number) {
  const c = n > 0 ? "text-leaf-dark" : n < 0 ? "text-coral-dark" : "text-mute";
  const sign = n > 0 ? "+" : "";
  return <span className={c}>{sign}{n.toFixed(1)}%</span>;
}

function SafetyCell({ s }: { s: Safety | null }) {
  if (!s || s.level === "unknown") {
    return <span className="text-xs text-mute">? kontrol edilemedi</span>;
  }
  const meta = {
    good: { dot: "bg-leaf", label: "✓ Temiz", txt: "text-leaf-dark" },
    warn: { dot: "bg-sun", label: "⚠ Dikkat", txt: "text-sun-dark" },
    danger: { dot: "bg-coral", label: "⛔ Tehlikeli", txt: "text-coral-dark" },
  }[s.level];

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <span className={`inline-block h-2 w-2 rounded-full ${meta.dot}`} />
        <span className={`text-xs font-bold ${meta.txt}`}>{meta.label}</span>
      </div>
      <ul className="space-y-0.5 text-[11px] leading-tight text-slate">
        {s.mintAuthority === true && <li className="text-coral-dark">• Mint yetkisi AÇIK (sonsuz basılabilir)</li>}
        {s.freezeAuthority === true && <li className="text-coral-dark">• Freeze yetkisi AÇIK (cüzdan dondurulabilir)</li>}
        {s.lpLockedPct != null && (
          <li className={s.lpLockedPct < 50 ? "text-coral-dark" : "text-leaf-dark"}>
            • Kilitli likidite: %{s.lpLockedPct}
          </li>
        )}
        {s.topHolderPct != null && (
          <li className={s.topHolderPct > 20 ? "text-coral-dark" : ""}>
            • En büyük cüzdan: %{s.topHolderPct}
          </li>
        )}
        {s.risks.slice(0, 2).map((r, i) => (
          <li key={i} className={r.level === "danger" ? "text-coral-dark" : ""}>• {r.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ScreenerPage() {
  const [filters, setFilters] = useState<FilterState>(PRESETS.denge);
  const [preset, setPreset] = useState<keyof typeof PRESETS>("denge");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const perCoin = 10; // $10 / coin
  const budget = useMemo(
    () => perCoin * (data?.candidates.length ?? filters.limit),
    [data, filters.limit]
  );

  const run = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, String(v)]))
      ).toString();
      const res = await fetch(`/api/screener?${qs}`, { cache: "no-store" });
      const json: ApiResponse = await res.json();
      setData(json);
      if (!json.ok) setErr(json.error ?? "Bilinmeyen hata");
    } catch (e) {
      setErr("İstek başarısız oldu. Bağlantını kontrol edip tekrar dene.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    run();
    // ilk yüklemede bir kere çalıştır
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPreset = (p: keyof typeof PRESETS) => {
    setPreset(p);
    setFilters(PRESETS[p]);
  };

  const setField = (k: keyof FilterState, v: number) =>
    setFilters((f) => ({ ...f, [k]: v }));

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden px-3 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Başlık */}
        <header className="mb-6">
          <a href="/" className="text-sm text-sea hover:underline">← Ana sayfa</a>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
            🔎 Solana Pump Aday Tarayıcı
          </h1>
          <p className="mt-2 max-w-2xl text-slate">
            Yalnızca <b>güvenlik kontrolünden geçmiş (✓ temiz)</b> ve <b>henüz
            çok pumplamamış (erken)</b> küçük Solana tokenlarını canlı veriyle
            listeler. Fikir:{" "}
            <b>${perCoin}'ar {data?.candidates.length ?? filters.limit} coine dağıt</b> —
            çoğu sıfırlanır, hedef 1-2 tanesinin patlaması.
          </p>
        </header>

        {/* Risk uyarısı */}
        <div className="mb-6 rounded-2xl border border-coral/40 bg-coral/10 p-4 text-sm text-navy">
          <b>⚠️ Uyarı — bu bir kumar, tahmin değil.</b> Bu araç geleceği bilmez ve
          kazanç garantisi vermez. Küçük coinlerin büyük çoğunluğu sıfıra gider;
          bir kısmı doğrudan dolandırıcılık (rug/honeypot) olabilir. Sadece{" "}
          <b>kaybetmeyi göze aldığın parayla</b> ve her coini kendin araştırarak
          gir. Skor = aktivite + basit güvenlik sinyali, kâr sözü değil.
        </div>

        {/* Nasıl alınır rehberi */}
        <details className="mb-6 rounded-2xl bg-white p-4 shadow-pop-sm" open>
          <summary className="cursor-pointer font-display text-lg font-bold text-navy">
            💳 Nasıl alınır? (Solflare ile adım adım)
          </summary>
          <div className="mt-3 space-y-3 text-sm text-slate">
            <p>
              <b className="text-navy">Solflare cüzdanı tek başına yeterli.</b> Solana
              ağının SOL ve tüm SPL tokenlarını tutar, içinde swap vardır. Phantom
              şart değil. Sadece çok yeni coinlerde swap'ı Jupiter üzerinden yapmak
              daha sağlam olur (aşağıdaki "Al" butonu direkt oraya götürür).
            </p>
            <ol className="ml-4 list-decimal space-y-1.5">
              <li>
                <b className="text-navy">Solflare kur:</b> solflare.com (tarayıcı
                eklentisi veya telefon uygulaması). Kurtarma cümleni (seed) kimseyle
                paylaşma, offline yaz.
              </li>
              <li>
                <b className="text-navy">SOL al:</b> Binance/Bybit/OKX gibi bir
                borsadan SOL alıp Solflare adresine çek. Ağ olarak <b>Solana</b> seç.
                İşlem ücretleri için birkaç dolar fazladan SOL bırak.
              </li>
              <li>
                <b className="text-navy">Bütçeyi böl:</b> ${perCoin}'ar {" "}
                {data?.candidates.length ?? filters.limit} coin = yaklaşık ${budget}.
                Hepsini bir coine yığma — mantık dağıtmak.
              </li>
              <li>
                <b className="text-navy">Coini al:</b> satırdaki <b>"Al (Jupiter)"</b>
                {" "}butonuna bas → Solflare'i bağla → miktarı gir → swap. Coin
                cüzdanında görünmezse kontrat adresini yapıştır.
              </li>
              <li>
                <b className="text-navy">Slippage ayarı:</b> yeni/düşük likidite
                coinlerde kaymayı (slippage) <b>%5–15</b> yap, yoksa işlem geri
                döner.
              </li>
              <li>
                <b className="text-navy">Çıkış planı yap:</b> almadan önce "kaça
                satarım" kararını ver (ör. 3x'te anaparanı çek, kalanı bırak). Kâr
                realize edilmeden kâr değildir.
              </li>
            </ol>
            <p className="rounded-lg bg-sky-50 p-2 text-xs text-navy">
              🔐 Güvenlik: Tablodaki <b>Güvenlik</b> kolonu her coini otomatik
              olarak <b>RugCheck</b>'ten geçirir (mint/freeze yetkisi, likidite
              kilidi, holder yoğunluğu). <b>⛔ Tehlikeli</b> işaretliler varsayılan
              olarak gizlenir. Yine de <b>? kontrol edilemedi</b> ya da{" "}
              <b>⚠ Dikkat</b> görürsen almadan önce "İncele" ile kendin doğrula.
              Bir cüzdan sana DM'den "onayla/bağlan" derse dolandırıcıdır — asla
              seed'ini girme, tanımadığın siteye cüzdan bağlama.
            </p>
          </div>
        </details>

        {/* Presetler */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate">Mod:</span>
          {([
            ["denge", "⚖️ Dengeli"],
            ["vahsi", "🔥 Vahşi (daha erken/riskli)"],
            ["guvenli", "🛡️ Daha güvenli (daha oturmuş)"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                preset === key
                  ? "bg-sea text-white shadow-sea"
                  : "bg-white text-navy shadow-pop-sm hover:bg-sky-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filtreler */}
        <div className="mb-4 grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-pop-sm sm:grid-cols-3 lg:grid-cols-6">
          <NumField label="Min likidite $" value={filters.minLiq} onChange={(v) => setField("minLiq", v)} />
          <NumField label="Max likidite $" value={filters.maxLiq} onChange={(v) => setField("maxLiq", v)} />
          <NumField label="Min hacim 24s $" value={filters.minVol24} onChange={(v) => setField("minVol24", v)} />
          <NumField label="Max yaş (gün)" value={filters.maxAgeDays} onChange={(v) => setField("maxAgeDays", v)} />
          <NumField label="Max FDV $" value={filters.maxFdv} onChange={(v) => setField("maxFdv", v)} />
          <NumField label="Max 24s pump %" value={filters.maxChange24} onChange={(v) => setField("maxChange24", v)} />
          <NumField label="Max churn (hacim/likidite)" value={filters.maxChurn} onChange={(v) => setField("maxChurn", v)} />
          <NumField label="Max en büyük cüzdan %" value={filters.maxTopHolderPct} onChange={(v) => setField("maxTopHolderPct", v)} />
          <NumField label="Min kilitli likidite %" value={filters.minLpLockedPct} onChange={(v) => setField("minLpLockedPct", v)} />
          <NumField label="Kaç coin" value={filters.limit} onChange={(v) => setField("limit", v)} />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={run}
            disabled={loading}
            className="rounded-full bg-sun px-6 py-2.5 font-display font-bold text-navy shadow-sun transition hover:brightness-105 disabled:opacity-60"
          >
            {loading ? "Taranıyor…" : "🔄 Tekrar Tara"}
          </button>
          <label className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy shadow-pop-sm">
            <input
              type="checkbox"
              checked={filters.onlyClean === 1}
              onChange={(e) => setField("onlyClean", e.target.checked ? 1 : 0)}
              className="h-4 w-4 accent-leaf"
            />
            ✓ Sadece temiz + erken adaylar
          </label>
          {data?.meta && (
            <span className="text-sm text-mute">
              {data.meta.scanned} token tarandı · {data.candidates.length} temiz aday
              {data.meta.notCleanFiltered ? (
                <> · <b className="text-coral-dark">{data.meta.notCleanFiltered} elendi (temiz değil/riskli)</b></>
              ) : null}{" "}
              · yaklaşık bütçe <b className="text-navy">${budget}</b> · kaynak: DexScreener + RugCheck
            </span>
          )}
        </div>

        {err && (
          <div className="mb-6 rounded-2xl border border-coral/40 bg-coral/10 p-4 text-navy">
            {err}
          </div>
        )}

        {/* Mobil + tablet: kart görünümü (tablo dar ekrana sığmadığı için) */}
        <div className="space-y-3 lg:hidden">
          {data?.candidates.map((c, i) => (
            <MobileCard key={c.address} c={c} i={i} />
          ))}
          {!loading && (data?.candidates.length ?? 0) === 0 && !err && (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-mute shadow-pop-sm">
              Filtrelere uyan aday çıkmadı. Filtreleri gevşetip tekrar dene.
            </div>
          )}
        </div>

        {/* Masaüstü: tam tablo */}
        <div className="hidden overflow-x-auto rounded-2xl bg-white shadow-pop-sm lg:block">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-sky-50 text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-2.5 py-3">#</th>
                <th className="px-2.5 py-3">Token</th>
                <th className="px-2.5 py-3 text-right">Fiyat</th>
                <th className="px-2.5 py-3 text-right">Likidite</th>
                <th className="px-2.5 py-3 text-right">FDV</th>
                <th className="px-2.5 py-3 text-right">Hacim 24s</th>
                <th className="px-2.5 py-3 text-right">1s</th>
                <th className="px-2.5 py-3 text-right">24s</th>
                <th className="px-2.5 py-3 text-right">Yaş</th>
                <th className="px-2.5 py-3 text-right">Skor</th>
                <th className="px-2.5 py-3">Güvenlik & Uyarılar</th>
                <th className="px-2.5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.candidates.map((c, i) => (
                <tr key={c.address} className="border-t border-sky-100 align-top">
                  <td className="px-2.5 py-3 text-mute">{i + 1}</td>
                  <td className="px-2.5 py-3">
                    <div className="flex items-center gap-2">
                      {c.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.imageUrl} alt="" className="h-7 w-7 rounded-full" />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs">🪙</div>
                      )}
                      <div>
                        <div className="font-bold text-navy">{c.symbol}</div>
                        <div className="max-w-[140px] truncate text-xs text-mute">{c.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2.5 py-3 text-right tabular-nums text-navy">{price(c.priceUsd)}</td>
                  <td className="px-2.5 py-3 text-right tabular-nums text-navy">{usd(c.liquidityUsd)}</td>
                  <td className="px-2.5 py-3 text-right tabular-nums text-navy">{c.fdv ? usd(c.fdv) : "-"}</td>
                  <td className="px-2.5 py-3 text-right tabular-nums text-navy">{usd(c.volume24)}</td>
                  <td className="px-2.5 py-3 text-right tabular-nums">{pct(c.change1h)}</td>
                  <td className="px-2.5 py-3 text-right tabular-nums">{pct(c.change24h)}</td>
                  <td className="px-2.5 py-3 text-right tabular-nums text-navy">{c.ageDays}g</td>
                  <td className="px-2.5 py-3 text-right">
                    <span className="rounded-full bg-berry/15 px-2 py-1 font-bold text-berry-dark tabular-nums">
                      {c.score}
                    </span>
                  </td>
                  <td className="px-2.5 py-3 min-w-[190px] max-w-[240px]">
                    <SafetyCell s={c.safety} />
                    {c.flags.length === 0 ? (
                      <div className="mt-1 text-xs text-leaf-dark">✓ bariz uyarı yok</div>
                    ) : (
                      <ul className="mt-1 space-y-0.5">
                        {c.flags.map((f, k) => (
                          <li key={k} className="text-xs text-coral-dark">• {f}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-2.5 py-3">
                    <div className="flex flex-col gap-1.5">
                      <a
                        href={jupUrl(c.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap rounded-full bg-leaf px-3 py-1.5 text-center text-xs font-bold text-white hover:bg-leaf-dark"
                      >
                        Al (Jupiter) ↗
                      </a>
                      <CopyButton address={c.address} />
                      <a
                        href={c.dexUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-center text-xs font-semibold text-sea shadow-pop-sm hover:bg-sky-50"
                      >
                        İncele ↗
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && (data?.candidates.length ?? 0) === 0 && !err && (
                <tr>
                  <td colSpan={12} className="px-3 py-10 text-center text-mute">
                    Filtrelere uyan aday çıkmadı. Filtreleri gevşetip tekrar dene
                    (örn. min hacmi düşür, max yaşı artır).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="mt-6 text-xs text-mute">
          Veri: DexScreener herkese açık API'si. Fiyatlar/likidite gerçek zamanlıya
          yakındır ama gecikebilir. Yatırım tavsiyesi değildir. Her coini almadan
          önce kontratı, holder dağılımını ve likidite kilidini kendin doğrula.
        </footer>
      </div>
    </main>
  );
}

function MobileCard({ c, i }: { c: Candidate; i: number }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-pop-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-mute">#{i + 1}</span>
        {c.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.imageUrl} alt="" className="h-8 w-8 rounded-full" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm">🪙</div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-bold text-navy">{c.symbol}</div>
          <div className="truncate text-xs text-mute">{c.name}</div>
        </div>
        <span className="rounded-full bg-berry/15 px-2 py-1 text-sm font-bold text-berry-dark tabular-nums">
          {c.score}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <Stat label="Fiyat" value={price(c.priceUsd)} />
        <Stat label="Likidite" value={usd(c.liquidityUsd)} />
        <Stat label="FDV" value={c.fdv ? usd(c.fdv) : "-"} />
        <Stat label="Hacim 24s" value={usd(c.volume24)} />
        <Stat label="1s" value={pct(c.change1h)} />
        <Stat label="24s" value={pct(c.change24h)} />
      </div>

      <div className="mt-3 rounded-lg bg-sky-50 p-2">
        <div className="mb-1 text-xs font-semibold text-slate">Güvenlik</div>
        <SafetyCell s={c.safety} />
      </div>

      {c.flags.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {c.flags.map((f, k) => (
            <li key={k} className="text-xs text-coral-dark">• {f}</li>
          ))}
        </ul>
      )}

      <div className="mt-3 space-y-2">
        <a
          href={jupUrl(c.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-leaf px-3 py-2 text-center text-xs font-bold text-white"
        >
          Al (Jupiter) ↗
        </a>
        <div className="flex gap-2">
          <div className="flex-1">
            <CopyButton address={c.address} />
          </div>
          <a
            href={c.dexUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full bg-white px-3 py-2 text-center text-xs font-semibold text-sea shadow-pop-sm"
          >
            İncele ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="text-[11px] text-mute">{label}</div>
      <div className="font-semibold text-navy tabular-nums">{value}</div>
    </div>
  );
}

// Kontrat adresini panoya kopyalar — Jupiter'de coin seçili gelmezse
// kullanıcı adresi "You receive" kutusuna yapıştırabilsin diye.
function CopyButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // pano erişimi yoksa sessiz geç
    }
  };
  return (
    <button
      onClick={copy}
      title={address}
      className="w-full whitespace-nowrap rounded-full bg-sky-100 px-3 py-1.5 text-center text-xs font-semibold text-navy hover:bg-sky-200"
    >
      {copied ? "✓ Kopyalandı" : "Kontrat Kopyala"}
    </button>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-slate">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-sky-200 bg-cream px-2 py-1.5 text-sm text-navy outline-none focus:border-sea"
      />
    </label>
  );
}
