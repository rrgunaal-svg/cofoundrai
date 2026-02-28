import React, { useEffect, useRef } from 'react';
import { GlassCard } from '../components/GlassCard';
import { useCoFoundrStore } from '../hooks/useCoFoundrStore';
import { getMcpMetrics } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Loader2, RefreshCw, BarChart3, Cpu, Activity, Zap } from 'lucide-react';

export function MetricsPage() {
  const {
    mcpMetrics, setMcpMetrics,
    metricsStatus, setMetricsStatus,
    setMetricsError,
  } = useCoFoundrStore();
  const { showError } = useToast();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMetrics = async () => {
    setMetricsStatus('loading');
    setMetricsError(null);
    try {
      const data = await getMcpMetrics();
      setMcpMetrics(data);
      setMetricsStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch metrics.';
      setMetricsError(msg);
      setMetricsStatus('error');
      showError(msg);
    }
  };

  useEffect(() => {
    fetchMetrics();
    intervalRef.current = setInterval(fetchMetrics, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const isLoading = metricsStatus === 'loading' && !mcpMetrics;

  const statCards = [
    {
      label: 'Agent Executions',
      value: mcpMetrics?.agent_executions ?? '—',
      icon: Zap,
      color: 'cyan',
      desc: 'Total AI agent runs',
    },
    {
      label: 'System Performance',
      value: mcpMetrics?.system_performance ?? '—',
      icon: Cpu,
      color: 'violet',
      desc: 'Current system health',
    },
    {
      label: 'Request Count',
      value: mcpMetrics?.request_counts ?? '—',
      icon: Activity,
      color: 'emerald',
      desc: 'Total API requests',
    },
  ];

  const colorMap = {
    cyan: { border: 'border-cyan-500/20', icon: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    violet: { border: 'border-violet-500/20', icon: 'text-violet-400', bg: 'bg-violet-500/10' },
    emerald: { border: 'border-emerald-500/20', icon: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">MCP Metrics</h1>
          <p className="text-slate-500 text-sm">Real-time system performance and agent execution stats.</p>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={metricsStatus === 'loading'}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.12] text-slate-400 text-sm hover:bg-white/[0.05] hover:text-slate-200 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${metricsStatus === 'loading' ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Fetching metrics…</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((card) => {
              const colors = colorMap[card.color as keyof typeof colorMap];
              return (
                <GlassCard key={card.label} className={`p-6 border ${colors.border}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                      <card.icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">{card.label}</p>
                      <p className="text-slate-600 text-[10px]">{card.desc}</p>
                    </div>
                  </div>
                  <p className={`text-4xl font-black ${colors.icon}`}>
                    {typeof card.value === 'number' ? card.value.toLocaleString() : String(card.value)}
                  </p>
                </GlassCard>
              );
            })}
          </div>

          {/* Additional metrics */}
          {mcpMetrics && Object.keys(mcpMetrics).length > 0 && (
            <GlassCard className="p-6 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-300">All Metrics</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(mcpMetrics).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-slate-500 text-xs mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-white font-semibold text-sm truncate">{String(value)}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          <p className="text-slate-700 text-xs mt-4 text-center">
            Auto-refreshes every 30 seconds
          </p>
        </>
      )}
    </div>
  );
}
