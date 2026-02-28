import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { useCoFoundrStore } from '../hooks/useCoFoundrStore';
import { postAnalyze } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Loader2, Sparkles, Brain, TrendingUp, Cpu, AlertTriangle, Star } from 'lucide-react';

const resultCards = [
  { key: 'business_analysis', label: 'Business Analysis', icon: Brain, color: 'cyan' },
  { key: 'market_analysis', label: 'Market Analysis', icon: TrendingUp, color: 'violet' },
  { key: 'tech_feasibility', label: 'Tech Feasibility', icon: Cpu, color: 'blue' },
  { key: 'risk_analysis', label: 'Risk Analysis', icon: AlertTriangle, color: 'amber' },
  { key: 'validation_score', label: 'Validation Score', icon: Star, color: 'emerald' },
] as const;

const colorMap = {
  cyan: { border: 'border-cyan-500/20', icon: 'text-cyan-400', bg: 'bg-cyan-500/10', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.1)]' },
  violet: { border: 'border-violet-500/20', icon: 'text-violet-400', bg: 'bg-violet-500/10', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.1)]' },
  blue: { border: 'border-blue-500/20', icon: 'text-blue-400', bg: 'bg-blue-500/10', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.1)]' },
  amber: { border: 'border-amber-500/20', icon: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]' },
  emerald: { border: 'border-emerald-500/20', icon: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]' },
};

export function Dashboard() {
  const {
    ideaText, setIdeaText,
    analyzeResult, setAnalyzeResult,
    analyzeStatus, setAnalyzeStatus,
    setAnalyzeError,
  } = useCoFoundrStore();
  const { showSuccess, showError } = useToast();
  const [localIdea, setLocalIdea] = useState(ideaText);

  const handleAnalyze = async () => {
    if (!localIdea.trim()) {
      showError('Please enter a startup idea first.');
      return;
    }
    setIdeaText(localIdea);
    setAnalyzeStatus('loading');
    setAnalyzeError(null);
    try {
      const result = await postAnalyze(localIdea.trim());
      setAnalyzeResult(result);
      setAnalyzeStatus('done');
      showSuccess('Analysis complete! Your startup idea has been analyzed.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setAnalyzeError(msg);
      setAnalyzeStatus('error');
      showError(msg);
    }
  };

  const isLoading = analyzeStatus === 'loading';

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06060f]/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-violet-500/40 animate-ping animation-delay-150" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            </div>
            <p className="text-cyan-300 font-medium text-sm">AI agents analyzing your idea…</p>
            <p className="text-slate-500 text-xs">This may take a moment</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-slate-500 text-sm">Enter your startup idea and let AI agents do the heavy lifting.</p>
      </div>

      {/* Input Section */}
      <GlassCard className="p-6 mb-8">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Your Startup Idea
        </label>
        <textarea
          value={localIdea}
          onChange={(e) => setLocalIdea(e.target.value)}
          placeholder="Describe your startup idea in detail… e.g. 'An AI-powered healthcare assistant that helps patients manage chronic conditions through personalized recommendations and real-time monitoring.'"
          rows={5}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 text-sm resize-none focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-200"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-600">{localIdea.length} characters</span>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !localIdea.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Idea
              </>
            )}
          </button>
        </div>
      </GlassCard>

      {/* Results */}
      {analyzeResult && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            Agent Analysis Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {resultCards.map((card) => {
              const colors = colorMap[card.color];
              const value = analyzeResult[card.key];
              return (
                <GlassCard
                  key={card.key}
                  className={`p-5 border ${colors.border} ${colors.glow} hover:-translate-y-1 transition-transform duration-300`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center border ${colors.border}`}>
                      <card.icon className={`w-4 h-4 ${colors.icon}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200">{card.label}</h3>
                  </div>
                  {card.key === 'validation_score' ? (
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black text-emerald-400">
                        {typeof value === 'number' ? value.toFixed(1) : value ?? '—'}
                      </span>
                      {typeof value === 'number' && <span className="text-slate-500 text-sm mb-1">/10</span>}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {value ? String(value) : <span className="text-slate-600 italic">No data returned</span>}
                    </p>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {!analyzeResult && analyzeStatus !== 'loading' && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-white/[0.06] flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-500 text-sm">Enter your idea above and click <strong className="text-slate-400">Analyze Idea</strong> to get started.</p>
        </div>
      )}
    </div>
  );
}
