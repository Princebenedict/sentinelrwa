"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Shield, Brain, Globe, TrendingUp, ArrowRight, Zap, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import LandingSections from "@/components/LandingSections";
import WhyGenLayer from "@/components/WhyGenLayer";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <>{n.toLocaleString()}{suffix}</>;
}

interface Particle {
  w: number; h: number; left: number; top: number;
  bg: string; delay: number; dur: number;
}

export default function Home() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles ONLY on the client to avoid hydration mismatch
  useEffect(() => {
    const arr: Particle[] = Array.from({ length: 30 }).map((_, i) => ({
      w: Math.random() * 3 + 1,
      h: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      bg: i % 2 ? "rgba(124,92,255,0.4)" : "rgba(0,245,255,0.3)",
      delay: Math.random() * 5,
      dur: Math.random() * 10 + 10,
    }));
    setParticles(arr);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(124,92,255,0.08), transparent 60%)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#0A0A0B" }}>
      <div ref={glowRef} className="pointer-events-none fixed inset-0 z-0" />

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 animate-pulse-slow" style={{ background: "#7C5CFF" }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 animate-pulse-slow" style={{ background: "#00F5FF", animationDelay: "1.5s" }} />
      </div>

      {/* Particles render only after mount, so no server/client mismatch */}
      <div className="pointer-events-none fixed inset-0 z-0" suppressHydrationWarning>
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: p.w + "px",
              height: p.h + "px",
              left: p.left + "%",
              top: p.top + "%",
              background: p.bg,
              animationDelay: p.delay + "s",
              animationDuration: p.dur + "s",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header />

        <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-8 animate-fade-up" style={{ background: "rgba(124,92,255,0.1)", border: "1px solid rgba(124,92,255,0.2)", color: "#b9a8ff" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Powered by GenLayer Intelligent Contracts
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Intelligence Securing
            <br />
            <span style={{ background: "linear-gradient(135deg, #7C5CFF, #00F5FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Real World Assets
            </span>
          </h1>

          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            SentinelRWA monitors, evaluates, and insures real-world assets using
            GenLayer decentralized AI Jury consensus, bringing objective on-chain
            verdicts to subjective real-world performance.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/dashboard" className="magnetic-btn group text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2" style={{ background: "linear-gradient(135deg, #7C5CFF, #6d4ee8)", boxShadow: "0 8px 32px rgba(124,92,255,0.4)" }}>
              Launch Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://docs.genlayer.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white font-medium px-6 py-4 rounded-xl transition-all" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              GenLayer Docs
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: 100, suffix: "%", label: "On-Chain" },
              { value: 5, suffix: "", label: "Asset Classes" },
              { value: 24, suffix: "/7", label: "AI Monitoring" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold" style={{ color: "#7C5CFF" }}>
                  <CountUp target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-slate-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Brain, title: "AI Jury Consensus", desc: "GenLayer validators independently assess evidence and reach consensus on verdicts" },
              { icon: Globe, title: "Evidence Trail", desc: "Every submission is stored permanently on-chain with its source reference" },
              { icon: Shield, title: "Insurance Logic", desc: "Automatic threshold monitoring triggers insurance review when assets underperform" },
              { icon: TrendingUp, title: "Full History", desc: "Every verdict, score, and reasoning stored permanently on-chain" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="glow-card p-5 rounded-2xl animate-fade-up" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", animationDelay: 0.1 * i + "s" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(124,92,255,0.15)", border: "1px solid rgba(124,92,255,0.2)" }}>
                  <Icon className="w-5 h-5" style={{ color: "#7C5CFF" }} />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <LandingSections />

        <WhyGenLayer />

        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: "#00F5FF" }} /> Network Configuration
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                { label: "Network", value: "Bradbury Testnet" },
                { label: "Type", value: "GenLayer" },
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
    </div>
  );
}
