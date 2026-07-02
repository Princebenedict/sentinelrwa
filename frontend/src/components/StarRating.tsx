import { Star } from "lucide-react";

export function scoreToRating(score: number): { stars: number; label: string; color: string } {
  if (score >= 80) return { stars: 5, label: "Excellent", color: "#10b981" };
  if (score >= 60) return { stars: 4, label: "Good", color: "#22c55e" };
  if (score >= 40) return { stars: 3, label: "Average", color: "#f59e0b" };
  if (score >= 20) return { stars: 2, label: "Poor", color: "#f97316" };
  return { stars: 1, label: "Very Poor", color: "#ef4444" };
}

interface Props {
  score: number;
  rated: boolean;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export default function StarRating({ score, rated, size = "md", showLabel = true }: Props) {
  if (!rated) {
    return <span className="text-xs text-slate-500 italic">Awaiting AI validator rating</span>;
  }
  const { stars, label, color } = scoreToRating(score);
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={starSize}
            style={{
              fill: n <= stars ? color : "transparent",
              color: n <= stars ? color : "#3f3f5a",
            }}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs font-medium" style={{ color }}>
          {label} · {score}%
        </span>
      )}
    </div>
  );
}
