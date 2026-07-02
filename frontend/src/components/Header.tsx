"use client";

import Link from "next/link";
import { Shield, Activity } from "lucide-react";
import ConnectWallet from "./ConnectWallet";

export default function Header() {
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
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Dashboard
          </Link>
          <ConnectWallet />
        </nav>
      </div>
    </header>
  );
}
