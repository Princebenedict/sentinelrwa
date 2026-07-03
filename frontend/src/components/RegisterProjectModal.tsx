"use client";

import { useState, useRef } from "react";
import { X, Plus, Upload, Link2, ImageIcon, ShieldAlert, Wallet } from "lucide-react";
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
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    project_id: "",
    name: "",
    description: "",
    asset_type: "Real Estate",
    country: "",
    location: "",
    image_url: "",
    ownership_proof_url: "",
    lister_contact: "",
    price: "",
    expected_performance: "",
    insurance_threshold: 40,
  });

  if (!open) return null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError("");
    if (!file.type.startsWith("image/")) { setImageError("Please choose an image file"); return; }
    try {
      const compressed = await compressImage(file);
      setForm((p) => ({ ...p, image_url: compressed }));
      setImagePreview(compressed);
    } catch { setImageError("Could not process that image"); }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setForm((p) => ({ ...p, image_url: url }));
    setImagePreview(url);
  };

  // Force a clean project_id (no spaces) so the detail-page URL never breaks
  const cleanId = (raw: string) => raw.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    setFormError("");
    const id = cleanId(form.project_id);
    if (!id) return setFormError("Asset ID is required (letters, numbers, hyphens).");
    if (!form.name.trim()) return setFormError("Asset name is required.");
    if (!form.description.trim()) return setFormError("Description is required.");
    if (!form.country.trim()) return setFormError("Country is required.");
    if (!form.location.trim()) return setFormError("Full physical address / location is required.");
    if (!form.lister_contact.trim()) return setFormError("Lister contact (for verification) is required.");

    const result = await registerProject({ ...form, project_id: id });
    if (result !== null) { onSuccess(); onClose(); }
  };

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: "#12121e" }}>
        <div className="flex items-center justify-between p-6 border-b border-[#1e1e32]">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" /> Register Asset for Verification
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Verification notice */}
          <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.2)" }}>
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#FF4D6D" }} />
            <p className="text-slate-300 text-xs leading-relaxed">
              Every asset starts <strong className="text-white">UNVERIFIED</strong> with a score of 0.
              The AI validator scores strictly, without an ownership proof document and verifiable
              evidence, assets cannot reach a high score. Provide real, checkable information.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Asset ID (no spaces)" value={form.project_id} onChange={set("project_id")} required />
            <Field label="Asset Name" value={form.name} onChange={set("name")} required />
          </div>

          <TextAreaField label="Description" value={form.description} onChange={set("description")} required />

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Asset Type" value={form.asset_type} onChange={set("asset_type")}
              options={["Real Estate", "Infrastructure", "Commodity", "Agricultural", "Energy", "Finance", "Other"]} />
            <Field label="Country" value={form.country} onChange={set("country")} required />
          </div>

          <Field label="Full Physical Address / Location" value={form.location} onChange={set("location")} required />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Stated Price / Value" value={form.price} onChange={set("price")} />
            <Field label="Lister Contact (email / phone for KYC)" value={form.lister_contact} onChange={set("lister_contact")} required />
          </div>

          <Field label="Ownership Proof Document URL (title deed / registry)" value={form.ownership_proof_url} onChange={set("ownership_proof_url")} />

          {/* Image */}
          <div>
            <label className="text-slate-400 text-xs font-medium mb-2 block">Asset Image</label>
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
            {imageError && <p className="text-red-400 text-xs mt-2">{imageError}</p>}
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

          {(formError || error) && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg p-3">{formError || error}</p>}
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-[#1e1e32] text-slate-400 rounded-xl py-3 font-semibold hover:border-indigo-500 hover:text-white transition-all">Cancel</button>
          {address ? (
            <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-all">
              {loading ? "Registering..." : "Register Asset"}
            </button>
          ) : (
            <button onClick={connect} disabled={connecting} className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              <Wallet className="w-4 h-4" /> {connecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-slate-400 text-xs font-medium mb-1 block">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input type={type} value={value} onChange={onChange}
        className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
    </div>
  );
}

function TextAreaField({ label, value, onChange, required = false }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="text-slate-400 text-xs font-medium mb-1 block">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
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
