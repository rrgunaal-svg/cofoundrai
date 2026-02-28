import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Zap, Brain, TrendingUp, Shield } from 'lucide-react';

const features = [
  { icon: Brain, label: 'AI Analysis', desc: 'Multi-agent deep analysis of your startup idea' },
  { icon: TrendingUp, label: 'Market Simulation', desc: 'Predict growth curves and success probability' },
  { icon: Shield, label: 'Risk Assessment', desc: 'Identify and mitigate potential risks early' },
  { icon: Zap, label: 'Instant Reports', desc: 'Generate investor-ready PDFs in seconds' },
];

// Animated SVG particle/grid background — no Three.js dependency
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Deep base */}
      <div className="absolute inset-0 bg-[#06060f]" />

      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px] animate-orb-1" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-violet-500/10 blur-[160px] animate-orb-2" />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-[120px] animate-orb-3" />

      {/* SVG grid + particles */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating dots */}
      {[
        { cx: '15%', cy: '20%', r: 2, delay: '0s', dur: '6s' },
        { cx: '80%', cy: '15%', r: 1.5, delay: '1s', dur: '8s' },
        { cx: '60%', cy: '70%', r: 2.5, delay: '2s', dur: '7s' },
        { cx: '25%', cy: '75%', r: 1.5, delay: '0.5s', dur: '9s' },
        { cx: '90%', cy: '50%', r: 2, delay: '3s', dur: '6.5s' },
        { cx: '45%', cy: '30%', r: 1, delay: '1.5s', dur: '10s' },
        { cx: '70%', cy: '85%', r: 2, delay: '2.5s', dur: '7.5s' },
        { cx: '10%', cy: '55%', r: 1.5, delay: '4s', dur: '8.5s' },
      ].map((dot, i) => (
        <svg key={i} className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill="#06b6d4" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur={dot.dur}
              begin={dot.delay}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values={`${dot.cy};calc(${dot.cy} - 20px);${dot.cy}`}
              dur={dot.dur}
              begin={dot.delay}
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      ))}

      {/* Diagonal accent lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="30%" x2="100%" y2="70%" stroke="#8b5cf6" strokeWidth="1" />
        <line x1="0" y1="60%" x2="100%" y2="20%" stroke="#06b6d4" strokeWidth="0.5" />
        <line x1="20%" y1="0" x2="80%" y2="100%" stroke="#8b5cf6" strokeWidth="0.5" />
      </svg>

      {/* Wireframe hexagon shapes via CSS */}
      <div className="absolute top-[10%] right-[8%] w-32 h-32 border border-cyan-500/15 rounded-[30%] rotate-12 animate-spin-slow" />
      <div className="absolute bottom-[15%] left-[6%] w-24 h-24 border border-violet-500/15 rounded-[30%] -rotate-12 animate-spin-slow-reverse" />
      <div className="absolute top-[50%] right-[20%] w-16 h-16 border border-cyan-500/10 rounded-[30%] rotate-45 animate-spin-slow" />
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06060f]">
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              CoFoundrAI
            </span>
          </div>
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors px-4 py-2 rounded-lg border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
          >
            Dashboard →
          </button>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI-Powered Co-Founder Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
            <span className="text-white">Your AI</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
              Co-Founder
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Transform your startup idea into a comprehensive business plan with AI-powered analysis,
            market simulations, investor reports, and LinkedIn content — all in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => navigate({ to: '/dashboard' })}
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-base shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105"
            >
              Analyze Your Idea
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-slate-600 text-sm">Free to use · No signup required</span>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl w-full">
            {features.map((f) => (
              <div
                key={f.label}
                className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:border-cyan-500/20 hover:bg-white/[0.05] transition-all duration-300 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mb-3 border border-white/[0.08]">
                  <f.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-white text-sm font-semibold mb-1">{f.label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-slate-600 text-xs">
          © {new Date().getFullYear()} CoFoundrAI · Built with{' '}
          <span className="text-red-500">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'cofoundrai')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 hover:text-cyan-400 transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
