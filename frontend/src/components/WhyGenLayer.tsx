"use client";

import Link from "next/link";
import {
  Brain, Network, Lock, Globe2, ArrowRight,
  FileUp, Search, Users, CheckCircle2, ScrollText,
} from "lucide-react";

export default function WhyGenLayer() {
  return (
    <>
      {/* WHY GENLAYER */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#7C5CFF" }}>Why GenLayer</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Only possible on an intelligent chain</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Ordinary smart contracts can&rsquo;t reason about the real world. GenLayer&rsquo;s Intelligent
            Contracts let decentralized AI validators research, judge, and agree, then write the verdict on-chain.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Brain, title: "AI-Native Contracts", desc: "Logic that reasons over natural language and live web data, not just numbers." },
            { icon: Network, title: "Decentralized Consensus", desc: "Multiple validators independently reach the same verdict, no single point of trust." },
            { icon: Globe2, title: "Open-Web Access", desc: "Validators pull real evidence from the internet to verify claims." },
            { icon: Lock, title: "On-Chain Finality", desc: "Every verdict, score, and reasoning is recorded permanently and transparently." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-5" style={{ background: "rgba(124,92,255,0.06)", border: "1px solid rgba(124,92,255,0.15)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(124,92,255,0.12)" }}>
                <Icon className="w-5 h-5" style={{ color: "#7C5CFF" }} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFICATION PIPELINE (real stages your flow goes through) */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#00F5FF" }}>The Verification Pipeline</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Watch a claim become a verdict</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Every asset moves through the same transparent pipeline, from submission to an on-chain verification record.
          </p>
        </div>

        <div className="rounded-2xl p-6 md:p-8" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex flex-col md:flex-row items-stretch gap-2">
            {[
              { icon: FileUp, label: "Asset Submitted", color: "#7C5CFF" },
              { icon: Search, label: "Evidence Collected", color: "#3B82F6" },
              { icon: Users, label: "AI Jury Evaluates", color: "#00F5FF" },
              { icon: CheckCircle2, label: "Consensus Reached", color: "#00E699" },
              { icon: ScrollText, label: "Recorded On-Chain", color: "#F59E0B" },
            ].map(({ icon: Icon, label, color }, i, arr) => (
              <div key={label} className="flex-1 flex flex-col items-center text-center">
                <div className="relative w-full flex items-center justify-center mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center pipeline-node" style={{ background: `${color}1f`, border: `1px solid ${color}55`, animationDelay: `${i * 0.4}s` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  {i < arr.length - 1 && (
                    <div className="hidden md:block absolute left-1/2 top-1/2 h-[2px] w-full -translate-y-1/2" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.02))", marginLeft: "24px" }} />
                  )}
                </div>
                <span className="text-white text-xs font-medium">{label}</span>
                <span className="text-slate-600 text-[10px] mt-0.5">Step {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <div className="rounded-3xl p-10 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(124,92,255,0.15), rgba(0,245,255,0.08))", border: "1px solid rgba(124,92,255,0.25)" }}>
          <div className="absolute top-[-40%] left-1/2 w-96 h-96 rounded-full blur-[120px] opacity-30" style={{ background: "#7C5CFF", transform: "translateX(-50%)" }} />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Put a real-world asset to the test</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">
              Register an asset, submit evidence, and let GenLayer&rsquo;s AI jury verify it. Strict, transparent, and fully on-chain.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-xl transition-all" style={{ background: "linear-gradient(135deg, #7C5CFF, #6d4ee8)", boxShadow: "0 8px 32px rgba(124,92,255,0.4)" }}>
              Open the Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
