"use client";

import { CheckCircle, AlertTriangle, XCircle, ShieldQuestion, Brain, Quote, TrendingUp } from "lucide-react";
import type { VerdictHistory } from "@/lib/types";

interface Props {
  history: VerdictHistory[];
}

type VerdictStyle = { icon: typeof CheckCircle; color: string; bg: string; label: string };

const verdictConfig: Record<string, VerdictStyle> = {
  VERIFIED: { icon: CheckCircle, color: "#00E699", bg: "rgba(0,230,153,0.08)", label: "Verified" },
  PARTIALLY_VERIFIED: { icon: AlertTriangle, color: "#F59E0B", bg: "rgba(245,158,11,0.08)", label: "Partially Verified" },
  UNVERIFIED: { icon: ShieldQuestion, color: "#94A3B8", bg: "rgba(148,163,184,0.08)", label: "Unverified" },
  SUSPICIOUS: { icon: XCircle, color: "#FF4D6D", bg: "rgba(255,77,109,0.08)", label: "Suspicious" },
  PASS: { icon: CheckCircle, color: "#00E699", bg: "rgba(0,230,153,0.08)", label: "Verified" },
  CONCERN: { icon: AlertTriangle, color: "#F59E0B", bg: "rgba(245,158,11,0.08)", label: "Concern" },
  FAIL: { icon: XCircle, color: "#FF4D6D", bg: "rgba(255,77,109,0.08)", label: "Failed" },
};

const DEFAULT_STYLE: VerdictStyle = { icon: ShieldQuestion, color: "#94A3B8", bg: "rgba(148,163,184,0.08)", label: "Unverified" };

export default function HistoryTimeline({ history }: Props) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <Brain className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 text-sm">No AI verifications yet. Submit evidence and run a verification to see the reasoning here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {[...history].reverse().map((entry, i) => {
        const c = verdictConfig[entry.verdict] || DEFAULT_STYLE;
        const Icon = c.icon;
        const isLatest = i === 0;
        return (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ background: c.bg, border: `1px solid ${c.color}33` }}>
            {/* Verdict header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${c.color}22` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${c.color}22`, border: `1px solid ${c.color}55` }}>
                  <Icon className="w-5 h-5" style={{ color: c.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base" style={{ color: c.color }}>{c.label}</span>
                    {isLatest && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">Latest</span>}
                  </div>
                  <span className="text-slate-500 text-xs">Evaluation #{entry.evaluation_number} · {entry.evidence_count_at_eval} evidence item{entry.evidence_count_at_eval === 1 ? "" : "s"} assessed</span>
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* AI reasoning is the hero */}
              <div className="flex gap-3 mb-4">
                <Quote className="w-4 h-4 shrink-0 mt-1" style={{ color: c.color }} />
                <p className="text-white text-sm leading-relaxed">{entry.reasoning || "No reasoning recorded."}</p>
              </div>

              {/* Key findings */}
              {entry.key_findings && entry.key_findings.length > 0 && (
                <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Key Findings</p>
                  <div className="space-y-1.5">
                    {entry.key_findings.map((finding, j) => (
                      <div key={j} className="text-sm text-slate-300 flex items-start gap-2">
                        <span style={{ color: c.color }} className="mt-0.5">→</span>
                        {finding}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supporting metrics (secondary) */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="rounded-lg p-2" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" /> Score</p>
                  <p className="font-mono font-bold text-sm mt-0.5" style={{ color: c.color }}>{entry.score}/100</p>
                </div>
                <div className="rounded-lg p-2" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">Risk</p>
                  <p className="text-white font-semibold text-sm mt-0.5">{entry.risk}</p>
                </div>
                <div className="rounded-lg p-2" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">Confidence</p>
                  <p className="text-white font-semibold text-sm mt-0.5">{entry.confidence}</p>
                </div>
                <div className="rounded-lg p-2" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">Action</p>
                  <p className="text-white font-semibold text-[11px] mt-0.5">{entry.recommended_action?.replace(/_/g, " ")}</p>
                </div>
              </div>

              {/* GenLayer attribution */}
              <div className="mt-4 pt-3 flex items-center gap-2 text-xs text-slate-500" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <Brain className="w-3.5 h-3.5" style={{ color: "#7C5CFF" }} />
                Verified by GenLayer AI validator consensus · recorded on-chain
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
