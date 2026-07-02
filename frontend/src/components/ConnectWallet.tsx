"use client";

import { Wallet, LogOut } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

export default function ConnectWallet() {
  const { address, connect, disconnect, isConnecting } = useWallet();

  if (address) {
    const short = address.slice(0, 6) + "..." + address.slice(-4);
    return (
      <button
        onClick={disconnect}
        title="Disconnect"
        className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-200 hover:text-white hover:border-indigo-500 rounded-xl px-3 py-2 text-sm font-medium transition-all"
      >
        <Wallet className="w-4 h-4" />
        <span className="font-mono">{short}</span>
        <LogOut className="w-3.5 h-3.5 opacity-60" />
      </button>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50"
    >
      <Wallet className="w-4 h-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
