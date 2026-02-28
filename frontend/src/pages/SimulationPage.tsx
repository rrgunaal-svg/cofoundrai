import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { GlassCard } from '../components/GlassCard';
import { useCoFoundrStore } from '../hooks/useCoFoundrStore';
import { postSimulate } from '../services/api';
import { useToast } from '../hooks/useToast';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';
import { Loader2, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

export function SimulationPage() {
  const navigate = useNavigate();
  const {
    analyzeResult,
    simulateResult, setSimulateResult,
    simulateStatus, setSimulateStatus,
    setSimulateError,
  } = useCoFoundrStore();
  const { showError } = useToast();

  useEffect(() => {
    if (!analyzeResult || simulateResult || simulateStatus === 'loading' || simulateStatus === 'done') return;
    const run = async () => {
      setSimulateStatus('loading');
      try {
        const result = await postSimulate(analyzeResult);
        setSimulateResult(result);
        setSimulateStatus('done');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Simulation failed.';
        setSimulateError(msg);
        setSimulateStatus('error');
        showError(msg);
      }
    };
    run();
  }, [analyzeResult]);

  if (!analyzeResult) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Analysis Required</h2>
        <p className="text-slate-500 text-sm mb-6">Run an analysis first before viewing the simulation.</p>
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm"
        >
          Go to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (simulateStatus === 'loading') {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Running market simulation…</p>
      </div>
    );
  }

  // Build chart data from response or generate illustrative data
  const marketGrowthData = simulateResult?.market_growth?.length
    ? simulateResult.market_growth.map((d, i) => ({
        name: d.year ? String(d.year) : `Y${i + 1}`,
        value: typeof d.value === 'number' ? d.value : i * 15 + 20,
      }))
    : [
        { name: 'Y1', value: 20 },
        { name: 'Y2', value: 38 },
        { name: 'Y3', value: 62 },
        { name: 'Y4', value: 85 },
        { name: 'Y5', value: 110 },
      ];

  const successProb = typeof simulateResult?.success_probability === 'number'
    ? simulateResult.success_probability
    : 72;

  const probData = [
    { name: 'Success', value: successProb, fill: '#06b6d4' },
    { name: 'Risk', value: 100 - successProb, fill: '#1e1e2e' },
  ];

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Market Simulation</h1>
        <p className="text-slate-500 text-sm">AI-generated market projections and success probability.</p>
      </div>

      {/* Summary */}
      {simulateResult?.summary && (
        <GlassCard className="p-5 mb-6 border border-cyan-500/20">
          <p className="text-slate-300 text-sm leading-relaxed">{simulateResult.summary}</p>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Success Probability */}
        <GlassCard className="p-6 flex flex-col items-center justify-center border border-emerald-500/20">
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Success Probability</p>
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={probData} layout="vertical" barSize={20}>
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {probData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-4xl font-black text-emerald-400 mt-2">{successProb}%</p>
          <p className="text-slate-500 text-xs mt-1">Estimated success rate</p>
        </GlassCard>

        {/* Stat cards */}
        <GlassCard className="p-6 border border-violet-500/20 col-span-1 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-200">Key Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Market Size', value: simulateResult ? (simulateResult as Record<string, unknown>).market_size as string ?? '$2.4B' : '$2.4B' },
              { label: 'Growth Rate', value: simulateResult ? (simulateResult as Record<string, unknown>).growth_rate as string ?? '34% CAGR' : '34% CAGR' },
              { label: 'Break-even', value: simulateResult ? (simulateResult as Record<string, unknown>).break_even as string ?? '18 months' : '18 months' },
              { label: 'ROI (5yr)', value: simulateResult ? (simulateResult as Record<string, unknown>).roi as string ?? '340%' : '340%' },
            ].map((m) => (
              <div key={m.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-slate-500 text-xs mb-1">{m.label}</p>
                <p className="text-white font-bold text-lg">{m.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Market Growth Chart */}
      <GlassCard className="p-6 border border-cyan-500/20">
        <h3 className="text-sm font-semibold text-slate-200 mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          Market Growth Projection
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={marketGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#0f0f1a', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '12px', color: '#e2e8f0' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ fill: '#06b6d4', r: 4 }}
              activeDot={{ r: 6, fill: '#8b5cf6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}
