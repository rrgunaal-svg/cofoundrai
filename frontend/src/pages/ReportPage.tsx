import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { GlassCard } from '../components/GlassCard';
import { useCoFoundrStore } from '../hooks/useCoFoundrStore';
import { postReport } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, FileText, Download, Eye, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export function ReportPage() {
  const navigate = useNavigate();
  const {
    analyzeResult,
    reportBlob, setReportBlob,
    reportStatus, setReportStatus,
    setReportError,
  } = useCoFoundrStore();
  const { showSuccess, showError } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!analyzeResult) {
      showError('Please analyze an idea first.');
      return;
    }
    setReportStatus('loading');
    setReportError(null);
    try {
      const blob = await postReport(analyzeResult);
      setReportBlob(blob);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setReportStatus('done');
      showSuccess('PDF report generated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Report generation failed.';
      setReportError(msg);
      setReportStatus('error');
      showError(msg);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'cofoundrai-report.pdf';
    a.click();
  };

  const isLoading = reportStatus === 'loading';

  if (!analyzeResult) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Analysis Required</h2>
        <p className="text-slate-500 text-sm mb-6">Run an analysis first before generating a report.</p>
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
        <h1 className="text-2xl font-bold text-white mb-1">PDF Report</h1>
        <p className="text-slate-500 text-sm">Generate a comprehensive investor-ready PDF report.</p>
      </div>

      <GlassCard className="p-6 mb-6 border border-blue-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Startup Analysis Report</p>
            <p className="text-slate-500 text-xs">Full business plan, market analysis, and projections</p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate Report</>
          )}
        </button>
      </GlassCard>

      {reportBlob && pdfUrl && !isLoading && (
        <GlassCard className="p-6 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Report Ready</p>
              <p className="text-slate-500 text-xs">{(reportBlob.size / 1024).toFixed(1)} KB · PDF Document</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold text-sm hover:scale-105 transition-transform"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.12] text-slate-300 font-semibold text-sm hover:bg-white/[0.05] transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </GlassCard>
      )}

      {/* PDF Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-full h-[85vh] bg-[#0d0d1a] border border-white/[0.08] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-white/[0.06]">
            <DialogTitle className="text-white text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Report Preview
            </DialogTitle>
          </DialogHeader>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="w-full flex-1"
              style={{ height: 'calc(85vh - 65px)' }}
              title="PDF Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
