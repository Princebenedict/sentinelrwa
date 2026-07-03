"use client";

import Link from "next/link";
import { Building2, MapPin, TrendingUp, Tag } from "lucide-react";
import type { DashboardItem } from "@/lib/types";
import StarRating from "./StarRating";
import VerificationBadge from "./VerificationBadge";

interface Props {
  project: DashboardItem;
}

const riskColors = { LOW: "#10b981", MEDIUM: "#f59e0b", HIGH: "#f97316", CRITICAL: "#ef4444" };

export default function ProjectCard({ project }: Props) {
  const barColor = riskColors[project.risk_level as keyof typeof riskColors] || "#f97316";
  const evaluated = project.evaluation_count > 0;

  return (
    <Link href={`/project/${encodeURIComponent(project.project_id)}`}>
      <div className="rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all cursor-pointer group"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Image */}
        <div className="relative w-full h-40 bg-[#0a0a12] overflow-hidden">
          {project.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.image_url} alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-10 h-10 text-slate-700" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <VerificationBadge status={project.verification_status} />
          </div>
          {project.price && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-white"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
              <Tag className="w-3 h-3" /> {project.price}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20 shrink-0">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors truncate">{project.name}</h3>
              <p className="text-slate-500 text-xs">{project.asset_type}</p>
            </div>
          </div>

          {/* Rating or awaiting */}
          <div className="mb-3">
            {evaluated ? (
              <StarRating score={project.health_score} size="sm" />
            ) : (
              <span className="text-xs text-slate-500 italic">Awaiting AI verification</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0" /> {project.location || project.country}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <TrendingUp className="w-3 h-3" /> {project.evaluation_count} evals
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Trust Score</span>
              <span className="font-mono font-bold" style={{ color: evaluated ? barColor : "#64748b" }}>
                {evaluated ? `${project.health_score}/100` : "—"}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1e1e32" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${project.health_score}%`, background: barColor }} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
