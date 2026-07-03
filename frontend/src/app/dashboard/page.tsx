"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Activity, Layers, CheckCircle2, AlertTriangle, Gauge } from "lucide-react";
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

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const stats = {
    total: projects.length,
    healthy: projects.filter((p) => p.status === "HEALTHY").length,
    atRisk: projects.filter((p) => ["REVIEW_REQUIRED", "INSURANCE_TRIGGERED", "CLAIM_ELIGIBLE"].includes(p.status)).length,
    avgScore: projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.health_score, 0) / projects.length) : 0,
  };

  const statCards = [
    { label: "Total Assets", value: stats.total, icon: Layers, color: "#7C5CFF" },
    { label: "Healthy", value: stats.healthy, icon: CheckCircle2, color: "#00E699" },
    { label: "At Risk", value: stats.atRisk, icon: AlertTriangle, color: "#FF4D6D" },
    { label: "Avg Score", value: `${stats.avgScore}/100`, icon: Gauge, color: "#00F5FF" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0B" }}>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6" style={{ color: "#7C5CFF" }} /> Asset Dashboard
              </h1>
              <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(0,230,153,0.1)", color: "#00E699", border: "1px solid rgba(0,230,153,0.2)" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00E699" }} />
                Live on Bradbury
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">AI-monitored real-world assets on GenLayer</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} disabled={loading} aria-label="Refresh"
              className="p-2.5 rounded-xl border text-slate-400 hover:text-white transition-all" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <RefreshCw className={loading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
            </button>
            <button onClick={() => setShowRegister(true)}
              className="text-white font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm"
              style={{ background: "linear-gradient(135deg, #7C5CFF, #6d4ee8)", boxShadow: "0 6px 24px rgba(124,92,255,0.35)" }}>
              <Plus className="w-4 h-4" /> Register Asset
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20" style={{ background: color }} />
              <div className="flex items-center justify-between mb-3 relative">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}1f`, border: `1px solid ${color}33` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
              </div>
              <p className="text-slate-500 text-xs relative">{label}</p>
              <p className="text-2xl font-bold mt-1 relative" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Projects or empty state */}
        {loading && projects.length === 0 ? (
          <div className="text-center py-20 text-slate-500">Loading assets...</div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl p-12 text-center relative overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="absolute top-[-30%] left-1/2 w-72 h-72 rounded-full blur-[100px] opacity-20" style={{ background: "#7C5CFF", transform: "translateX(-50%)" }} />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(124,92,255,0.12)", border: "1px solid rgba(124,92,255,0.25)" }}>
                <Layers className="w-8 h-8" style={{ color: "#7C5CFF" }} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">No assets yet</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                Register your first real-world asset to start AI-powered monitoring. Add evidence,
                run an evaluation, and let the GenLayer jury score it.
              </p>
              <button onClick={() => setShowRegister(true)}
                className="text-white font-semibold px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2"
                style={{ background: "linear-gradient(135deg, #7C5CFF, #6d4ee8)", boxShadow: "0 6px 24px rgba(124,92,255,0.35)" }}>
                <Plus className="w-4 h-4" /> Register Your First Asset
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => <ProjectCard key={p.project_id} project={p} />)}
          </div>
        )}
      </div>

      <RegisterProjectModal open={showRegister} onClose={() => setShowRegister(false)} onSuccess={load} />
    </div>
  );
}
