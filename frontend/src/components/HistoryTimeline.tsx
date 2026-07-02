"use client";

import { CheckCircle, AlertTriangle, XCircle, Brain } from "lucide-react";
import type { VerdictHistory } from "@/lib/types";

interface Props {
  history: VerdictHistory[];
}

const verdictConfig = {
  PASS: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  CONCERN: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  FAIL: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
};

export default function HistoryTimeline({ history }: Props) {
  if (history.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Brain className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 text-sm">No AI evaluations yet. Submit evidence and trigger an evaluation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...history].reverse().map((entry, i) => {
        const config = verdictConfig[entry.verdict] || verdictConfig.CONCERN;
        const Icon = config.icon;
        return (
          <div key={i} className={`glass-card p-5 border ${config.bg}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${config.color}`} />
                <div>
                  <span className={`font-bold text-sm ${config.color}`}>{entry.verdict}</span>
                  <span className="text-slate-500 text-xs ml-2">Evaluation #{entry.evaluation_number}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-mono font-bold">{entry.score}/100</div>
                <div className="text-slate-500 text-xs">{entry.risk} risk · {entry.confidence} confidence</div>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-3 leading-relaxed">{entry.reasoning}</p>

            {entry.key_findings && entry.key_findings.length > 0 && (
              <div className="space-y-1">
                {entry.key_findings.map((finding, j) => (
                  <div key={j} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">→</span>
                    {finding}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-600">Action: <span className="text-slate-400">{entry.recommended_action}</span></span>
              <span className="text-slate-600">{entry.evidence_count_at_eval} pieces of evidence evaluated</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}