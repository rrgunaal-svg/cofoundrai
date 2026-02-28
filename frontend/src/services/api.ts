// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL = 'http://127.0.0.1:8000';
const TIMEOUT_MS = 60000;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnalyzeRequest {
  idea: string;
}

export interface AnalyzeResult {
  business_analysis?: string;
  market_analysis?: string;
  tech_feasibility?: string;
  risk_analysis?: string;
  validation_score?: number | string;
  [key: string]: unknown;
}

export interface SimulateResult {
  market_growth?: Array<{ year?: number | string; value?: number; label?: string; [key: string]: unknown }>;
  success_probability?: number;
  summary?: string;
  [key: string]: unknown;
}

export interface McpMetrics {
  agent_executions?: number;
  system_performance?: number | string;
  request_counts?: number;
  [key: string]: unknown;
}

export interface LinkedInResult {
  post?: string;
  content?: string;
  [key: string]: unknown;
}

export interface AutopostResult {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorBody = await response.json() as Record<string, unknown>;
        if (errorBody.detail) errorMessage = String(errorBody.detail);
        else if (errorBody.message) errorMessage = String(errorBody.message);
      } catch {
        // ignore JSON parse errors on error body
      }
      throw new Error(errorMessage);
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const response = await fetchWithTimeout(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json() as Promise<T>;
}

async function postBlob(path: string, body: unknown): Promise<Blob> {
  const response = await fetchWithTimeout(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.blob();
}

// ─── API Functions ─────────────────────────────────────────────────────────────

export async function postAnalyze(idea: string): Promise<AnalyzeResult> {
  return postJSON<AnalyzeResult>('/analyze', { idea });
}

export async function postSimulate(analyzeData: AnalyzeResult): Promise<SimulateResult> {
  return postJSON<SimulateResult>('/simulate', analyzeData);
}

export async function postImage(idea: string): Promise<string> {
  // Try blob first; fall back to JSON if content-type is application/json
  const response = await fetchWithTimeout(`${BASE_URL}/image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  });

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const data = await response.json() as Record<string, unknown>;
    if (data.url) return data.url as string;
    if (data.image_url) return data.image_url as string;
    if (data.image) return data.image as string;
    throw new Error('No image URL found in response');
  }

  // Binary image response
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function postReport(analyzeData: AnalyzeResult): Promise<Blob> {
  return postBlob('/report', analyzeData);
}

export async function postLinkedIn(analyzeData: AnalyzeResult): Promise<LinkedInResult> {
  return postJSON<LinkedInResult>('/linkedin', analyzeData);
}

export async function postAutopost(linkedinPost: string): Promise<AutopostResult> {
  return postJSON<AutopostResult>('/autopost', { post: linkedinPost });
}

export async function getMcpMetrics(): Promise<McpMetrics> {
  const response = await fetchWithTimeout(`${BASE_URL}/mcp/metrics`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json() as Promise<McpMetrics>;
}
