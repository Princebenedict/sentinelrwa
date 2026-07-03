"use client";

import { Star } from "lucide-react";

interface Props {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function scoreToStars(score: number): number {
  if (score >= 90) return 5;
  if (score >= 70) return 4;
  if (score >= 50) return 3;
  if (score >= 30) return 2;
  if (score > 0) return 1;
  return 0;
}

function scoreToLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  if (score >= 30) return "Poor";
  if (score > 0) return "Very Poor";
  return "Unrated";
}

export default function StarRating({ score, size = "md", showLabel = true }: Props) {
  const stars = scoreToStars(score);
  const starSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-xs";

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={i <= stars ? `${starSize} fill-amber-400 text-amber-400` : `${starSize} text-slate-600`}
          />
        ))}
      </div>
      {showLabel && (
        <span className={`${textSize} text-slate-400`}>
          {scoreToLabel(score)} · {score}%
        </span>
      )}
    </div>
  );
}
