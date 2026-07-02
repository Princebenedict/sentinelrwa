"use client";

import { useState, useRef } from "react";
import { X, Plus, Upload, Link2, ImageIcon, ShieldCheck, Star } from "lucide-react";
import { useContract } from "@/hooks/useContract";

const PHYSICAL_CRITERIA =
  "Evaluate this real-world property and assign a 0-100 score plus a 5-star rating (80-100 Excellent, 60-79 Good, 40-59 Average, 20-39 Poor, 0-19 Very Poor). Assess: Location (accessibility, neighbourhood, security, nearby amenities); Property Condition (building quality, maintenance, age); Price and Value (fair market pricing); Legal Status (verified ownership, land title, documentation); Infrastructure (roads, electricity, water supply, internet access); Investment Potential (rental income and future appreciation). Weigh legal status and structural safety heavily. Deduct significantly for missing documentation, disputed title, or safety hazards.";

const PLATFORM_CRITERIA =
  "Evaluate this online real estate platform and assign a 0-100 score plus a 5-star rating (80-100 Excellent, 60-79 Good, 40-59 Average, 20-39 Poor, 0-19 Very Poor). Assess: Ease of Use (navigation, user-friendly interface); Listing Quality (accurate descriptions, clear photos, up-to-date information); Trust and Verification (verified agents, property authenticity, reviews); Search and Filters (filter by price, location, size); Customer Support (responsiveness, helpfulness); Security (protection of user data, secure transactions). Weigh trust, verification, and security heavily.";

const PHYSICAL_LIST = [
  "Location - accessibility, neighbourhood, security, amenities",
  "Property Condition - quality, maintenance, age",
  "Price & Value - fair market pricing",
  "Legal Status - ownership, land title, documentation",
  "Infrastructure - roads, power, water, internet",
  "Investment Potential - rental income, appreciation",
];

const PLATFORM_LIST = [
  "Ease of Use - navigation, interface",
  "Listing Quality - accurate info, clear photos",
  "Trust & Verification - verified agents, authenticity",
  "Search & Filters - price, location, size",
  "Customer Support - responsiveness",
  "Security - data protection, secure transactions",
];

const STAR_LEGEND = [
  { n: 5, label: "Excellent" },
  { n: 4, label: "Good" },
  { n: 3, label: "Average" },
  { n: 2, label: "Poor" },
  { n: 1, label: "Very Poor" },
];

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
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
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
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [category, setCategory] = useState<"physical" | "platform">("physical");
  const [form, setForm] = useState({
    project_id: "",
    name: "",
    description: "",
    asset_type: "Real Estate",
    country: "",
    image_url: "",
    evaluation_criteria: PHYSICAL_CRITERIA,
    expected_performance: "",
    insurance_threshold: 40,
    privateKey: "",
  });

  if (!open) return null;

  const selectCategory = (c: "physical" | "platform") => {
    setCategory(c);
    setForm((p) => ({
      ...p,
      evaluation_criteria: c === "physical" ? PHYSICAL_CRITERIA : PLATFORM_CRITERIA,
    }));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError("");
    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file");
      return;
    }
    try {
      const compressed = await compressImage(file);
      setForm((p) => ({ ...p, image_url: compressed }));
      setImagePreview(compressed);
    } catch {
      setImageError("Could not process that image");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setForm((p) => ({ ...p, image_url: url }));
    setImagePreview(url);
  };

  const handleSubmit = async () => {
    const result = await registerProject(form);
    if (result !== null) {
      onSuccess();
      onClose();
    }
  };

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const activeList = category === "physical" ? PHYSICAL_LIST : PLATFORM_LIST;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#1e1e32]">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" /> Register Asset Project
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Project ID" value={form.project_id} onChange={set("project_id")} placeholder="rwa-001" />
            <Field label="Name" value={form.name} onChange={set("name")} placeholder="Green Tower Lagos" />
          </div>

          <TextAreaField label="Description" value={form.description} onChange={set("description")} placeholder="Describe the asset..." />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Asset Type"
              value={form.asset_type}
              onChange={set("asset_type")}
              options={["Real Estate", "Infrastructure", "Commodity", "Agricultural", "Energy", "Finance", "Other"]}
            />
            <Field label="Country" value={form.country} onChange={set("country")} placeholder="Nigeria" />
          </div>

          {/* Image section */}
          <div>
            <label className="text-slate-400 text-xs font-medium mb-2 block">Asset Image</label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={
                  imageMode === "url"
                    ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white"
                    : "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0a0a12] text-slate-400 border border-[#1e1e32]"
                }
              >
                <Link2 className="w-3.5 h-3.5" /> Paste URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={
                  imageMode === "upload"
                    ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white"
                    : "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0a0a12] text-slate-400 border border-[#1e1e32]"
                }
              >
                <Upload className="w-3.5 h-3.5" /> Upload File
              </button>
            </div>

            {imageMode === "url" ? (
              <input
                type="url"
                value={form.image_url.startsWith("data:") ? "" : form.image_url}
                onChange={handleUrlChange}
                placeholder="https://example.com/asset.jpg"
                className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            ) : (
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border border-dashed border-[#1e1e32] hover:border-indigo-500/40 rounded-lg py-6 text-slate-400 text-sm flex flex-col items-center gap-2 transition-all"
                >
                  <Upload className="w-6 h-6" />
                  Click to choose an image (auto-compressed)
                </button>
              </div>
            )}

            {imageError && <p className="text-red-400 text-xs mt-2">{imageError}</p>}

            {imagePreview ? (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border border-[#1e1e32]"
                  onError={() => setImagePreview("")}
                />
              </div>
            ) : (
              <div className="mt-3 w-full h-40 rounded-lg border border-[#1e1e32] bg-[#0a0a12] flex items-center justify-center text-slate-600">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
          </div>

          <TextAreaField
            label="Notes for the AI validators (optional)"
            value={form.expected_performance}
            onChange={set("expected_performance")}
            placeholder="Any extra context: recent renovations, current occupancy, known issues..."
          />

          {/* AI Validator Rating panel (read-only) */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300 text-sm font-semibold">Rated by GenLayer AI Validators</span>
            </div>
            <p className="text-slate-400 text-xs mb-3">
              This asset is scored automatically by decentralized AI validators, not by any person, and the rating cannot be edited. Choose what is being rated:
            </p>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => selectCategory("physical")}
                className={
                  category === "physical"
                    ? "px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white"
                    : "px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0a0a12] text-slate-400 border border-[#1e1e32]"
                }
              >
                Physical Property
              </button>
              <button
                type="button"
                onClick={() => selectCategory("platform")}
                className={
                  category === "platform"
                    ? "px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white"
                    : "px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0a0a12] text-slate-400 border border-[#1e1e32]"
                }
              >
                Online Platform
              </button>
            </div>

            <p className="text-slate-500 text-xs mb-2">The AI assesses:</p>
            <div className="grid grid-cols-1 gap-1 mb-3">
              {activeList.map((item) => (
                <div key={item} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">-</span>
                  {item}
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-3">
              <p className="text-slate-500 text-xs mb-2">Rating scale:</p>
              <div className="space-y-1">
                {STAR_LEGEND.map((s) => (
                  <div key={s.n} className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-3 h-3"
                          style={{
                            fill: i <= s.n ? "#f59e0b" : "transparent",
                            color: i <= s.n ? "#f59e0b" : "#3f3f5a",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Field label="Private Key (for signing)" value={form.privateKey} onChange={set("privateKey")} placeholder="0x..." type="password" />

          {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg p-3">{error}</p>}
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#1e1e32] text-slate-400 rounded-xl py-3 font-semibold hover:border-indigo-500 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-all"
          >
            {loading ? "Registering..." : "Register Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-slate-400 text-xs font-medium mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-slate-400 text-xs font-medium mb-1 block">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-slate-400 text-xs font-medium mb-1 block">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
