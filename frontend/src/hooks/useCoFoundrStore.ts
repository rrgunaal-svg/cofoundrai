import { create } from 'zustand';
import type { AnalyzeResult, SimulateResult, McpMetrics } from '../services/api';

export type StepStatus = 'idle' | 'loading' | 'done' | 'error';

interface CoFoundrState {
  // Data
  ideaText: string;
  analyzeResult: AnalyzeResult | null;
  simulateResult: SimulateResult | null;
  brochureImageUrl: string | null;
  reportBlob: Blob | null;
  linkedinPost: string;
  mcpMetrics: McpMetrics | null;

  // Step statuses
  analyzeStatus: StepStatus;
  simulateStatus: StepStatus;
  brochureStatus: StepStatus;
  reportStatus: StepStatus;
  linkedinStatus: StepStatus;
  autopostStatus: StepStatus;
  metricsStatus: StepStatus;

  // Errors
  analyzeError: string | null;
  simulateError: string | null;
  brochureError: string | null;
  reportError: string | null;
  linkedinError: string | null;
  autopostError: string | null;
  metricsError: string | null;

  // Actions
  setIdeaText: (text: string) => void;
  setAnalyzeResult: (result: AnalyzeResult | null) => void;
  setSimulateResult: (result: SimulateResult | null) => void;
  setBrochureImageUrl: (url: string | null) => void;
  setReportBlob: (blob: Blob | null) => void;
  setLinkedinPost: (post: string) => void;
  setMcpMetrics: (metrics: McpMetrics | null) => void;

  setAnalyzeStatus: (status: StepStatus) => void;
  setSimulateStatus: (status: StepStatus) => void;
  setBrochureStatus: (status: StepStatus) => void;
  setReportStatus: (status: StepStatus) => void;
  setLinkedinStatus: (status: StepStatus) => void;
  setAutopostStatus: (status: StepStatus) => void;
  setMetricsStatus: (status: StepStatus) => void;

  setAnalyzeError: (err: string | null) => void;
  setSimulateError: (err: string | null) => void;
  setBrochureError: (err: string | null) => void;
  setReportError: (err: string | null) => void;
  setLinkedinError: (err: string | null) => void;
  setAutopostError: (err: string | null) => void;
  setMetricsError: (err: string | null) => void;
}

export const useCoFoundrStore = create<CoFoundrState>((set) => ({
  // Data
  ideaText: '',
  analyzeResult: null,
  simulateResult: null,
  brochureImageUrl: null,
  reportBlob: null,
  linkedinPost: '',
  mcpMetrics: null,

  // Step statuses
  analyzeStatus: 'idle',
  simulateStatus: 'idle',
  brochureStatus: 'idle',
  reportStatus: 'idle',
  linkedinStatus: 'idle',
  autopostStatus: 'idle',
  metricsStatus: 'idle',

  // Errors
  analyzeError: null,
  simulateError: null,
  brochureError: null,
  reportError: null,
  linkedinError: null,
  autopostError: null,
  metricsError: null,

  // Actions
  setIdeaText: (text) => set({ ideaText: text }),
  setAnalyzeResult: (result) => set({ analyzeResult: result }),
  setSimulateResult: (result) => set({ simulateResult: result }),
  setBrochureImageUrl: (url) => set({ brochureImageUrl: url }),
  setReportBlob: (blob) => set({ reportBlob: blob }),
  setLinkedinPost: (post) => set({ linkedinPost: post }),
  setMcpMetrics: (metrics) => set({ mcpMetrics: metrics }),

  setAnalyzeStatus: (status) => set({ analyzeStatus: status }),
  setSimulateStatus: (status) => set({ simulateStatus: status }),
  setBrochureStatus: (status) => set({ brochureStatus: status }),
  setReportStatus: (status) => set({ reportStatus: status }),
  setLinkedinStatus: (status) => set({ linkedinStatus: status }),
  setAutopostStatus: (status) => set({ autopostStatus: status }),
  setMetricsStatus: (status) => set({ metricsStatus: status }),

  setAnalyzeError: (err) => set({ analyzeError: err }),
  setSimulateError: (err) => set({ simulateError: err }),
  setBrochureError: (err) => set({ brochureError: err }),
  setReportError: (err) => set({ reportError: err }),
  setLinkedinError: (err) => set({ linkedinError: err }),
  setAutopostError: (err) => set({ autopostError: err }),
  setMetricsError: (err) => set({ metricsError: err }),
}));
