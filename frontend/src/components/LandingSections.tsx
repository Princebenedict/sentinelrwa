"use client";

import Link from "next/link";
import {
  AlertTriangle, Search, Scale, Clock, ShieldCheck,
  FileSearch, Brain, Gavel, Building2, Coins, TrendingUp,
  Landmark, Palette, Truck, ArrowRight,
} from "lucide-react";

const ASSETS = [
  {
    icon: Building2, color: "#3B82F6", name: "Real Estate", badge: "Physical Condition",
    query: "Is occupancy above 90% and did the building pass inspection?",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Coins, color: "#F59E0B", name: "Commodities", badge: "Quality Verification",
    query: "Does the stored gold match the certified purity and quantity?",
    img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: TrendingUp, color: "#06B6D4", name: "Private Credit", badge: "Financial Health",
    query: "Is the borrower's business healthy based on public signals?",
    img: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Landmark, color: "#10B981", name: "Infrastructure", badge: "Milestone Tracking",
    query: "Did the solar farm hit its construction milestone on time?",
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Palette, color: "#8B5CF6", name: "Art & Collectibles", badge: "Provenance",
    query: "Is the artwork's condition and provenance chain intact?",
    img: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Truck, color: "#EF4444", name: "Supply Chain", badge: "Event Trigger",
    query: "Was the shipment delayed or damaged in transit?",
    img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80",
  },
];

export default function LandingSections() {
  return (
    <>
      {/* THE PROBLEM */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#FF4D6D" }}>The Problem</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Blockchains are blind to the real world</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            A smart contract can push a price, but it can&rsquo;t tell whether a building is occupied,
            a harvest failed, or a factory burned down.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Search, title: "Subjective valuation", desc: "Oracles push numbers. They can't judge 'Is this property 80% occupied?' or 'Did the harvest fail from drought?'" },
            { icon: Clock, title: "Insurance claim delays", desc: "Rigid triggers can't read a news report about a factory fire and decide to pay out." },
            { icon: Scale, title: "Trust gaps in ownership", desc: "Fractional investors can't verify the asset is actually performing as the issuer claims." },
            { icon: AlertTriangle, title: "Costly disputes", desc: "When performance is contested, arbitration is slow, expensive, and happens off-chain." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-5 flex gap-4" style={{ background: "rgba(255,77,109,0.06)", border: "1px solid rgba(255,77,109,0.15)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,77,109,0.12)" }}>
                <Icon className="w-5 h-5" style={{ color: "#FF4D6D" }} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE SOLUTION */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#00E699" }}>The Solution</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">AI validators that reach consensus on reality</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            SentinelRWA asks GenLayer&rsquo;s AI validators to research the open web, weigh the evidence,
            and agree on what&rsquo;s actually true, then writes the verdict on-chain.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: "Ask in plain language", desc: "'Was the Miami property damaged by the storm?' No rigid conditionals to code." },
            { icon: FileSearch, title: "Evidence-based consensus", desc: "Jurors pull news, reports, and public data, then independently reach a verdict." },
            { icon: ShieldCheck, title: "Subjective made objective", desc: "Qualitative calls become on-chain triggers, with the full reasoning attached." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-5" style={{ background: "rgba(0,230,153,0.06)", border: "1px solid rgba(0,230,153,0.15)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(0,230,153,0.12)" }}>
                <Icon className="w-5 h-5" style={{ color: "#00E699" }} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#7C5CFF" }}>How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Asset to verdict in four steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { n: "01", icon: Building2, title: "Onboard the asset", desc: "Details, benchmarks, and insurance terms go into an Intelligent Contract." },
            { n: "02", icon: FileSearch, title: "Submit evidence", desc: "Anyone adds reports, data, or links, like a news article about a flood." },
            { n: "03", icon: Brain, title: "AI jury evaluates", desc: "Validators independently research and score the evidence with reasoning." },
            { n: "04", icon: Gavel, title: "Verdict on-chain", desc: "The result triggers an insurance review, score update, or alert." },
          ].map(({ n, icon: Icon, title, desc }, i) => (
            <div key={title} className="relative rounded-2xl p-5" style={{ background: "rgba(124,92,255,0.06)", border: "1px solid rgba(124,92,255,0.15)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,92,255,0.12)" }}>
                  <Icon className="w-5 h-5" style={{ color: "#7C5CFF" }} />
                </div>
                <span className="text-2xl font-bold" style={{ color: "rgba(124,92,255,0.3)" }}>{n}</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              {i < 3 && (
                <ArrowRight className="hidden md:block absolute -right-3 top-1/2 w-5 h-5 text-slate-700" style={{ transform: "translateY(-50%)" }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ASSET CLASSES WITH IMAGES */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">Asset Classes</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Monitor any real-world asset</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Each asset type gets its own question the AI jury answers from real evidence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ASSETS.map(({ icon: Icon, color, name, badge, query, img }) => (
            <Link key={name} href="/dashboard" className="group block">
              <div className="relative h-64 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                {/* Fallback colored gradient (shows if image fails) */}
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}44, ${color}0d)` }} />
                {/* Real image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                {/* Dark gradient for text readability */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)" }} />
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}33`, border: `1px solid ${color}55` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="text-white font-semibold text-sm">{name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full ml-auto" style={{ background: `${color}22`, color }}>{badge}</span>
                  </div>
                  <p className="text-slate-200 text-xs italic leading-relaxed mb-3">&ldquo;{query}&rdquo;</p>
                  <span className="text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color }}>
                    View Monitor <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INSURANCE COMPARISON */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#00F5FF" }}>Parametric Insurance 2.0</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Beyond rigid triggers</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Old parametric insurance fires on simple thresholds like rainfall. Ours fires on subjective
            conditions an AI jury agrees on.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="grid grid-cols-3 text-sm">
            <div className="p-4 font-semibold text-slate-400" style={{ background: "rgba(255,255,255,0.03)" }}>Feature</div>
            <div className="p-4 font-semibold text-slate-400 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>Traditional Oracle</div>
            <div className="p-4 font-semibold text-center" style={{ background: "rgba(124,92,255,0.1)", color: "#b9a8ff" }}>SentinelRWA</div>
            {[
              ["Data source", "Single feed", "Multi-source web research"],
              ["Subjective assessment", "Not possible", "AI jury consensus"],
              ["Dispute resolution", "Manual arbitration", "On-chain verdict with reasoning"],
              ["Evidence permanence", "Off-chain", "Fully on-chain trail"],
            ].map((row, i) => (
              <div key={i} className="contents">
                <div className="p-4 text-white border-t border-white/5">{row[0]}</div>
                <div className="p-4 text-slate-500 text-center border-t border-white/5">{row[1]}</div>
                <div className="p-4 text-center border-t border-white/5" style={{ color: "#00E699" }}>{row[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
