"use client";

import { useEffect, useState, useCallback } from "react";
import { ShieldAlert, Trash2, RefreshCw, Building2, Lock } from "lucide-react";
import Header from "@/components/Header";
import { useContract } from "@/hooks/useContract";
import { useWallet } from "@/hooks/useWallet";
import type { DashboardItem } from "@/lib/types";

export default function AdminPage() {
  const { getDashboard, getOwner, removeProject, loading, error } = useContract();
  const { address } = useWallet();
  const [projects, setProjects] = useState<DashboardItem[]>([]);
  const [owner, setOwner] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [dash, own] = await Promise.all([getDashboard(), getOwner()]);
    if (dash) setProjects(Array.isArray(dash) ? dash : []);
    if (own && typeof own === "string") setOwner(own);
  }, [getDashboard, getOwner]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOwner =
    address && owner && address.toLowerCase() === owner.toLowerCase();

  const handleRemove = async (id: string) => {
    if (!confirm(`Remove project "${id}"? This cannot be undone.`)) return;
    setRemovingId(id);
    const res = await removeProject(id);
    setRemovingId(null);
    if (res !== null) load();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-indigo-400" /> Admin Panel
            </h1>
            <p className="text-slate-500 text-sm mt-1">Owner controls for managing assets</p>
          </div>
          <button onClick={load} disabled={loading} aria-label="Refresh"
            className="p-2 rounded-lg border border-[#1e1e32] text-slate-400 hover:text-white transition-all">
            <RefreshCw className={loading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
          </button>
        </div>

        {!address ? (
          <div className="glass-card p-10 text-center">
            <Lock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Connect your wallet to access the admin panel.</p>
          </div>
        ) : !isOwner ? (
          <div className="glass-card p-10 text-center">
            <Lock className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">Access Denied</p>
            <p className="text-slate-500 text-sm">
              Only the contract owner can access this panel.
            </p>
            {owner && (
              <p className="text-slate-600 text-xs mt-3 font-mono">
                Owner: {owner.slice(0, 10)}...{owner.slice(-6)}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-6 text-sm text-emerald-300">
              Owner access verified. You can remove projects below.
            </div>

            {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg p-3 mb-4">{error}</p>}

            {projects.length === 0 ? (
              <div className="glass-card p-10 text-center">
                <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">No projects registered yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.project_id} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate">{p.name}</p>
                        <p className="text-slate-500 text-xs">
                          <span className="font-mono">{p.project_id}</span> · {p.asset_type} · {p.country}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(p.project_id)}
                      disabled={removingId === p.project_id}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-lg px-3 py-2 text-sm transition-all disabled:opacity-50 shrink-0"
                    >
                      {removingId === p.project_id ? (
                        <span className="animate-spin w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
