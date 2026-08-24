// Her 5 dk'da bir çalışır (GitHub Actions):
//  1. Deployed screener API'sini SIKI ayarlarla tarar (temiz + erken + potansiyel).
//  2. Daha önce bildirilmemiş YENİ coinleri bulur.
//  3. Her yeni coini Telegram'a bildirim olarak atar.
//  4. "Görülenler" listesini state dosyasına yazar (Actions cache'i saklar).
//
// Gerekli ortam değişkenleri (GitHub Actions secrets):
//   TELEGRAM_BOT_TOKEN  - @BotFather'dan aldığın bot token'ı
//   TELEGRAM_CHAT_ID    - bildirimlerin geleceği sohbet/kullanıcı id'si
// Opsiyonel:
//   SCREENER_BASE       - deployed site kökü (varsayılan https://sanslicekilis.com)
//   STATE_FILE          - görülenler dosyası yolu (varsayılan .alert-state/state.json)
//   MAX_ALERTS_PER_RUN  - tek çalışmada en fazla kaç bildirim (varsayılan 8)

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const BOT = process.env.TELEGRAM_BOT_TOKEN;
const CHAT = process.env.TELEGRAM_CHAT_ID;
const BASE = process.env.SCREENER_BASE || "https://sanslicekilis.com";
const STATE_FILE = process.env.STATE_FILE || ".alert-state/state.json";
const MAX_ALERTS = Number(process.env.MAX_ALERTS_PER_RUN || 8);

// Görülen adresleri en fazla bu kadar tut (dosya şişmesin, eski coinler düşsün).
const STATE_CAP = 500;

if (!BOT || !CHAT) {
  console.error("HATA: TELEGRAM_BOT_TOKEN ve TELEGRAM_CHAT_ID gerekli.");
  process.exit(1);
}

// En sıkı tarama parametreleri (screener'ın 'guvenli' preseti ile uyumlu).
const PARAMS = new URLSearchParams({
  minLiq: "20000",
  maxLiq: "400000",
  minVol24: "40000",
  maxAgeDays: "14",
  maxFdv: "2500000",
  minTxns24: "400",
  limit: "30",
  hideDanger: "1",
  onlyClean: "1",
  maxChange24: "100",
  maxChurn: "10",
  maxTopHolderPct: "10",
  minLpLockedPct: "70",
});

const usd = (n) =>
  n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(1)}K` : `$${Math.round(n)}`;

async function loadState() {
  try {
    const raw = await readFile(STATE_FILE, "utf8");
    const j = JSON.parse(raw);
    return new Set(Array.isArray(j.seen) ? j.seen : []);
  } catch {
    return new Set();
  }
}

async function saveState(seen) {
  const arr = Array.from(seen).slice(-STATE_CAP);
  await mkdir(dirname(STATE_FILE), { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify({ seen: arr, updatedAt: Date.now() }, null, 0));
}

async function fetchCandidates() {
  const url = `${BASE}/api/screener?${PARAMS.toString()}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Screener API ${res.status}`);
  const j = await res.json();
  return Array.isArray(j.candidates) ? j.candidates : [];
}

function tgEscape(s) {
  // Telegram HTML parse_mode için kaçış.
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatMessage(c) {
  const jup = `https://jup.ag/swap/So11111111111111111111111111111111111111112-${c.address}`;
  const lines = [
    `🟢 <b>Yeni temiz aday: ${tgEscape(c.symbol)}</b>`,
    tgEscape(c.name),
    "",
    `💧 Likidite: ${usd(c.liquidityUsd)}  ·  📊 FDV: ${c.fdv ? usd(c.fdv) : "-"}`,
    `📈 24s: ${c.change24h > 0 ? "+" : ""}${c.change24h.toFixed(1)}%  ·  1s: ${c.change1h > 0 ? "+" : ""}${c.change1h.toFixed(1)}%`,
    `🕒 Yaş: ${c.ageDays}g  ·  ⭐ Skor: ${c.score}`,
  ];
  if (c.safety) {
    const bits = [];
    if (c.safety.lpLockedPct != null) bits.push(`kilit %${c.safety.lpLockedPct}`);
    if (c.safety.topHolderPct != null) bits.push(`en büyük cüzdan %${c.safety.topHolderPct}`);
    if (bits.length) lines.push(`🔐 ${bits.join(" · ")}`);
  }
  lines.push("");
  lines.push(`🛒 <a href="${jup}">Al (Jupiter)</a>  ·  🔎 <a href="${tgEscape(c.dexUrl)}">İncele</a>`);
  lines.push("");
  lines.push("⚠️ Garanti değil, yüksek risk. Kaybını göze aldığın parayla, kendin araştırarak gir.");
  return lines.join("\n");
}

async function sendTelegram(text) {
  const res = await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Telegram ${res.status}: ${body}`);
  }
}

async function main() {
  // Test modu: coin olsun olmasın garanti bir test mesajı at (Telegram bağlantısını doğrula).
  if (process.env.TEST_PING === "true") {
    try {
      await sendTelegram(
        "✅ <b>Test başarılı</b>\nCoin bildirim sistemi çalışıyor. Artık her 5 dk'da bir yeni temiz aday bulununca buraya mesaj gelecek.\n\n⚠️ Garanti değil, yüksek risk."
      );
      console.log("Test mesajı gönderildi.");
    } catch (e) {
      console.error("Test mesajı BAŞARISIZ:", e.message);
      process.exit(1);
    }
    return;
  }

  const seen = await loadState();
  let candidates = [];
  try {
    candidates = await fetchCandidates();
  } catch (e) {
    console.error("Tarama başarısız:", e.message);
    process.exit(0); // API geçici çökmüş olabilir — sessiz çık, cron tekrar dener.
  }

  const fresh = candidates.filter((c) => c.address && !seen.has(c.address));
  console.log(`${candidates.length} aday, ${fresh.length} yeni.`);

  const toAlert = fresh.slice(0, MAX_ALERTS);
  for (const c of toAlert) {
    try {
      await sendTelegram(formatMessage(c));
      console.log(`Bildirildi: ${c.symbol} (${c.address})`);
    } catch (e) {
      console.error(`Telegram hatası (${c.symbol}):`, e.message);
    }
  }

  // Bulunan TÜM adayları görülmüş say (bildirilmese bile), tekrar spam olmasın.
  for (const c of candidates) if (c.address) seen.add(c.address);
  await saveState(seen);
}

main();
