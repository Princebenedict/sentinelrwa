"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, Shield, Zap } from "lucide-react";
import type { DashboardItem } from "@/lib/types";

// Count-up number
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1000);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n}{suffix}</>;
}

const TYPE_COLORS: Record<string, string> = {
  "Real Estate": "#3B82F6",
  Commodity: "#F59E0B",
  Commodities: "#F59E0B",
  Infrastructure: "#10B981",
  "Private Credit": "#06B6D4",
  Finance: "#06B6D4",
  Agricultural: "#84CC16",
  Energy: "#F97316",
  Other: "#8B5CF6",
};

// Asset-class distribution donut
export function AssetDonut({ projects }: { projects: DashboardItem[] }) {
  const counts: Record<string, number> = {};
  projects.forEach((p) => {
    const t = p.asset_type || "Other";
    counts[t] = (counts[t] || 0) + 1;
  });
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4" style={{ color: "#7C5CFF" }} />
        <h3 className="text-white font-semibold text-sm">Asset Distribution</h3>
      </div>
      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-slate-600 text-xs">No assets yet</div>
      ) : (
        <div className="flex items-center gap-4">
          <div style={{ width: 120, height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={38} outerRadius={58} paddingAngle={3} stroke="none">
                  {data.map((d, i) => (
                    <Cell key={i} fill={TYPE_COLORS[d.name] || "#8B5CF6"} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {data.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: TYPE_COLORS[d.name] || "#8B5CF6" }} />
                <span className="text-slate-400 flex-1 truncate">{d.name}</span>
                <span className="text-white font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Live activity ticker (derived from real project data)
export function ActivityTicker({ projects }: { projects: DashboardItem[] }) {
  const events: { icon: typeof Zap; color: string; text: string }[] = [];

  projects.forEach((p) => {
    if (p.evaluation_count > 0 && p.latest_verdict) {
      events.push({
        icon: Shield,
        color: p.latest_verdict === "PASS" ? "#00E699" : p.latest_verdict === "FAIL" ? "#FF4D6D" : "#F59E0B",
        text: `AI jury returned ${p.latest_verdict} for ${p.name} (score ${p.health_score})`,
      });
    }
    if (["INSURANCE_TRIGGERED", "CLAIM_ELIGIBLE"].includes(p.status)) {
      events.push({ icon: Zap, color: "#FF4D6D", text: `Insurance review triggered for ${p.name}` });
    }
    events.push({ icon: Activity, color: "#7C5CFF", text: `${p.name} registered and monitored on Bradbury` });
  });

  if (events.length === 0) {
    events.push({ icon: Activity, color: "#7C5CFF", text: "Waiting for the first asset to be registered..." });
  }

  // duplicate for smooth infinite scroll
  const loop = [...events, ...events];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00E699" }} />
        <h3 className="text-white font-semibold text-sm">Live Activity</h3>
        <span className="text-slate-600 text-xs ml-auto font-mono">on-chain feed</span>
      </div>
      <div className="ticker-mask relative h-10 overflow-hidden">
        <div className="ticker-track flex items-center gap-8 absolute whitespace-nowrap px-5 h-full">
          {loop.map((e, i) => {
            const Icon = e.icon;
            return (
              <span key={i} className="flex items-center gap-2 text-xs text-slate-300">
                <Icon className="w-3.5 h-3.5" style={{ color: e.color }} />
                {e.text}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
