"use client";

import { useState } from "react";
import { Wallet, Loader2 } from "lucide-react";
import { ethers } from "ethers";

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ConnectWalletButton({
  variant = "primary",
  fullWidth = false,
}: {
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
}) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (address) {
      setAddress(null);
      return;
    }
    try {
      setIsConnecting(true);
      if (!window.ethereum) {
        alert("MetaMask bulunamadı! Lütfen MetaMask yükleyin: https://metamask.io");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      // BSC ağına geç
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });
      } catch {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x38",
            chainName: "BNB Smart Chain",
            nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com"],
          }],
        });
      }
      setAddress(accounts[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 disabled:cursor-not-allowed";

  const styles =
    variant === "primary"
      ? "bg-signal text-ink-950 hover:bg-signal-glow hover:shadow-signal active:scale-[0.98]"
      : "border border-ink-600 text-ink-100 hover:border-signal/60 hover:text-signal";

  return (
    <button
      type="button"
      onClick={handleConnect}
      disabled={isConnecting}
      className={`${base} ${styles} ${fullWidth ? "w-full" : ""}`}
    >
      {isConnecting ? (
        <><Loader2 size={16} className="animate-spin" /> Connecting…</>
      ) : address ? (
        <><span className="h-2 w-2 rounded-full bg-signal animate-pulseSlow" /> {truncateAddress(address)}</>
      ) : (
        <><Wallet size={16} /> Connect Wallet</>
      )}
    </button>
  );
}