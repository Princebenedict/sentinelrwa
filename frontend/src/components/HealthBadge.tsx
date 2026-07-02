import { cn } from "@/lib/utils";

interface Props {
  status: string;
  score?: number;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  HEALTHY: { color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", label: "Healthy" },
  MONITOR: { color: "text-amber-400 bg-amber-400/10 border-amber-400/20", label: "Monitor" },
  REVIEW_REQUIRED: { color: "text-orange-400 bg-orange-400/10 border-orange-400/20", label: "Review Required" },
  INSURANCE_TRIGGERED: { color: "text-red-400 bg-red-400/10 border-red-400/20", label: "Insurance Triggered" },
  CLAIM_ELIGIBLE: { color: "text-red-500 bg-red-500/20 border-red-500/30", label: "Claim Eligible" },
};

export default function HealthBadge({ status, score, size = "md" }: Props) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.HEALTHY;
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : size === "lg" ? "text-sm px-4 py-2" : "text-xs px-3 py-1";

  return (
    <span className={cn("rounded-full border font-medium", config.color, sizeClass)}>
      {config.label}
      {score !== undefined && ` · ${score}/100`}
    </span>
  );
}