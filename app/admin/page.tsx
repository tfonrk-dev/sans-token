"use client";

import { useCallback, useEffect, useState } from "react";

type Row = {
  userId: string;
  username: string;
  totalEarned: number;
  referrals: number;
  qualifiedReferrals: number;
  referrerId: string | null;
  tasksDone: number;
  dailyStreak: number;
  adsWatched: number;
  hasWallet: boolean;
  isHolder: boolean;
  isSeed: boolean;
  isTest: boolean;
  isEngaged: boolean;
};
type Stats = {
  total: number;
  real: number;
  engaged: number;
  wallets: number;
  referrers: number;
  qualifiedReferrals: number;
  holders: number;
  airdropDone: number;
  airdropPool: number;
};
type Data = { totalUsers: number; stats: Stats; leaderboard: Row[]; topReferrers: Row[] };

const KEY_STORE = "sans_admin_key";
const fmt = (n: number) => (n || 0).toLocaleString("tr-TR");
const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);

export default function AdminPage() {
  const [input, setInput] = useState("");
  const [key, setKey] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [auto, setAuto] = useState(false);
  const [updated, setUpdated] = useState("");

  const load = useCallback(async (k: string) => {
    if (!k) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", { headers: { "x-admin-key": k }, cache: "no-store" });
      if (res.status === 403) {
        setError("Anahtar yanlış.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Sunucu hatası: " + res.status);
        setLoading(false);
        return;
      }
      const d = (await res.json()) as Data;
      setData(d);
      setKey(k);
      try {
        localStorage.setItem(KEY_STORE, k);
      } catch {
        /* private mode */
      }
      setUpdated(new Date().toLocaleTimeString("tr-TR"));
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let saved = "";
    try {
      saved = localStorage.getItem(KEY_STORE) || "";
    } catch {
      /* ignore */
    }
    if (saved) {
      setInput(saved);
      load(saved);
    }
  }, [load]);

  useEffect(() => {
    if (!auto || !key) return;
    const id = setInterval(() => load(key), 30000);
    return () => clearInterval(id);
  }, [auto, key, load]);

  const logout = () => {
    try {
      localStorage.removeItem(KEY_STORE);
    } catch {
      /* ignore */
    }
    setData(null);
    setKey("");
    setInput("");
  };

  if (!data) {
    return (
      <main className="wrap">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="login">
          <div className="logo">🐺</div>
          <h1>SANS Admin</h1>
          <p className="muted">Yönetici anahtarını gir</p>
          <input
            type="password"
            value={input}
            placeholder="ADMIN_KEY"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") load(input);
            }}
          />
          <button onClick={() => load(input)} disabled={loading}>
            {loading ? "…" : "Giriş"}
          </button>
          {error && <div className="err">{error}</div>}
        </div>
      </main>
    );
  }

  const s = data.stats;
  const rows = showAll ? data.leaderboard : data.leaderboard.filter((r) => !r.isSeed && !r.isTest);

  const inviteesOf = (id: string) => data.leaderboard.filter((r) => r.referrerId === id);
  const referrers = data.leaderboard
    .filter((r) => r.referrals > 0 || inviteesOf(r.userId).length > 0)
    .sort((a, b) => b.referrals - a.referrals);

  return (
    <main className="wrap">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="top">
        <div className="brand">
          <span className="logo sm">🐺</span> SANS Admin
        </div>
        <div className="actions">
          <label className="chk">
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> 30sn oto
          </label>
          {updated && <span className="muted upd">↻ {updated}</span>}
          <button onClick={() => load(key)} disabled={loading}>
            {loading ? "⏳" : "Yenile"}
          </button>
          <button className="ghost" onClick={logout}>
            Çıkış
          </button>
        </div>
      </header>

      <section className="cards">
        <Card v={s.total} l="Toplam Kayıt" sub="botu açan" />
        <Card v={s.real} l="Gerçek Oyuncu" sub="test hariç" />
        <Card v={s.engaged} l="Aktif Oynayan" sub={`%${pct(s.engaged, s.real)}`} accent="blue" />
        <Card v={s.wallets} l="Cüzdan Bağlı" sub={`%${pct(s.wallets, s.real)}`} accent="green" />
        <Card v={s.referrers} l="Davet Eden" sub={`${s.qualifiedReferrals} nitelikli`} accent={s.referrers ? "" : "warn"} />
        <Card v={s.airdropDone} l="Airdrop ✅" sub="görev + cüzdan bitiren" accent="gold" />
      </section>

      <section className="panels">
        <div className="panel">
          <h2>Huni</h2>
          <Funnel
            data={[
              { l: "Botu açtı", v: s.total, c: "#6b7280" },
              { l: "Gerçek oyuncu", v: s.real, c: "#3b82f6" },
              { l: "Aktif oynadı", v: s.engaged, c: "#8b5cf6" },
              { l: "Cüzdan bağladı", v: s.wallets, c: "#22c55e" },
              { l: "Davet etti", v: s.referrers, c: "#f59e0b" },
            ]}
          />
        </div>
        <div className="panel center">
          <h2>Cüzdan Oranı</h2>
          <Donut pctVal={pct(s.wallets, s.real)} />
          <div className="muted">
            {s.wallets} / {s.real} oyuncu
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>
          Airdrop Dağıtımı <span className="muted">— {fmt(s.airdropPool)} SANS havuz, hak kazananlar paylaşır</span>
        </h2>
        <div className="dist">
          <div className="distcell">
            <div className="dv">{fmt(s.airdropPool)}</div>
            <div className="dl muted">Havuz (SANS)</div>
          </div>
          <div className="distsep">÷</div>
          <div className="distcell">
            <div className="dv">{fmt(s.airdropDone)}</div>
            <div className="dl muted">Uygun kişi</div>
          </div>
          <div className="distsep">=</div>
          <div className="distcell green">
            <div className="dv">{s.airdropDone > 0 ? fmt(Math.floor(s.airdropPool / s.airdropDone)) : "—"}</div>
            <div className="dl muted">Kişi başı ~SANS</div>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>
          Davet Takibi <span className="muted">— kim kimi getirdi</span>
        </h2>
        {referrers.length === 0 ? (
          <div className="empty">Henüz davet yok. Airdrop duyurusu davet akışını başlatır.</div>
        ) : (
          <div className="reftree">
            {referrers.map((r) => {
              const inv = inviteesOf(r.userId);
              const withWallet = inv.filter((i) => i.hasWallet).length;
              return (
                <div key={r.userId} className="refblock">
                  <div className="refhead">
                    <b>{r.username || r.userId}</b>
                    <span className="muted">
                      {r.referrals} davet · {withWallet} cüzdanlı
                    </span>
                  </div>
                  {inv.length === 0 ? (
                    <div className="muted small">Davet sayısı kayıtlı, gelen oyuncu henüz listede görünmüyor.</div>
                  ) : (
                    <div className="invlist">
                      {inv.map((i) => (
                        <span key={i.userId} className={"inv " + (i.hasWallet ? "ok" : "no")}>
                          {i.hasWallet ? "✅" : "○"} {i.username || i.userId}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="thead">
          <h2>
            Oyuncular <span className="muted">({rows.length})</span>
          </h2>
          <label className="chk">
            <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> test/seed göster
          </label>
        </div>
        <div className="tscroll">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Kullanıcı</th>
                <th>Cüzdan</th>
                <th>Davet</th>
                <th>Görev</th>
                <th>Streak</th>
                <th>Reklam</th>
                <th className="r">Kazanç</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.userId} className={r.isSeed || r.isTest ? "dim" : ""}>
                  <td className="muted">{i + 1}</td>
                  <td>
                    {r.username || <span className="muted">({r.userId})</span>}
                    {r.isHolder && <span className="tag gold">holder</span>}
                    {r.isSeed && <span className="tag">seed</span>}
                    {r.isTest && <span className="tag">test</span>}
                  </td>
                  <td>{r.hasWallet ? <span className="tag green">✅</span> : <span className="muted">—</span>}</td>
                  <td>{r.referrals || <span className="muted">—</span>}</td>
                  <td>{r.tasksDone || <span className="muted">—</span>}</td>
                  <td>{r.dailyStreak || <span className="muted">—</span>}</td>
                  <td>{r.adsWatched || <span className="muted">—</span>}</td>
                  <td className="r mono">{fmt(r.totalEarned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="note muted">
        Bu panel <b>oyun</b> verisidir (canlı veritabanı, sanslicekilis.com üzerinden). Pazarlama sitesi ziyaretçi trafiği
        ayrı bir kaynaktır (Vercel Analytics) — istersen sonra onu da bağlarız.
      </p>
    </main>
  );
}

function Card({ v, l, sub, accent = "" }: { v: number; l: string; sub?: string; accent?: string }) {
  return (
    <div className={"card " + accent}>
      <div className="cv">{fmt(v)}</div>
      <div className="cl">{l}</div>
      {sub && <div className="cs muted">{sub}</div>}
    </div>
  );
}

function Funnel({ data }: { data: { l: string; v: number; c: string }[] }) {
  const max = Math.max(1, ...data.map((d) => d.v));
  return (
    <div className="funnel">
      {data.map((d) => (
        <div key={d.l} className="frow">
          <div className="fl">{d.l}</div>
          <div className="fbar">
            <div style={{ width: `${(d.v / max) * 100}%`, background: d.c }} />
          </div>
          <div className="fv">{fmt(d.v)}</div>
        </div>
      ))}
    </div>
  );
}

function Donut({ pctVal }: { pctVal: number }) {
  return (
    <div className="donut" style={{ background: `conic-gradient(#22c55e ${pctVal * 3.6}deg, #1f2937 0deg)` }}>
      <div className="dhole">{pctVal}%</div>
    </div>
  );
}

const CSS = `
.wrap { position: fixed; inset: 0; overflow-y: auto; -webkit-overflow-scrolling: touch;
  background: #0b0e14; color: #e5e7eb; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  padding: 16px; z-index: 9999; }
.wrap * { box-sizing: border-box; }
.muted { color: #8b95a5; }
.small { font-size: 12px; }

.login { max-width: 360px; margin: 14vh auto; background: #121722; border: 1px solid #1f2937;
  border-radius: 16px; padding: 28px; text-align: center; }
.login .logo { font-size: 44px; }
.login h1 { margin: 6px 0 2px; font-size: 22px; }
.login input { width: 100%; margin: 16px 0 10px; padding: 12px 14px; border-radius: 10px;
  border: 1px solid #2a3444; background: #0b0e14; color: #fff; font-size: 15px; }
.login button { width: 100%; padding: 12px; border: 0; border-radius: 10px; cursor: pointer;
  background: #22c55e; color: #04110a; font-weight: 700; font-size: 15px; }
.err { margin-top: 12px; color: #f87171; font-size: 14px; }

.top { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  margin-bottom: 16px; flex-wrap: wrap; }
.brand { font-size: 18px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
.logo.sm { font-size: 22px; }
.actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.actions button { padding: 8px 14px; border-radius: 9px; border: 1px solid #2a3444;
  background: #1b2331; color: #e5e7eb; cursor: pointer; font-weight: 600; }
.actions button.ghost { background: transparent; }
.actions .upd { font-size: 12px; }
.chk { font-size: 13px; display: flex; align-items: center; gap: 6px; color: #8b95a5; cursor: pointer; }

.cards { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 16px; }
@media (max-width: 900px) { .cards { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 520px) { .cards { grid-template-columns: repeat(2, 1fr); } }
.card { background: #121722; border: 1px solid #1f2937; border-radius: 14px; padding: 16px; }
.card.green { border-color: #14532d; background: #0e1a12; }
.card.blue { border-color: #1e3a5f; }
.card.gold { border-color: #4d3b12; }
.card.warn { border-color: #4d1f1f; background: #1a1010; }
.cv { font-size: 30px; font-weight: 800; line-height: 1; }
.cl { margin-top: 6px; font-size: 13px; font-weight: 600; }
.cs { font-size: 12px; margin-top: 2px; }

.panels { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-bottom: 16px; }
@media (max-width: 760px) { .panels { grid-template-columns: 1fr; } }
.panel { background: #121722; border: 1px solid #1f2937; border-radius: 14px; padding: 16px; margin-bottom: 16px; }
.panel h2 { margin: 0 0 14px; font-size: 15px; }
.panel.center { display: flex; flex-direction: column; align-items: center; gap: 10px; }

.funnel { display: flex; flex-direction: column; gap: 10px; }
.frow { display: grid; grid-template-columns: 110px 1fr 54px; align-items: center; gap: 10px; }
.fl { font-size: 13px; color: #b9c2d0; }
.fbar { background: #0b0e14; border-radius: 6px; height: 20px; overflow: hidden; }
.fbar > div { height: 100%; border-radius: 6px; transition: width .4s ease; min-width: 2px; }
.fv { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }

.donut { width: 140px; height: 140px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.dhole { width: 104px; height: 104px; border-radius: 50%; background: #121722;
  display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; }

.reftree { display: flex; flex-direction: column; gap: 10px; }
.refblock { background: #0b0e14; border: 1px solid #1f2937; border-radius: 10px; padding: 12px; }
.refhead { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
.invlist { display: flex; flex-wrap: wrap; gap: 6px; }
.inv { font-size: 13px; padding: 4px 9px; border-radius: 999px; border: 1px solid #2a3444; }
.inv.ok { background: #0e1a12; border-color: #14532d; color: #86efac; }
.inv.no { color: #9aa4b2; }
.empty { color: #8b95a5; padding: 8px 0; }

.thead { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.thead h2 { margin: 0; }
.tscroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14px; white-space: nowrap; }
th, td { text-align: left; padding: 9px 10px; border-bottom: 1px solid #1a2130; }
th { color: #8b95a5; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
td.r, th.r { text-align: right; }
.mono { font-variant-numeric: tabular-nums; }
tr.dim td { opacity: .5; }
.tag { display: inline-block; margin-left: 6px; font-size: 11px; padding: 1px 7px; border-radius: 999px;
  background: #1b2331; border: 1px solid #2a3444; color: #b9c2d0; }
.tag.green { background: #0e1a12; border-color: #14532d; color: #86efac; margin: 0; }
.tag.gold { background: #241d0c; border-color: #4d3b12; color: #fbbf24; }

.dist { display: flex; align-items: center; justify-content: space-around; gap: 8px; flex-wrap: wrap; }
.distcell { text-align: center; min-width: 90px; padding: 6px 4px; }
.distcell.green .dv { color: #86efac; }
.dv { font-size: 26px; font-weight: 800; font-variant-numeric: tabular-nums; }
.dl { font-size: 12px; margin-top: 4px; }
.distsep { font-size: 22px; color: #8b95a5; font-weight: 700; }

.note { margin-top: 4px; font-size: 13px; line-height: 1.5; }
`;
