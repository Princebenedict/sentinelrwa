"use client";

import { useState } from "react";
import { X, FileText } from "lucide-react";
import { useContract } from "@/hooks/useContract";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
}

export default function SubmitEvidenceModal({ open, onClose, onSuccess, projectId }: Props) {
  const { submitEvidence, loading, error } = useContract();
  const [form, setForm] = useState({
    evidence_type: "inspection_report",
    content: "",
    source_url: "",
    privateKey: "",
  });

  if (!open) return null;

  const handleSubmit = async () => {
    const result = await submitEvidence({ project_id: projectId, ...form });
    if (result !== null) { onSuccess(); onClose(); }
  };

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(p => ({ ...p, [k]: e.target.value }));

  const evidenceTypes = [
    "inspection_report", "news_summary", "financial_report",
    "maintenance_log", "weather_summary", "photo_description",
    "tenant_feedback", "compliance_audit", "external_reference"
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-[#1e1e32]">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Submit Evidence
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-slate-400 text-xs font-medium mb-1 block">Evidence Type</label>
            <select value={form.evidence_type} onChange={set("evidence_type")}
              className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500">
              {evidenceTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-xs font-medium mb-1 block">Content</label>
            <textarea value={form.content} onChange={set("content")} rows={5}
              placeholder="Describe the evidence in detail..."
              className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none" />
          </div>
          <div>
            <label className="text-slate-400 text-xs font-medium mb-1 block">Source URL (optional — will be fetched)</label>
            <input type="url" value={form.source_url} onChange={set("source_url")}
              placeholder="https://..."
              className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-slate-400 text-xs font-medium mb-1 block">Private Key</label>
            <input type="password" value={form.privateKey} onChange={set("privateKey")}
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
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-all">
            {loading ? "Submitting..." : "Submit Evidence"}
          </button>
        </div>
      </div>
    </div>
  );
}