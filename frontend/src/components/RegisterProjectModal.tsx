"use client";

import { useState, useRef } from "react";
import { X, Plus, Upload, Link2, ImageIcon, Sparkles, Wallet, ShieldCheck } from "lucide-react";
import { useContract } from "@/hooks/useContract";
import { useWallet } from "@/hooks/useWallet";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 400;
        let { width, height } = img;
        if (width > height && width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        else if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = () => reject(new Error("Invalid image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export default function RegisterProjectModal({ open, onClose, onSuccess }: Props) {
  const { registerProject, loading, error } = useContract();
  const { address, connect, connecting } = useWallet();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [imagePreview, setImagePreview] = useState("");
  const [localError, setLocalError] = useState("");
  const [attested, setAttested] = useState(false);
  const [form, setForm] = useState({
    project_id: "",
    name: "",
    description: "",
    asset_type: "Real Estate",
    country: "",
    location: "",
    image_url: "",
    price: "",
    expected_performance: "",
    insurance_threshold: 40,
  });

  if (!open) return null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalError("");
    if (!file.type.startsWith("image/")) { setLocalError("Please choose an image file"); return; }
    try {
      const compressed = await compressImage(file);
      setForm((p) => ({ ...p, image_url: compressed }));
      setImagePreview(compressed);
    } catch { setLocalError("Could not process that image"); }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setForm((p) => ({ ...p, image_url: url }));
    setImagePreview(url);
  };

  const validate = (): string => {
    if (!form.project_id.trim()) return "Project ID is required";
    if (/\s/.test(form.project_id)) return "Project ID cannot contain spaces (use hyphens)";
    if (!form.name.trim()) return "Asset name is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.country.trim()) return "Country is required";
    if (!form.location.trim()) return "Specific location / address is required";
    if (!form.image_url.trim()) return "An asset image is required";
    if (!form.price.trim()) return "Asset value / price is required";
    if (!attested) return "You must confirm the ownership attestation";
    return "";
  };

  const handleSubmit = async () => {
    const v = validate();
    if (v) { setLocalError(v); return; }
    setLocalError("");
    const result = await registerProject(form);
    if (result !== null) { onSuccess(); onClose(); }
  };

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#1e1e32]">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" /> Register Asset
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Project ID (no spaces)" value={form.project_id} onChange={set("project_id")} />
            <Field label="Asset Name" value={form.name} onChange={set("name")} />
          </div>

          <TextAreaField label="Description" value={form.description} onChange={set("description")} />

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Asset Type" value={form.asset_type} onChange={set("asset_type")}
              options={["Real Estate", "Infrastructure", "Commodity", "Agricultural", "Energy", "Finance", "Other"]} />
            <Field label="Country" value={form.country} onChange={set("country")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Specific Location / Address" value={form.location} onChange={set("location")} />
            <Field label="Asset Value / Price" value={form.price} onChange={set("price")} />
          </div>

          {/* Image (required) */}
          <div>
            <label className="text-slate-400 text-xs font-medium mb-2 block">Asset Image (required)</label>
            <div className="flex gap-2 mb-3">
              <button type="button" onClick={() => setImageMode("url")}
                className={imageMode === "url" ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white" : "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0a0a12] text-slate-400 border border-[#1e1e32]"}>
                <Link2 className="w-3.5 h-3.5" /> Paste URL
              </button>
              <button type="button" onClick={() => setImageMode("upload")}
                className={imageMode === "upload" ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white" : "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0a0a12] text-slate-400 border border-[#1e1e32]"}>
                <Upload className="w-3.5 h-3.5" /> Upload File
              </button>
            </div>

            {imageMode === "url" ? (
              <input type="url" value={form.image_url.startsWith("data:") ? "" : form.image_url} onChange={handleUrlChange}
                className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
            ) : (
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full border border-dashed border-[#1e1e32] hover:border-indigo-500/40 rounded-lg py-6 text-slate-400 text-sm flex flex-col items-center gap-2 transition-all">
                  <Upload className="w-6 h-6" /> Click to choose an image
                </button>
              </div>
            )}

            {imagePreview ? (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-[#1e1e32]" onError={() => setImagePreview("")} />
              </div>
            ) : (
              <div className="mt-3 w-full h-40 rounded-lg border border-[#1e1e32] bg-[#0a0a12] flex items-center justify-center text-slate-600">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
          </div>

          <TextAreaField label="Expected Performance" value={form.expected_performance} onChange={set("expected_performance")} />

          {/* AI rating note */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-indigo-300 font-medium text-sm">Rated by a strict AI jury</p>
              <p className="text-slate-400 text-xs mt-1">
                Listing an asset does NOT make it trusted. It starts as UNVERIFIED. The GenLayer
                AI jury rates it strictly, unverifiable self-claims score low, and only strong
                evidence from independent sources earns a VERIFIED status.
              </p>
            </div>
          </div>

          {/* Ownership attestation */}
          <label className="flex items-start gap-3 cursor-pointer bg-[#0a0a12] border border-[#1e1e32] rounded-xl p-4">
            <input type="checkbox" checked={attested} onChange={(e) => setAttested(e.target.checked)} className="mt-1" />
            <span className="text-slate-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-indigo-400 inline mr-1" />
              I attest that I am the owner or an authorized representative of this asset, that the
              information provided is accurate, and I understand this attestation is signed and
              permanently recorded on-chain under my wallet address.
            </span>
          </label>

          {(localError || error) && (
            <p className="text-red-400 text-sm bg-red-400/10 rounded-lg p-3">{localError || error}</p>
          )}
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-[#1e1e32] text-slate-400 rounded-xl py-3 font-semibold hover:border-indigo-500 hover:text-white transition-all">
            Cancel
          </button>
          {address ? (
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-all">
              {loading ? "Registering..." : "Register Asset"}
            </button>
          ) : (
            <button onClick={connect} disabled={connecting}
              className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              <Wallet className="w-4 h-4" /> {connecting ? "Connecting..." : "Connect Wallet to Register"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string;
}) {
  return (
    <div>
      <label className="text-slate-400 text-xs font-medium mb-1 block">{label}</label>
      <input type={type} value={value} onChange={onChange}
        className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <label className="text-slate-400 text-xs font-medium mb-1 block">{label}</label>
      <textarea value={value} onChange={onChange} rows={3}
        className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[];
}) {
  return (
    <div>
      <label className="text-slate-400 text-xs font-medium mb-1 block">{label}</label>
      <select value={value} onChange={onChange}
        className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
