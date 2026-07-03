"use client";

import { ShieldCheck, ShieldAlert, ShieldX, Shield } from "lucide-react";

const CONFIG: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  VERIFIED: { label: "Verified", color: "#00E699", icon: ShieldCheck },
  PARTIALLY_VERIFIED: { label: "Partially Verified", color: "#F59E0B", icon: Shield },
  UNVERIFIED: { label: "Unverified", color: "#94A3B8", icon: ShieldAlert },
  SUSPICIOUS: { label: "Suspicious", color: "#FF4D6D", icon: ShieldX },
};

export default function VerificationBadge({ status, size = "sm" }: { status: string; size?: "sm" | "lg" }) {
  const c = CONFIG[status] || CONFIG.UNVERIFIED;
  const Icon = c.icon;
  const pad = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-[10px]";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${pad}`}
      style={{ background: `${c.color}1f`, color: c.color, border: `1px solid ${c.color}44` }}>
      <Icon className={size === "lg" ? "w-4 h-4" : "w-3 h-3"} /> {c.label}
    </span>
  );
}
