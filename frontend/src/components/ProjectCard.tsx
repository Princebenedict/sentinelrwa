"use client";

import Link from "next/link";
import { Building2, Globe, TrendingUp } from "lucide-react";
import type { DashboardItem } from "@/lib/types";
import HealthBadge from "./HealthBadge";
import StarRating from "./StarRating";

interface Props {
  project: DashboardItem;
}

const riskColors = {
  LOW: "#10b981",
  MEDIUM: "#f59e0b",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

export default function ProjectCard({ project }: Props) {
  const barColor = riskColors[project.risk_level as keyof typeof riskColors] || "#10b981";
  const rated = project.evaluation_count > 0;

  return (
    <Link href={`/project/${project.project_id}`}>
      <div className="glass-card overflow-hidden hover:border-indigo-500/40 transition-all cursor-pointer group hover:glow-accent">
        <div className="relative w-full h-36 bg-[#0a0a12] overflow-hidden">
          {project.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image_url}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-10 h-10 text-slate-700" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <HealthBadge status={project.status} size="sm" />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20 shrink-0">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors truncate">
                {project.name}
              </h3>
              <p className="text-slate-500 text-xs">{project.asset_type}</p>
            </div>
          </div>

          <div className="mb-3">
            <StarRating score={project.health_score} rated={rated} size="sm" />
          </div>

          <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" /> {project.country}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {project.evaluation_count} evals
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">AI Score</span>
              <span className="font-mono font-bold" style={{ color: barColor }}>
                {rated ? project.health_score + "/100" : "-"}
              </span>
            </div>
            <div className="health-bar">
              <div
                className="health-bar-fill"
                style={{ width: (rated ? project.health_score : 0) + "%", backgroundColor: barColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
