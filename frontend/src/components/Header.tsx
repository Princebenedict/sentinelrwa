"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shield, Activity, Wallet, LogOut, ShieldAlert } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { callView } from "@/lib/genlayer";

export default function Header() {
  const { address, connect, disconnect, connecting } = useWallet();
  const [owner, setOwner] = useState<string | null>(null);
  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  useEffect(() => {
    if (!address) return;
    callView<string>("get_owner").then((o) => {
      if (typeof o === "string") setOwner(o);
    }).catch(() => {});
  }, [address]);

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  return (
    <header className="border-b border-[#1e1e32] bg-[#0a0a12]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center sentinel-logo">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">SentinelRWA</span>
            <span className="text-indigo-400 text-xs ml-2 font-mono">on GenLayer</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/dashboard"
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Dashboard
          </Link>

          {isOwner && (
            <Link href="/admin"
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Admin
            </Link>
          )}

          {address ? (
            <button onClick={disconnect}
              className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all group"
              title="Disconnect">
              <Wallet className="w-4 h-4" />
              <span className="font-mono">{short}</span>
              <LogOut className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ) : (
            <button onClick={connect} disabled={connecting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
              <Wallet className="w-4 h-4" />
              {connecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
