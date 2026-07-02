import Link from "next/link";
import { Shield, Brain, Globe, TrendingUp, ArrowRight, Zap } from "lucide-react";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 text-indigo-300 text-sm mb-8">
          <Zap className="w-3.5 h-3.5" />
          Powered by GenLayer Intelligent Contracts
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          AI-Powered
          <br />
          <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Real-World Asset
          </span>
          <br />
          Intelligence
        </h1>

        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
          SentinelRWA monitors, evaluates, and insures real-world assets using
          GenLayer decentralized AI Jury consensus, bringing objective on-chain
          verdicts to subjective real-world performance.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center gap-2 glow-accent"
          >
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <a 
            href="https://docs.genlayer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white font-medium px-6 py-4 border border-[#1e1e32] hover:border-indigo-500/40 rounded-xl transition-all"
          >
            GenLayer Docs
          </a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Brain,
              title: "AI Jury Consensus",
              desc: "GenLayer validators independently assess evidence and reach consensus on verdicts",
            },
            {
              icon: Globe,
              title: "Evidence Trail",
              desc: "Every submission is stored permanently on-chain with its source reference",
            },
            {
              icon: Shield,
              title: "Insurance Logic",
              desc: "Automatic threshold monitoring triggers insurance review when assets underperform",
            },
            {
              icon: TrendingUp,
              title: "Full History",
              desc: "Every verdict, score, and reasoning stored permanently on-chain",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">Network Configuration</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              { label: "Network", value: "Bradbury Testnet" },
              { label: "Type", value: "GenLayer L2" },
              { label: "Consensus", value: "AI Jury" },
              { label: "Currency", value: "GEN" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-slate-500 text-xs">{label}</p>
                <p className="text-white font-mono mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
