"use client";

import { FileUp, Search, Users, CheckCircle2, ScrollText, Clock } from "lucide-react";
import type { VerdictHistory, EvidenceEntry } from "@/lib/types";

interface Props {
  history: VerdictHistory[];
  evidenceCount: number;
}

// Builds a transparent, real timeline from on-chain data:
// registration -> evidence -> each AI evaluation (verdict + score).
export default function IntelligenceTimeline({ history, evidenceCount }: Props) {
  const steps: { icon: typeof FileUp; color: string; title: string; detail: string }[] = [];

  steps.push({
    icon: FileUp,
    color: "#7C5CFF",
    title: "Asset registered on GenLayer",
    detail: "Claim submitted and recorded on Bradbury Testnet, starting as UNVERIFIED.",
  });

  if (evidenceCount > 0) {
    steps.push({
      icon: Search,
      color: "#3B82F6",
      title: `${evidenceCount} piece${evidenceCount > 1 ? "s" : ""} of evidence collected`,
      detail: "Documentation and sources submitted for the AI jury to evaluate.",
    });
  }

  // One timeline entry per real evaluation
  history.forEach((h) => {
    const verdictColor =
      h.verdict === "VERIFIED" ? "#00E699"
      : h.verdict === "PARTIALLY_VERIFIED" ? "#F59E0B"
      : h.verdict === "SUSPICIOUS" ? "#FF4D6D"
      : "#94A3B8";
    steps.push({
      icon: Users,
      color: "#00F5FF",
      title: `AI jury evaluation #${h.evaluation_number}`,
      detail: `${h.evidence_count_at_eval} evidence item${h.evidence_count_at_eval === 1 ? "" : "s"} assessed by decentralized validators.`,
    });
    steps.push({
      icon: CheckCircle2,
      color: verdictColor,
      title: `Consensus: ${h.verdict?.replace(/_/g, " ")} · ${h.score}/100`,
      detail: h.reasoning || "Verdict reached and recorded.",
    });
  });

  if (history.length > 0) {
    steps.push({
      icon: ScrollText,
      color: "#F59E0B",
      title: "Verification recorded on-chain",
      detail: "The latest verdict and its reasoning are permanently stored on GenLayer.",
    });
  }

  if (steps.length <= 1) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 text-sm">
          The intelligence timeline builds as evidence is added and the AI jury runs. Submit evidence and run a verification to begin.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <h3 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
        <Clock className="w-4 h-4" style={{ color: "#7C5CFF" }} /> Intelligence Timeline
      </h3>
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-[2px]" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="space-y-5">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10" style={{ background: `${s.color}1f`, border: `1px solid ${s.color}55` }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <div className="pt-1 min-w-0">
                  <p className="text-white text-sm font-medium">{s.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{s.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
