const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── Types ──────────────────────────────────────────────────────────────────

export interface PredictionRequest {
  caption: string;
  content: string;
  platform: string;
  post_date: string;   // YYYY-MM-DD
  post_time: string;   // HH:MM
  followers: number;
  ad_boost: 0 | 1;
}

export interface PredictionResult {
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  timing_quality_score: number;
}

export interface ExplainabilityTip {
  metric: string;
  current_value: number;
  suggestions: string[];
  hashtags: string[];
}

export interface PredictionResponse {
  id: string | null;
  predictions: PredictionResult;
  explainability: ExplainabilityTip[];
}

export interface OCRResponse {
  text: string;
  source: string;
}

export interface HistoryItem {
  id: string;
  caption: string;
  platform: string;
  post_date: string;
  post_time: string;
  followers: number;
  ad_boost: boolean;
  pred_likes: number;
  pred_comments: number;
  pred_shares: number;
  pred_clicks: number;
  pred_timing_quality_score: number;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err?.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// ── API calls ─────────────────────────────────────────────────────────────

/**
 * Send prediction request to backend.
 */
export async function predictCampaign(
  data: PredictionRequest
): Promise<PredictionResponse> {
  const res = await fetch(`${BASE_URL}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<PredictionResponse>(res);
}

/**
 * Upload an image and get extracted text via OCR.
 */
export async function extractTextFromImage(file: File): Promise<OCRResponse> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE_URL}/api/ocr`, {
    method: 'POST',
    body: form,
  });
  return handleResponse<OCRResponse>(res);
}

/**
 * Fetch prediction history.
 */
export async function fetchHistory(limit = 20): Promise<HistoryItem[]> {
  const res = await fetch(`${BASE_URL}/api/history?limit=${limit}`);
  const data = await handleResponse<{ data: HistoryItem[]; count: number }>(res);
  return data.data;
}
