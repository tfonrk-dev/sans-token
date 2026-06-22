"use client";

import { useMemo, useState } from "react";
import { ArrowDown, Radio, Loader2 } from "lucide-react";
import { ethers } from "ethers";

const RAISED = 15000;
const GOAL = 30000;
const RATE = 0.012;

const PRESALE_ADDRESS = "0x0000000000000000000000000000000000000000";
const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";

const PRESALE_ABI = [
  "function buyTokens(uint256 usdtAmount) external",
  "function totalRaised() view returns (uint256)",
  "function presaleActive() view returns (bool)",
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

export default function PresaleWidget() {
  const [usdt, setUsdt] = useState("100");
  const [isBuying, setIsBuying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const progressPct = Math.min(100, (RAISED / GOAL) * 100);

  const sansAmount = useMemo(() => {
    const val = parseFloat(usdt);
    if (isNaN(val) || val < 0) return "0.00";
    return (val / RATE).toLocaleString(undefined, { maximumFractionDigits: 2 });
  }, [usdt]);

  const handleBuy = async () => {
    setError(null);
    setTxHash(null);

    if (!(window as any).ethereum) {
      setError("MetaMask bulunamadi! Lutfen yukleyin.");
      return;
    }

    const usdtVal = parseFloat(usdt);
    if (isNaN(usdtVal) || usdtVal < 10) {
      setError("Minimum 10 USDT girmelisiniz.");
      return;
    }

    try {
      setIsBuying(true);
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);

      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      });

      const signer = await provider.getSigner();
      const usdtAmount = ethers.parseUnits(usdt, 18);

      const usdtContract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);
      const approveTx = await usdtContract.approve(PRESALE_ADDRESS, usdtAmount);
      await approveTx.wait();

      const presaleContract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, signer);
      const buyTx = await presaleContract.buyTokens(usdtAmount);
      await buyTx.wait();

      setTxHash(buyTx.hash);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.slice(0, 120));
      }
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-signal/30 via-signal/0 to-signal/0 blur-sm" />
      <div className="relative overflow-hidden rounded-2xl border border-ink-600 bg-ink-900/90 shadow-2xl">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute left-0 right-0 h-24 bg-gradient-to-b from-signal/40 to-transparent animate-scan" />
        </div>

        <div className="relative flex items-center justify-between border-b border-ink-700 bg-ink-850 px-5 py-3">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-signal animate-pulseSlow" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              Phase 1 Presale — LIVE
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-400">SANS / USDT</span>
        </div>

        <div className="relative p-5 sm:p-6">
          <div className="mb-6">
            <div className="mb-2 flex items-end justify-between font-mono text-sm">
              <span className="text-ink-50">
                ${RAISED.toLocaleString()}{" "}
                <span className="text-ink-500">/ ${GOAL.toLocaleString()} raised</span>
              </span>
              <span className="text-signal">{progressPct.toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-signal-dim to-signal shadow-[0_0_12px_rgba(45,226,197,0.6)] transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-[11px] text-ink-500">
              1 SANS = ${RATE.toFixed(3)} USDT · Listing price ${(RATE * 2).toFixed(3)}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-widest text-ink-400">
              Pay with
            </label>
            <div className="flex items-center justify-between rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 focus-within:border-signal/60">
              <input
                type="number"
                min="10"
                value={usdt}
                onChange={(e) => setUsdt(e.target.value)}
                className="w-full bg-transparent font-mono text-lg text-ink-50 outline-none placeholder:text-ink-600"
                placeholder="0.00"
              />
              <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-ink-700 px-2.5 py-1 font-mono text-xs text-ink-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                USDT
              </span>
            </div>
          </div>

          <div className="my-2 flex justify-center">
            <div className="rounded-full border border-ink-700 bg-ink-850 p-1.5">
              <ArrowDown size={14} className="text-signal" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-widest text-ink-400">
              Receive
            </label>
            <div className="flex items-center justify-between rounded-lg border border-ink-600 bg-ink-800 px-4 py-3">
              <span className="font-mono text-lg text-signal">{sansAmount}</span>
              <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-signal/10 px-2.5 py-1 font-mono text-xs text-signal">
                <span className="h-2 w-2 rounded-full bg-signal" />
                SANS
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-mono text-xs text-red-400">
              {error}
            </div>
          )}

          {txHash && (
            <div className="mt-3 rounded-lg border border-signal/30 bg-signal/10 px-4 py-2 font-mono text-xs text-signal">
              Basarili!{" "}
              <a
                href={`https://bscscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                BscScan&apos;de gor
              </a>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleBuy}
              disabled={isBuying}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-signal px-5 py-3 text-sm font-semibold tracking-wide text-ink-950 transition-all hover:bg-signal-glow hover:shadow-signal disabled:opacity-60"
            >
              {isBuying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Islem yapiliyor...
                </>
              ) : (
                "Buy SANS"
              )}
            </button>
            <p className="mt-3 text-center font-mono text-[11px] text-ink-500">
              Minimum 10 USDT · BSC Mainnet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
