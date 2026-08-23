import { NextResponse } from "next/server";

// This route powers the /screener page. It pulls *trending / newly boosted*
// Solana tokens from DexScreener (no API key needed), hydrates them with live
// liquidity / volume / price data, applies risk filters, scores each candidate
// and returns the best N.
//
// IMPORTANT: This is a research/screening helper, NOT financial advice and NOT
// a guarantee. Small-cap "pump" tokens are extremely high risk — most go to
// zero. The scoring only ranks activity + basic safety heuristics; it cannot
// predict the future or fully detect scams/honeypots.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DS = "https://api.dexscreener.com";

type DexPair = {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { symbol: string };
  priceUsd?: string;
  liquidity?: { usd?: number };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number; // ms epoch
  volume?: { h24?: number; h6?: number; h1?: number };
  priceChange?: { h24?: number; h6?: number; h1?: number; m5?: number };
  txns?: {
    h24?: { buys?: number; sells?: number };
    h1?: { buys?: number; sells?: number };
  };
  info?: { imageUrl?: string; websites?: unknown[]; socials?: unknown[] };
};

type Boost = { chainId: string; tokenAddress: string };

type Filters = {
  minLiq: number;
  maxLiq: number;
  minVol24: number;
  maxAgeDays: number;
  maxFdv: number;
  minTxns24: number;
  limit: number;
  hideDanger: number; // 1 = güvenlik kontrolünde "tehlikeli" çıkanları gizle
  maxChange24: number; // 24s değişim bunun üstündeyse "zaten pumplamış" say, ele
};

type Safety = {
  level: "good" | "warn" | "danger" | "unknown";
  scoreNormalised: number | null; // RugCheck 0-100 (düşük = daha güvenli)
  risks: { name: string; level: string }[];
  mintAuthority: boolean | null; // true = geliştirici hâlâ basabiliyor (kötü)
  freezeAuthority: boolean | null; // true = cüzdanın dondurulabilir (kötü)
  lpLockedPct: number | null; // kilitli likidite yüzdesi
  topHolderPct: number | null; // en büyük tek cüzdanın payı
  checkedAt: number;
};

const DEFAULTS: Filters = {
  minLiq: 5_000, // below this you usually can't exit a position
  maxLiq: 400_000, // above this the 1000x window has mostly closed
  minVol24: 20_000, // needs real trading activity
  maxAgeDays: 14, // fresh launches only
  maxFdv: 3_000_000, // small cap = room to run
  minTxns24: 150, // enough trades that it isn't dead
  limit: 30,
  hideDanger: 1, // güvenlik kontrolünden "tehlikeli" geçenleri varsayılan olarak gizle
  maxChange24: 400, // 24s'te +%400'den fazla yapmışsa "tepe" riski — varsayılan ele
};

const RUGCHECK = "https://api.rugcheck.xyz/v1";

async function getJson(url: string, timeoutMs = 8000): Promise<any | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function num(v: unknown, d = 0): number {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? (n as number) : d;
}

function parseFilters(searchParams: URLSearchParams): Filters {
  const g = (k: keyof Filters) => {
    const raw = searchParams.get(k);
    if (raw == null || raw === "") return DEFAULTS[k];
    const n = Number(raw);
    return Number.isFinite(n) ? n : DEFAULTS[k];
  };
  return {
    minLiq: g("minLiq"),
    maxLiq: g("maxLiq"),
    minVol24: g("minVol24"),
    maxAgeDays: g("maxAgeDays"),
    maxFdv: g("maxFdv"),
    minTxns24: g("minTxns24"),
    limit: Math.min(Math.max(Math.round(g("limit")), 1), 50),
    hideDanger: g("hideDanger") ? 1 : 0,
    maxChange24: g("maxChange24"),
  };
}

// RugCheck.xyz — Solana token güvenlik raporu. Anahtar gerektirmez, ama
// rate-limit olabilir; hata durumunda "unknown" döner (asla patlamaz).
async function rugCheck(mint: string): Promise<Safety> {
  const base: Safety = {
    level: "unknown",
    scoreNormalised: null,
    risks: [],
    mintAuthority: null,
    freezeAuthority: null,
    lpLockedPct: null,
    topHolderPct: null,
    checkedAt: Date.now(),
  };
  const r = await getJson(`${RUGCHECK}/tokens/${mint}/report`, 9000);
  if (!r) return base;

  const risks: { name: string; level: string }[] = Array.isArray(r.risks)
    ? r.risks.map((x: any) => ({
        name: String(x?.name ?? "risk"),
        level: String(x?.level ?? "warn"),
      }))
    : [];

  const hasDanger = risks.some((x) => x.level === "danger");
  const hasWarn = risks.some((x) => x.level === "warn");

  // Kritik yetkiler: null'dan farklıysa hâlâ aktif demektir.
  const mintAuthority =
    r?.token?.mintAuthority != null ? r.token.mintAuthority !== null : null;
  const freezeAuthority =
    r?.token?.freezeAuthority != null ? r.token.freezeAuthority !== null : null;

  // Kilitli likidite yüzdesi (varsa).
  let lpLockedPct: number | null = null;
  const lpNum = num(r?.markets?.[0]?.lp?.lpLockedPct, NaN);
  if (Number.isFinite(lpNum)) lpLockedPct = Math.round(lpNum);

  // En büyük tek holder payı.
  let topHolderPct: number | null = null;
  const th = r?.topHolders;
  if (Array.isArray(th) && th.length > 0) {
    const p = num(th[0]?.pct, NaN);
    if (Number.isFinite(p)) topHolderPct = Math.round(p);
  }

  // Ham RugCheck yetki bilgisini de bariz riske çevir.
  const derivedDanger =
    mintAuthority === true || freezeAuthority === true || hasDanger;

  return {
    level: derivedDanger ? "danger" : hasWarn ? "warn" : "good",
    scoreNormalised: Number.isFinite(num(r?.score_normalised, NaN))
      ? Math.round(num(r.score_normalised))
      : null,
    risks: risks.slice(0, 6),
    mintAuthority,
    freezeAuthority,
    lpLockedPct,
    topHolderPct,
    checkedAt: Date.now(),
  };
}

// Aynı anda en fazla `size` istek — RugCheck'i boğmadan hepsini kontrol et.
async function inBatches<T, R>(
  items: T[],
  size: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size);
    const res = await Promise.all(batch.map(fn));
    out.push(...res);
  }
  return out;
}

// Gather candidate Solana token addresses from the trending / boost feeds.
async function collectSolanaAddresses(): Promise<string[]> {
  const feeds = [
    `${DS}/token-boosts/top/v1`,
    `${DS}/token-boosts/latest/v1`,
    `${DS}/token-profiles/latest/v1`,
  ];
  const results = await Promise.all(feeds.map((u) => getJson(u)));
  const addrs = new Set<string>();
  for (const r of results) {
    const arr: Boost[] = Array.isArray(r) ? r : [];
    for (const b of arr) {
      if (b && b.chainId === "solana" && b.tokenAddress) {
        addrs.add(b.tokenAddress);
      }
    }
  }
  return Array.from(addrs);
}

// DexScreener /tokens accepts up to 30 comma-separated addresses per call.
async function hydratePairs(addresses: string[]): Promise<DexPair[]> {
  const chunks: string[][] = [];
  for (let i = 0; i < addresses.length; i += 30) {
    chunks.push(addresses.slice(i, i + 30));
  }
  const responses = await Promise.all(
    chunks.map((c) => getJson(`${DS}/latest/dex/tokens/${c.join(",")}`))
  );
  const pairs: DexPair[] = [];
  for (const r of responses) {
    const arr: DexPair[] = r?.pairs ?? [];
    if (Array.isArray(arr)) pairs.push(...arr);
  }
  return pairs;
}

// For each token keep only its deepest-liquidity Solana pair.
function bestPairPerToken(pairs: DexPair[]): DexPair[] {
  const byToken = new Map<string, DexPair>();
  for (const p of pairs) {
    if (p.chainId !== "solana") continue;
    const key = p.baseToken?.address;
    if (!key) continue;
    const cur = byToken.get(key);
    if (!cur || num(p.liquidity?.usd) > num(cur.liquidity?.usd)) {
      byToken.set(key, p);
    }
  }
  return Array.from(byToken.values());
}

function ageDays(p: DexPair): number {
  if (!p.pairCreatedAt) return Infinity;
  return (Date.now() - p.pairCreatedAt) / 86_400_000;
}

// Higher = more "pump-like activity + basic safety". NOT a prediction.
function score(p: DexPair): number {
  const liq = num(p.liquidity?.usd);
  const vol24 = num(p.volume?.h24);
  const chg1 = num(p.priceChange?.h1);
  const chg6 = num(p.priceChange?.h6);
  const chg24 = num(p.priceChange?.h24);
  const buys = num(p.txns?.h24?.buys);
  const sells = num(p.txns?.h24?.sells);
  const age = ageDays(p);

  // Volume relative to liquidity = how hot the trading is.
  const churn = liq > 0 ? vol24 / liq : 0;
  // Buy pressure.
  const buyRatio = buys + sells > 0 ? buys / (buys + sells) : 0.5;
  // Freshness bonus (younger = more upside room), decays over the window.
  const youth = age === Infinity ? 0 : Math.max(0, 1 - age / 14);
  // Momentum, weighted toward recent candles.
  const momentum = chg1 * 0.5 + chg6 * 0.3 + chg24 * 0.2;

  let s = 0;
  s += Math.min(churn, 20) * 4; // hot trading
  // "Erken" ödülü: saatlik ivme iyi ama 24s zaten parabolik DEĞİLse. Amaç
  // hareketin başını yakalamak, tepesinden almak değil.
  const earlyMomentum = chg1 * 0.6 + chg6 * 0.4; // son saatlerdeki taze hareket
  s += Math.min(Math.max(earlyMomentum, -50), 150) * 0.5;
  s += (buyRatio - 0.5) * 120; // net buying
  s += youth * 40; // freshness
  s += Math.min(liq / 10_000, 15); // a little liquidity is safer to enter/exit

  // TEPEDEN ALMA CEZASI: 24s'te zaten çok yükselmişse skoru kır. +%100 üstü
  // her yüzde giderek daha çok ceza (parabolikten kaçın).
  if (chg24 > 100) s -= (chg24 - 100) * 0.25;
  if (chg24 > 400) s -= (chg24 - 400) * 0.5; // ekstra sert ceza

  return Math.round(s);
}

// Cheap, non-authoritative risk flags surfaced to the user.
function riskFlags(p: DexPair, f: Filters): string[] {
  const flags: string[] = [];
  const liq = num(p.liquidity?.usd);
  const vol24 = num(p.volume?.h24);
  const buys = num(p.txns?.h24?.buys);
  const sells = num(p.txns?.h24?.sells);
  const chg24 = num(p.priceChange?.h24);

  if (liq < 15_000) flags.push("Çok düşük likidite — çıkışta sıkışabilirsin");
  if (buys + sells < 300) flags.push("Az işlem — kolay manipüle edilir");
  if (sells > 0 && buys / Math.max(sells, 1) < 0.4)
    flags.push("Satış baskısı yüksek");
  if (chg24 < -40) flags.push("Son 24s sert düşüş");
  if (chg24 > 300)
    flags.push("Zaten çok pumplamış — tepeden alma riski");
  if (vol24 > 0 && liq > 0 && vol24 / liq > 25)
    flags.push("Aşırı churn — pump&dump olabilir");
  const noSocials =
    !p.info?.socials || (Array.isArray(p.info.socials) && p.info.socials.length === 0);
  if (noSocials) flags.push("Sosyal/website bilgisi yok");
  return flags;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const f = parseFilters(searchParams);

  const addresses = await collectSolanaAddresses();
  if (addresses.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "DexScreener trend verisi alınamadı (geçici olabilir). Birazdan tekrar dene.",
        candidates: [],
        meta: { scanned: 0, filters: f, generatedAt: Date.now() },
      },
      { status: 200 }
    );
  }

  const pairs = await hydratePairs(addresses);
  const unique = bestPairPerToken(pairs);

  const passed = unique.filter((p) => {
    const liq = num(p.liquidity?.usd);
    const vol24 = num(p.volume?.h24);
    const fdv = num(p.fdv) || num(p.marketCap);
    const txns24 = num(p.txns?.h24?.buys) + num(p.txns?.h24?.sells);
    const chg24 = num(p.priceChange?.h24);
    return (
      liq >= f.minLiq &&
      liq <= f.maxLiq &&
      vol24 >= f.minVol24 &&
      (fdv === 0 || fdv <= f.maxFdv) &&
      ageDays(p) <= f.maxAgeDays &&
      txns24 >= f.minTxns24 &&
      // Zaten aşırı pumplamışsa (tepe riski) ele. maxChange24 <= 0 = kapalı.
      (f.maxChange24 <= 0 || chg24 <= f.maxChange24)
    );
  });

  const ranked = passed
    .map((p) => ({
      name: p.baseToken?.name ?? "?",
      symbol: p.baseToken?.symbol ?? "?",
      address: p.baseToken?.address ?? "",
      priceUsd: num(p.priceUsd),
      liquidityUsd: Math.round(num(p.liquidity?.usd)),
      fdv: Math.round(num(p.fdv) || num(p.marketCap)),
      volume24: Math.round(num(p.volume?.h24)),
      change1h: num(p.priceChange?.h1),
      change6h: num(p.priceChange?.h6),
      change24h: num(p.priceChange?.h24),
      buys24: num(p.txns?.h24?.buys),
      sells24: num(p.txns?.h24?.sells),
      ageDays: Number(ageDays(p).toFixed(1)),
      dexUrl: p.url,
      imageUrl: p.info?.imageUrl ?? null,
      score: score(p),
      flags: riskFlags(p, f),
      safety: null as Safety | null,
    }))
    .sort((a, b) => b.score - a.score);

  // En iyi adayları güvenlik kontrolünden geçir (limitin biraz fazlasını al,
  // tehlikeliler elenince yine de yeterli sayı kalsın).
  const pool = ranked.slice(0, Math.min(ranked.length, f.limit + 15));
  const safeties = await inBatches(pool, 5, (c) => rugCheck(c.address));
  pool.forEach((c, i) => {
    c.safety = safeties[i];
  });

  let withSafety = pool;
  if (f.hideDanger) {
    withSafety = pool.filter((c) => c.safety?.level !== "danger");
  }
  const finalList = withSafety.slice(0, f.limit);

  const dangerFiltered = f.hideDanger
    ? pool.filter((c) => c.safety?.level === "danger").length
    : 0;

  return NextResponse.json({
    ok: true,
    candidates: finalList,
    meta: {
      scanned: unique.length,
      passed: passed.length,
      returned: finalList.length,
      dangerFiltered,
      filters: f,
      generatedAt: Date.now(),
      source: "dexscreener.com + rugcheck.xyz",
    },
  });
}
