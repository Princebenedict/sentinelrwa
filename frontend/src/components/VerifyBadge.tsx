"use client";

import { ShieldCheck, ShieldAlert, ShieldQuestion, ShieldX } from "lucide-react";

const config: Record<string, { label: string; color: string; bg: string; Icon: typeof ShieldCheck }> = {
  VERIFIED: { label: "Verified", color: "#00E699", bg: "rgba(0,230,153,0.12)", Icon: ShieldCheck },
  UNDER_REVIEW: { label: "Under Review", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", Icon: ShieldQuestion },
  UNVERIFIED: { label: "Unverified", color: "#94A3B8", bg: "rgba(148,163,184,0.12)", Icon: ShieldAlert },
  FLAGGED: { label: "Flagged", color: "#FF4D6D", bg: "rgba(255,77,109,0.12)", Icon: ShieldX },
};

export default function VerifyBadge({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) {
  const c = config[status] || config.UNVERIFIED;
  const Icon = c.Icon;
  const pad = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${pad}`} style={{ background: c.bg, color: c.color }}>
      <Icon className={size === "md" ? "w-3.5 h-3.5" : "w-3 h-3"} />
      {c.label}
    </span>
  );
}
