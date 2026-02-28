import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { GlassCard } from '../components/GlassCard';
import { useCoFoundrStore } from '../hooks/useCoFoundrStore';
import { postImage } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Loader2, Image, Download, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export function BrochurePage() {
  const navigate = useNavigate();
  const {
    ideaText,
    brochureImageUrl, setBrochureImageUrl,
    brochureStatus, setBrochureStatus,
    setBrochureError,
  } = useCoFoundrStore();
  const { showSuccess, showError } = useToast();

  const handleGenerate = async () => {
    if (!ideaText.trim()) {
      showError('Please analyze an idea first from the Dashboard.');
      return;
    }
    setBrochureStatus('loading');
    setBrochureError(null);
    try {
      const url = await postImage(ideaText);
      setBrochureImageUrl(url);
      setBrochureStatus('done');
      showSuccess('Brochure image generated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image generation failed.';
      setBrochureError(msg);
      setBrochureStatus('error');
      showError(msg);
    }
  };

  const isLoading = brochureStatus === 'loading';

  if (!ideaText) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Idea Found</h2>
        <p className="text-slate-500 text-sm mb-6">Please analyze a startup idea first.</p>
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm"
        >
          Go to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Brochure Generator</h1>
        <p className="text-slate-500 text-sm">Generate a visual brochure image for your startup idea.</p>
      </div>

      <GlassCard className="p-6 mb-6 border border-violet-500/20">
        <p className="text-slate-400 text-sm mb-4">
          <span className="text-slate-300 font-medium">Idea: </span>{ideaText}
        </p>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-600 text-white font-semibold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate Brochure</>
          )}
        </button>
      </GlassCard>

      {isLoading && (
        <GlassCard className="p-12 flex flex-col items-center justify-center border border-violet-500/20">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 animate-ping" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image className="w-7 h-7 text-violet-400 animate-pulse" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">AI is creating your brochure…</p>
        </GlassCard>
      )}

      {brochureImageUrl && !isLoading && (
        <GlassCard className="p-6 border border-violet-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Image className="w-4 h-4 text-violet-400" />
              Generated Brochure
            </h3>
            <a
              href={brochureImageUrl}
              download="cofoundrai-brochure.png"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-violet-500/30 text-violet-400 text-xs font-medium hover:bg-violet-500/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/[0.06]">
            <img
              src={brochureImageUrl}
              alt="Generated brochure"
              className="w-full object-contain max-h-[600px]"
            />
          </div>
        </GlassCard>
      )}
    </div>
  );
}
