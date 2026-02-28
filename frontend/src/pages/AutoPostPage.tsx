import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { GlassCard } from '../components/GlassCard';
import { useCoFoundrStore } from '../hooks/useCoFoundrStore';
import { postAutopost } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Loader2, AlertCircle, ArrowRight, Send, CheckCircle } from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';

export function AutoPostPage() {
  const navigate = useNavigate();
  const {
    linkedinPost, setLinkedinPost,
    autopostStatus, setAutopostStatus,
    setAutopostError,
  } = useCoFoundrStore();
  const { showSuccess, showError } = useToast();

  const handleAutopost = async () => {
    if (!linkedinPost.trim()) {
      showError('Please generate a LinkedIn post first.');
      return;
    }
    setAutopostStatus('loading');
    setAutopostError(null);
    try {
      await postAutopost(linkedinPost);
      setAutopostStatus('done');
      showSuccess('Successfully posted to LinkedIn!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Auto-post failed.';
      setAutopostError(msg);
      setAutopostStatus('error');
      showError(msg);
    }
  };

  const isPosting = autopostStatus === 'loading';

  if (!linkedinPost) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Post Found</h2>
        <p className="text-slate-500 text-sm mb-6">Generate a LinkedIn post first before auto-posting.</p>
        <button
          onClick={() => navigate({ to: '/linkedin' })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm"
        >
          Go to LinkedIn <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Auto-Post to LinkedIn</h1>
        <p className="text-slate-500 text-sm">Review and publish your post directly to LinkedIn.</p>
      </div>

      <GlassCard className="p-6 mb-6 border border-blue-600/20">
        <div className="flex items-center gap-3 mb-4">
          <SiLinkedin className="w-5 h-5 text-blue-500" />
          <h3 className="text-sm font-semibold text-slate-200">Post Preview</h3>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-4">
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{linkedinPost}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAutopost}
            disabled={isPosting || autopostStatus === 'done'}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isPosting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</>
            ) : autopostStatus === 'done' ? (
              <><CheckCircle className="w-4 h-4" /> Posted!</>
            ) : (
              <><Send className="w-4 h-4" /> Post to LinkedIn</>
            )}
          </button>
          <button
            onClick={() => navigate({ to: '/linkedin' })}
            className="px-4 py-2.5 rounded-xl border border-white/[0.12] text-slate-400 text-sm hover:bg-white/[0.05] transition-colors"
          >
            Edit Post
          </button>
        </div>
      </GlassCard>

      {autopostStatus === 'done' && (
        <GlassCard className="p-6 border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-300 font-bold text-base">Post Published!</p>
              <p className="text-slate-500 text-sm">Your startup post is now live on LinkedIn.</p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
