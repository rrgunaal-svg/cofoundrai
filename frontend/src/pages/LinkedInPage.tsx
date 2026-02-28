import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { GlassCard } from '../components/GlassCard';
import { useCoFoundrStore } from '../hooks/useCoFoundrStore';
import { postLinkedIn, postAutopost } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Loader2, AlertCircle, ArrowRight, Sparkles, Send } from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';

export function LinkedInPage() {
  const navigate = useNavigate();
  const {
    analyzeResult,
    linkedinPost, setLinkedinPost,
    linkedinStatus, setLinkedinStatus,
    autopostStatus, setAutopostStatus,
    setLinkedinError, setAutopostError,
  } = useCoFoundrStore();
  const { showSuccess, showError } = useToast();

  const handleGenerate = async () => {
    if (!analyzeResult) {
      showError('Please analyze an idea first.');
      return;
    }
    setLinkedinStatus('loading');
    setLinkedinError(null);
    try {
      const result = await postLinkedIn(analyzeResult);
      const post = result.post ?? result.content ?? JSON.stringify(result);
      setLinkedinPost(post);
      setLinkedinStatus('done');
      showSuccess('LinkedIn post generated!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'LinkedIn generation failed.';
      setLinkedinError(msg);
      setLinkedinStatus('error');
      showError(msg);
    }
  };

  const handleAutopost = async () => {
    if (!linkedinPost.trim()) {
      showError('Please generate a post first.');
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

  const isGenerating = linkedinStatus === 'loading';
  const isPosting = autopostStatus === 'loading';

  if (!analyzeResult) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Analysis Required</h2>
        <p className="text-slate-500 text-sm mb-6">Run an analysis first before generating LinkedIn content.</p>
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
        <h1 className="text-2xl font-bold text-white mb-1">LinkedIn Content</h1>
        <p className="text-slate-500 text-sm">Generate and publish AI-crafted LinkedIn posts for your startup.</p>
      </div>

      <GlassCard className="p-6 mb-6 border border-blue-600/20">
        <div className="flex items-center gap-3 mb-4">
          <SiLinkedin className="w-5 h-5 text-blue-500" />
          <h3 className="text-sm font-semibold text-slate-200">Post Generator</h3>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate Post</>
          )}
        </button>
      </GlassCard>

      {(linkedinPost || linkedinStatus === 'done') && (
        <GlassCard className="p-6 mb-6 border border-blue-600/20">
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Edit your post before publishing:
          </label>
          <textarea
            value={linkedinPost}
            onChange={(e) => setLinkedinPost(e.target.value)}
            rows={10}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-slate-200 text-sm resize-none focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all duration-200"
            placeholder="Your LinkedIn post will appear here…"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-slate-600">{linkedinPost.length} characters</span>
            <button
              onClick={handleAutopost}
              disabled={isPosting || !linkedinPost.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPosting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</>
              ) : (
                <><Send className="w-4 h-4" /> Auto-Post to LinkedIn</>
              )}
            </button>
          </div>
        </GlassCard>
      )}

      {autopostStatus === 'done' && (
        <GlassCard className="p-5 border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Send className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-300 font-semibold text-sm">Posted Successfully!</p>
              <p className="text-slate-500 text-xs">Your post has been published to LinkedIn.</p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
