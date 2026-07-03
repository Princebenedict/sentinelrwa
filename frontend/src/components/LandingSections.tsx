"use client";

import {
  AlertTriangle, Search, Scale, Clock, ShieldCheck,
  FileSearch, Brain, Gavel, Building2, Coins, TrendingUp,
  Landmark, Palette, ArrowRight,
} from "lucide-react";

export default function LandingSections() {
  return (
    <>
      {/* THE PROBLEM */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#FF4D6D" }}>The Problem</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Blockchains are blind to the real world</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Traditional smart contracts can push a price feed, but they cannot judge whether a
            building is occupied, a harvest failed, or a factory burned down.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Search, title: "Subjective valuation", desc: "Oracles push numbers. They can't assess 'Is this property 80% occupied?' or 'Did the harvest fail from drought?'" },
            { icon: Clock, title: "Insurance claim delays", desc: "Parametric triggers are rigid. A contract can't read a news article about a factory fire and decide to pay out." },
            { icon: Scale, title: "Trust gaps in ownership", desc: "Fractional investors can't verify the underlying asset is actually performing as the issuer claims." },
            { icon: AlertTriangle, title: "Costly dispute resolution", desc: "When performance is contested, legal arbitration is slow, expensive, and off-chain." },
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">GenLayer AI validators reach consensus on the real world</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            SentinelRWA asks decentralized AI validators to independently research, evaluate open-web
            evidence, and agree on subjective asset conditions, all recorded on-chain.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: "Natural language queries", desc: "Ask 'Was the Miami property damaged by the hurricane?' instead of coding rigid conditionals." },
            { icon: FileSearch, title: "Web-evidence consensus", desc: "AI jurors fetch news, reports, and public data, then independently reach a verdict." },
            { icon: ShieldCheck, title: "Subjective to objective", desc: "Qualitative assessments become deterministic, on-chain triggers with full reasoning attached." },
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">From asset to verdict in four steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { n: "01", icon: Building2, title: "Asset Onboarding", desc: "Asset details, performance benchmarks, and insurance terms are encoded into an Intelligent Contract." },
            { n: "02", icon: FileSearch, title: "Evidence Submission", desc: "Stakeholders submit reports, data, or URLs as evidence, e.g. 'Building flooded, here's the news report.'" },
            { n: "03", icon: Brain, title: "AI Jury Evaluation", desc: "GenLayer validators independently research and assess the evidence using web data and reasoning." },
            { n: "04", icon: Gavel, title: "Consensus Verdict", desc: "The verdict is recorded on-chain, triggering an insurance review, score update, or alert." },
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

      {/* ASSET CLASSES */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">Asset Classes</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Built to monitor any real-world asset</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Building2, color: "#FFB366", name: "Real Estate", badge: "Physical Condition", query: "Is occupancy above 90% and did the building pass inspection?" },
            { icon: Coins, color: "#FFD700", name: "Commodities", badge: "Quality Verification", query: "Does the stored gold match the certified purity and quantity?" },
            { icon: TrendingUp, color: "#00E699", name: "Private Credit", badge: "Financial Performance", query: "Is the borrower's business healthy based on public signals?" },
            { icon: Landmark, color: "#00FFFF", name: "Infrastructure", badge: "Milestone Tracking", query: "Did the solar farm reach its construction milestone on time?" },
            { icon: Palette, color: "#FF3399", name: "Art & Collectibles", badge: "Provenance", query: "Is the artwork's condition and provenance chain intact?" },
            { icon: FileSearch, color: "#7C5CFF", name: "Supply Chain", badge: "Event Trigger", query: "Was the shipment delayed or damaged in transit?" },
          ].map(({ icon: Icon, color, name, badge, query }) => (
            <div key={name} className="glow-card rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>{badge}</span>
                </div>
              </div>
              <p className="text-slate-500 text-xs italic leading-relaxed">&ldquo;{query}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* INSURANCE COMPARISON */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#00F5FF" }}>Parametric Insurance 2.0</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Beyond rigid triggers</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Traditional parametric insurance uses simple triggers like rainfall above X mm.
            SentinelRWA enables subjective triggers judged by AI consensus.
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
