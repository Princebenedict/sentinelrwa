"use client";

import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import type { InsuranceState } from "@/lib/types";

interface Props {
  state: InsuranceState;
}

export default function InsuranceBanner({ state }: Props) {
  if (!state.insurance_triggered && state.status === "HEALTHY") return null;

  const isEligible = state.claim_eligible;
  const isTriggered = state.insurance_triggered;

  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 ${
      isEligible
        ? "bg-red-500/10 border-red-500/30"
        : isTriggered
        ? "bg-orange-500/10 border-orange-500/30"
        : "bg-amber-500/10 border-amber-500/30"
    }`}>
      {isEligible ? (
        <ShieldX className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
      ) : isTriggered ? (
        <ShieldAlert className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
      ) : (
        <ShieldCheck className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
      )}
      <div>
        <p className={`font-semibold text-sm ${isEligible ? "text-red-400" : isTriggered ? "text-orange-400" : "text-amber-400"}`}>
          {isEligible ? "Insurance Claim Eligible" : isTriggered ? "Insurance Triggered" : "Review Required"}
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Health score {state.health_score}/100 has {
            isTriggered ? `fallen below the threshold of ${state.insurance_threshold}` : "triggered a review"
          }. Risk level: <strong>{state.risk_level}</strong>.
          {isEligible && " This project may be eligible for an insurance claim."}
        </p>
      </div>
    </div>
  );
}