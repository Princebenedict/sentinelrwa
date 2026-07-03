"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Activity, Layers, CheckCircle2, AlertTriangle, Gauge, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import RegisterProjectModal from "@/components/RegisterProjectModal";
import { CountUp, AssetDonut, ActivityTicker } from "@/components/DashboardWidgets";
import { useContract } from "@/hooks/useContract";
import type { DashboardItem } from "@/lib/types";

// A sample asset shown only when the user has none, so the dashboard never looks empty.
const DEMO_ASSET: DashboardItem = {
  project_id: "demo-lagos-tower",
  name: "Green Tower Lagos (Demo)",
  asset_type: "Real Estate",
  country: "Nigeria",
  image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  health_score: 88,
  risk_level: "LOW",
  status: "HEALTHY",
  latest_verdict: "PASS",
  evaluation_count: 3,
};

export default function DashboardPage() {
  const { getDashboard, loading } = useContract();
  const [projects, setProjects] = useState<DashboardItem[]>([]);
  const [showRegister, setShowRegister] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const data = await getDashboard();
    if (data) setProjects(Array.isArray(data) ? data : []);
    setLoaded(true);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const hasReal = projects.length > 0;
  const display = hasReal ? projects : [DEMO_ASSET];

  const stats = {
    total: projects.length,
    healthy: projects.filter((p) => p.status === "HEALTHY").length,
    atRisk: projects.filter((p) => ["REVIEW_REQUIRED", "INSURANCE_TRIGGERED", "CLAIM_ELIGIBLE"].includes(p.status)).length,
    avgScore: projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.health_score, 0) / projects.length) : 0,
  };

  const statCards = [
    { label: "Total Assets", value: stats.total, suffix: "", icon: Layers, color: "#7C5CFF" },
    { label: "Healthy", value: stats.healthy, suffix: "", icon: CheckCircle2, color: "#00E699" },
    { label: "At Risk", value: stats.atRisk, suffix: "", icon: AlertTriangle, color: "#FF4D6D" },
    { label: "Avg Score", value: stats.avgScore, suffix: "/100", icon: Gauge, color: "#00F5FF" },
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map(({ label, value, suffix, icon: Icon, color }, i) => (
            <div key={label} className="rounded-2xl p-5 relative overflow-hidden card-in" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", animationDelay: `${i * 0.08}s` }}>
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20" style={{ background: color }} />
              <div className="flex items-center justify-between mb-3 relative">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}1f`, border: `1px solid ${color}33` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
              </div>
              <p className="text-slate-500 text-xs relative">{label}</p>
              <p className="text-2xl font-bold mt-1 relative" style={{ color }}>
                {loaded ? <CountUp value={value} suffix={suffix} /> : `0${suffix}`}
              </p>
            </div>
          ))}
        </div>

        {/* Live ticker + distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 card-in" style={{ animationDelay: "0.3s" }}>
            <ActivityTicker projects={hasReal ? projects : []} />
          </div>
          <div className="card-in" style={{ animationDelay: "0.38s" }}>
            <AssetDonut projects={display} />
          </div>
        </div>

        {/* Demo banner */}
        {loaded && !hasReal && (
          <div className="rounded-xl px-4 py-3 mb-5 flex items-center gap-3 card-in" style={{ background: "rgba(124,92,255,0.08)", border: "1px solid rgba(124,92,255,0.2)" }}>
            <Sparkles className="w-4 h-4 shrink-0" style={{ color: "#7C5CFF" }} />
            <p className="text-slate-300 text-xs">
              This is a <strong className="text-white">sample asset</strong> so you can see how monitoring looks.
              Register your own asset to replace it with live data.
            </p>
          </div>
        )}

        {/* Projects grid */}
        {loading && projects.length === 0 ? (
          <div className="text-center py-20 text-slate-500">Loading assets...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {display.map((p, i) => (
              <div key={p.project_id} className="card-in" style={{ animationDelay: `${0.4 + i * 0.06}s` }}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        )}
      </div>

      <RegisterProjectModal open={showRegister} onClose={() => setShowRegister(false)} onSuccess={load} />
    </div>
  );
}
