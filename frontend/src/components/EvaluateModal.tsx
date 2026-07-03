"use client";

import { useState, useEffect } from "react";
import { X, Brain, Zap, Wallet, FileUp, Search, Users, CheckCircle2, ScrollText, Loader2 } from "lucide-react";
import { useContract } from "@/hooks/useContract";
import { useWallet } from "@/hooks/useWallet";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  projectName: string;
}

const STAGES = [
  { icon: FileUp, label: "Submitting to GenLayer", color: "#7C5CFF" },
  { icon: Search, label: "Validators collecting evidence", color: "#3B82F6" },
  { icon: Users, label: "AI jury evaluating independently", color: "#00F5FF" },
  { icon: CheckCircle2, label: "Reaching consensus", color: "#00E699" },
  { icon: ScrollText, label: "Recording verdict on-chain", color: "#F59E0B" },
];

export default function EvaluateModal({ open, onClose, onSuccess, projectId, projectName }: Props) {
  const { evaluateProject, loading, error } = useContract();
  const { address, connect, connecting } = useWallet();
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(0);

  // Advance the visual stages while the on-chain tx is processing
  useEffect(() => {
    if (!running) return;
    // Move through the first 4 stages on a timer; the last stage waits for the real result
    const timers: ReturnType<typeof setTimeout>[] = [];
    const delays = [0, 6000, 16000, 40000]; // rough real-world timing of the stages
    delays.forEach((d, i) => {
      timers.push(setTimeout(() => setStage(i), d));
    });
    return () => timers.forEach(clearTimeout);
  }, [running]);

  if (!open) return null;

  const handleSubmit = async () => {
    setRunning(true);
    setStage(0);
    const result = await evaluateProject(projectId);
    if (result !== null) {
      setStage(STAGES.length - 1); // recorded on-chain
      setTimeout(() => {
        setRunning(false);
        setStage(0);
        onSuccess();
        onClose();
      }, 1200);
    } else {
      // failed, stop the animation so the error shows
      setRunning(false);
      setStage(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md" style={{ background: "#12121e" }}>
        <div className="flex items-center justify-between p-6 border-b border-[#1e1e32]">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" /> AI Verification
          </h2>
          {!running && (
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          )}
        </div>

        <div className="p-6 space-y-4">
          {!running ? (
            <>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-indigo-400 mt-0.5" />
                  <div>
                    <p className="text-indigo-300 font-medium text-sm">GenLayer AI Jury</p>
                    <p className="text-slate-400 text-xs mt-1">
                      Decentralized validators will independently research and verify <strong className="text-white">{projectName}</strong>,
                      then reach consensus on-chain. This takes 30 to 90 seconds.
                    </p>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg p-3">{error}</p>}
            </>
          ) : (
            // Live pipeline
            <div className="py-2">
              <div className="space-y-3">
                {STAGES.map((s, i) => {
                  const Icon = s.icon;
                  const done = i < stage;
                  const active = i === stage;
                  return (
                    <div key={i} className="flex items-center gap-3 transition-all"
                      style={{ opacity: done || active ? 1 : 0.35 }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
                        style={{ background: done || active ? `${s.color}22` : "rgba(255,255,255,0.04)", border: `1px solid ${done || active ? s.color + "55" : "rgba(255,255,255,0.08)"}` }}>
                        {active ? (
                          <Loader2 className="w-4 h-4 animate-spin" style={{ color: s.color }} />
                        ) : done ? (
                          <CheckCircle2 className="w-4 h-4" style={{ color: s.color }} />
                        ) : (
                          <Icon className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <span className="text-sm" style={{ color: done || active ? "#fff" : "#64748b" }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-slate-500 text-xs text-center mt-5">
                Please keep this open. Confirm the transaction in your wallet if prompted.
              </p>
            </div>
          )}
        </div>

        {!running && (
          <div className="p-6 pt-0 flex gap-3">
            <button onClick={onClose} className="flex-1 border border-[#1e1e32] text-slate-400 rounded-xl py-3 font-semibold hover:border-indigo-500 hover:text-white transition-all">Cancel</button>
            {address ? (
              <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                <Brain className="w-4 h-4" /> Run AI Verification
              </button>
            ) : (
              <button onClick={connect} disabled={connecting} className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                <Wallet className="w-4 h-4" /> {connecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
