"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Activity } from "lucide-react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import RegisterProjectModal from "@/components/RegisterProjectModal";
import { useContract } from "@/hooks/useContract";
import type { DashboardItem } from "@/lib/types";

export default function DashboardPage() {
  const { getDashboard, loading } = useContract();
  const [projects, setProjects] = useState<DashboardItem[]>([]);
  const [showRegister, setShowRegister] = useState(false);

  const load = async () => {
    const data = await getDashboard();
    if (data) setProjects(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, [getDashboard]);

  const stats = {
    total: projects.length,
    healthy: projects.filter(p => p.status === "HEALTHY").length,
    atRisk: projects.filter(p => ["REVIEW_REQUIRED", "INSURANCE_TRIGGERED", "CLAIM_ELIGIBLE"].includes(p.status)).length,
    avgScore: projects.length > 0
      ? Math.round(projects.reduce((s, p) => s + p.health_score, 0) / projects.length)
      : 0,
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-400" /> Asset Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">AI-monitored real-world assets on GenLayer</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} disabled={loading}
              className="text-slate-400 hover:text-white p-2 rounded-lg border border-[#1e1e32] hover:border-indigo-500/40 transition-all">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Register Asset
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Assets", value: stats.total },
            { label: "Healthy", value: stats.healthy, color: "text-emerald-400" },
            { label: "At Risk", value: stats.atRisk, color: "text-red-400" },
            { label: "Avg Score", value: `${stats.avgScore}/100` },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card p-4">
              <p className="text-slate-500 text-xs">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color || "text-white"}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Projects Grid */}
        {loading && projects.length === 0 ? (
          <div className="text-center py-20 text-slate-500">Loading assets...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">No assets registered yet</h3>
            <p className="text-slate-500 text-sm mb-6">Register your first real-world asset to start AI monitoring</p>
            <button
              onClick={() => setShowRegister(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Register First Asset
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => <ProjectCard key={p.project_id} project={p} />)}
          </div>
        )}
      </div>

      <RegisterProjectModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={load}
      />
    </div>
  );
}