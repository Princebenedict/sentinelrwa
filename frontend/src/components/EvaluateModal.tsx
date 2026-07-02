"use client";

import { useState } from "react";
import { X, Brain, Zap } from "lucide-react";
import { useContract } from "@/hooks/useContract";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  projectName: string;
}

export default function EvaluateModal({ open, onClose, onSuccess, projectId, projectName }: Props) {
  const { evaluateProject, loading, error } = useContract();
  const [privateKey, setPrivateKey] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    const result = await evaluateProject(projectId, privateKey);
    if (result !== null) { onSuccess(); onClose(); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-[#1e1e32]">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" /> AI Jury Evaluation
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <p className="text-indigo-300 font-medium text-sm">GenLayer AI Jury</p>
                <p className="text-slate-400 text-xs mt-1">
                  This will trigger a decentralized AI jury evaluation of <strong className="text-white">{projectName}</strong>.
                  Multiple GenLayer validators will independently assess all submitted evidence and reach consensus.
                  This is an on-chain transaction and may take 30–90 seconds.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs font-medium mb-1 block">Private Key</label>
            <input type="password" value={privateKey} onChange={e => setPrivateKey(e.target.value)}
              placeholder="0x..."
              className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg p-3">{error}</p>}
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-[#1e1e32] text-slate-400 rounded-xl py-3 font-semibold hover:border-indigo-500 hover:text-white transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading || !privateKey}
            className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                Evaluating...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" /> Trigger AI Jury
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}