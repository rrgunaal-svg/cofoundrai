import React from 'react';
import { useCoFoundrStore } from '../hooks/useCoFoundrStore';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

const steps = [
  { label: 'Analyze', key: 'analyzeStatus' as const },
  { label: 'Simulate', key: 'simulateStatus' as const },
  { label: 'Brochure', key: 'brochureStatus' as const },
  { label: 'Report', key: 'reportStatus' as const },
  { label: 'LinkedIn', key: 'linkedinStatus' as const },
  { label: 'Auto-Post', key: 'autopostStatus' as const },
  { label: 'Metrics', key: 'metricsStatus' as const },
];

export function WorkflowTracker() {
  const store = useCoFoundrStore();

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1 px-1">
      {steps.map((step, idx) => {
        const status = store[step.key];
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300
                  ${status === 'done' ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400' : ''}
                  ${status === 'loading' ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-400' : ''}
                  ${status === 'error' ? 'bg-red-500/20 border-red-500/60 text-red-400' : ''}
                  ${status === 'idle' ? 'bg-white/[0.04] border-white/[0.12] text-slate-500' : ''}
                `}
              >
                {status === 'done' && <Check className="w-3.5 h-3.5" />}
                {status === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {status === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
                {status === 'idle' && <span className="text-[10px] font-bold">{idx + 1}</span>}
              </div>
              <span className={`text-[9px] font-medium tracking-wide uppercase ${
                status === 'done' ? 'text-emerald-400' :
                status === 'loading' ? 'text-cyan-400' :
                status === 'error' ? 'text-red-400' :
                'text-slate-600'
              }`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-px w-6 shrink-0 transition-all duration-500 ${
                store[steps[idx + 1].key] !== 'idle' || status === 'done' ? 'bg-cyan-500/40' : 'bg-white/[0.08]'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
