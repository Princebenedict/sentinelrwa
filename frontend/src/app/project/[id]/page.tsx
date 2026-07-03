"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Brain, FileText, RefreshCw, Building2, MapPin, Gauge, Tag } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import HealthBadge from "@/components/HealthBadge";
import StarRating from "@/components/StarRating";
import VerifyBadge from "@/components/VerifyBadge";
import HistoryTimeline from "@/components/HistoryTimeline";
import InsuranceBanner from "@/components/InsuranceBanner";
import SubmitEvidenceModal from "@/components/SubmitEvidenceModal";
import EvaluateModal from "@/components/EvaluateModal";
import { useContract } from "@/hooks/useContract";
import type { Project, ProjectHealth, VerdictHistory, InsuranceState, EvidenceEntry } from "@/lib/types";

export default function ProjectPage() {
  const params = useParams();
  // Decode the URL param so IDs with encoded characters resolve correctly
  const id = decodeURIComponent((params.id as string) || "");
  const { getProject, getHealth, getHistory, getInsuranceState, getEvidence, loading } = useContract();

  const [project, setProject] = useState<Project | null>(null);
  const [health, setHealth] = useState<ProjectHealth | null>(null);
  const [history, setHistory] = useState<VerdictHistory[]>([]);
  const [insurance, setInsurance] = useState<InsuranceState | null>(null);
  const [evidence, setEvidence] = useState<EvidenceEntry[]>([]);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showEvaluate, setShowEvaluate] = useState(false);
  const [activeTab, setActiveTab] = useState<"history" | "evidence">("history");

  const load = async () => {
    if (id === "demo-lagos-tower") { return; }
    const [p, h, hist, ins, ev] = await Promise.all([
      getProject(id), getHealth(id), getHistory(id), getInsuranceState(id), getEvidence(id),
    ]);
    if (p && !("error" in (p as object))) setProject(p as Project);
    if (h) setHealth(h as ProjectHealth);
    if (hist) setHistory((Array.isArray(hist) ? hist : []) as VerdictHistory[]);
    if (ins && !("error" in (ins as object))) setInsurance(ins as InsuranceState);
    if (ev) setEvidence((Array.isArray(ev) ? ev : []) as EvidenceEntry[]);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  const riskColors = { LOW: "#10b981", MEDIUM: "#f59e0b", HIGH: "#f97316", CRITICAL: "#ef4444" };
  const barColor = health ? riskColors[health.risk_level as keyof typeof riskColors] || "#f59e0b" : "#f59e0b";

  if (!project && !loading) {
    return (
      <div className="min-h-screen"><Header />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-red-400">Project not found: {id}</p>
          <Link href="/dashboard" className="text-indigo-400 mt-4 block">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen"><Header />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/dashboard" className="text-slate-500 hover:text-white text-sm flex items-center gap-2 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        {loading && !project ? (
          <div className="text-slate-500 text-center py-20">Loading project...</div>
        ) : (
          <>
            {project?.image_url && (
              <div className="w-full h-56 rounded-2xl overflow-hidden mb-6 border border-[#1e1e32] bg-[#0a0a12] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.image_url} alt={project.name} className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                {project.price && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-sm font-semibold text-white px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.7)" }}>
                    <Tag className="w-4 h-4" style={{ color: "#7C5CFF" }} /> {project.price}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-white">{project?.name}</h1>
                    {health && <VerifyBadge status={health.verification} size="md" />}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {project?.location || project?.country}</span>
                    <span>{project?.asset_type}</span>
                    <span>ID: <code className="font-mono text-slate-400">{id}</code></span>
                  </div>
                </div>
              </div>
              {health && <HealthBadge status={health.status} score={health.health_score} size="lg" />}
            </div>

            {insurance && insurance.insurance_triggered && (
              <div className="mb-6"><InsuranceBanner state={insurance} /></div>
            )}

            {health && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-5 md:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400 text-sm flex items-center gap-1"><Gauge className="w-4 h-4" /> AI Rating</span>
                    <StarRating score={health.health_score} size="lg" />
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Health Score</span>
                    <span className="font-mono font-bold text-xl" style={{ color: barColor }}>{health.health_score}/100</span>
                  </div>
                  <div className="health-bar mb-3">
                    <div className="health-bar-fill" style={{ width: health.health_score + "%", backgroundColor: barColor }} />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="bg-[#0a0a12] rounded-lg p-2"><p className="text-slate-500">Risk</p><p className="text-white font-semibold mt-0.5">{health.risk_level}</p></div>
                    <div className="bg-[#0a0a12] rounded-lg p-2"><p className="text-slate-500">Evaluations</p><p className="text-white font-semibold mt-0.5">{health.evaluation_count}</p></div>
                    <div className="bg-[#0a0a12] rounded-lg p-2"><p className="text-slate-500">Evidence</p><p className="text-white font-semibold mt-0.5">{evidence.length}</p></div>
                  </div>
                </div>

                <div className="glass-card p-5">
                  <p className="text-slate-400 text-sm font-medium mb-3">Trust & Insurance</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center"><span className="text-slate-500">Verification</span><VerifyBadge status={health.verification} /></div>
                    <div className="flex justify-between"><span className="text-slate-500">Insurance</span><span className={insurance?.insurance_triggered ? "text-red-400" : "text-emerald-400"}>{insurance?.insurance_triggered ? "Triggered" : "Normal"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Claim Eligible</span><span className={insurance?.claim_eligible ? "text-red-400" : "text-slate-500"}>{insurance?.claim_eligible ? "Yes" : "No"}</span></div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mb-8">
              <button onClick={() => setShowEvidence(true)} className="flex-1 flex items-center justify-center gap-2 border border-[#1e1e32] hover:border-indigo-500/40 text-slate-300 hover:text-white rounded-xl py-3 text-sm font-semibold transition-all">
                <FileText className="w-4 h-4" /> Submit Evidence
              </button>
              <button onClick={() => setShowEvaluate(true)} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-sm font-semibold transition-all">
                <Brain className="w-4 h-4" /> Run AI Evaluation
              </button>
              <button onClick={load} disabled={loading} aria-label="Refresh" className="p-3 border border-[#1e1e32] text-slate-400 hover:text-white rounded-xl transition-all">
                <RefreshCw className={loading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
              </button>
            </div>

            <div className="flex gap-1 bg-[#12121e] border border-[#1e1e32] rounded-xl p-1 mb-6 w-fit">
              {(["history", "evidence"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={activeTab === tab ? "px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize bg-indigo-600 text-white" : "px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize text-slate-500 hover:text-white"}>
                  {tab === "history" ? "AI Verdicts" : "Evidence"}
                </button>
              ))}
            </div>

            {activeTab === "history" ? (
              <HistoryTimeline history={history} />
            ) : (
              <div className="space-y-3">
                {evidence.length === 0 ? (
                  <div className="glass-card p-8 text-center">
                    <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No evidence submitted yet.</p>
                  </div>
                ) : (
                  [...evidence].reverse().map((ev, i) => (
                    <div key={i} className="glass-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{ev.evidence_type}</span>
                        {ev.source_url && (
                          <a href={ev.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors truncate max-w-[200px]">{ev.source_url}</a>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm">{ev.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      <SubmitEvidenceModal open={showEvidence} onClose={() => setShowEvidence(false)} onSuccess={load} projectId={id} />
      <EvaluateModal open={showEvaluate} onClose={() => setShowEvaluate(false)} onSuccess={load} projectId={id} projectName={project?.name || id} />
    </div>
  );
}
