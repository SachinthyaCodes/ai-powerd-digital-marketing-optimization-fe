/**
 * Direct binding to the FastAPI Marketing Strategy backend.
 * Converts frontend form data → backend SMEProfile → POST /api/v1/strategy/generate
 * Also persists the SME profile to Supabase (same DB as backend) before calling
 * the AI generation endpoint.
 */

import { saveSMEProfile } from '@/services/smeProfileService';

const PRODUCTION_BACKEND = 'https://sachinthya-marketing-stratergy-recommender.hf.space';

const API_BASE =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_STRATEGY_BASE_URL) ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? PRODUCTION_BACKEND
    : 'http://localhost:8000');

// ── Backend response type ────────────────────────────────────────────────────
export interface StrategyResult {
  strategy_summary: string;
  recommended_platforms: string[];
  content_strategy: string;
  budget_allocation: Record<string, number>;
  reasoning: string;
  confidence_score: number;
  version: number;
  is_outdated: boolean;
  trend_recency_score: number | null;
  similarity_score: number | null;
  data_coverage_score: number | null;
  platform_stability_score: number | null;
  drift_similarity: number | null;
  drift_level: string | null;
  regenerate_flag: boolean | null;
  strategy_id: string | null;
}

// Metadata saved alongside the strategy for display in the dashboard
export interface StrategyMeta {
  businessType: string;
  industry: string;
  city: string;
  primaryGoal: string;
  monthlyBudget: string;
  targetLocation: string;
  generatedAt: string;
  smeProfileId: string | null;  // Supabase row ID of the saved SME profile
}

// ── Key helpers ──────────────────────────────────────────────────────────────
// page.tsx stores step data under camelCase keys matching MarketingStrategyFormData
const STEP_CAMEL_MAP: Record<string, string> = {
  'business-profile': 'businessProfile',
  'budget-and-goals': 'budgetAndGoals',
  'target-audience': 'targetAudience',
  'market-context': 'marketContext',
};

function getSection(formData: any, stepId: string): any {
  const camelKey = STEP_CAMEL_MAP[stepId];
  return (camelKey && formData[camelKey]) || {};
}

// ── Business size mapping ────────────────────────────────────────────────────
const SIZE_MAP: Record<string, string> = {
  solo: 'micro',
  'small-team': 'small',
  medium: 'medium',
  large: 'large',
};

// ── Form → SMEProfile converter ──────────────────────────────────────────────
function buildSMEProfile(formData: any): Record<string, unknown> {
  const bp = getSection(formData, 'business-profile');
  const bg = getSection(formData, 'budget-and-goals');
  const ta = getSection(formData, 'target-audience');
  const mc = getSection(formData, 'market-context');

  return {
    // Section 1 — Business Profile
    business_type: bp.businessType || 'General',
    industry: bp.industry || null,
    business_size: SIZE_MAP[bp.businessSize] || bp.businessSize || 'small',
    business_stage: bp.businessStage || 'growing',
    location: {
      city: bp.location?.city || 'Unknown',
      district: bp.location?.district || null,
      country: null,
    },
    products_services: bp.productsServices || 'General products/services',
    unique_selling_proposition: bp.uniqueSellingProposition || 'Quality and value',

    // Section 2 — Budget & Goals (merged)
    monthly_budget: String(bg.monthlyBudget || '0'),
    has_marketing_team: bg.hasMarketingTeam === 'true',
    team_size: null,
    content_creation_capacity: bg.contentCreationCapacity || [],

    // Goals (merged into Section 2)
    primary_goal: bg.primaryGoal || 'brand-awareness',
    secondary_goals: [], // removed from form — AI infers from context

    // Section 3 — Target Audience
    demographics: {
      age_range: ta.demographics?.ageRange || '25-34',
      gender: ['all'], // removed from form — not relevant to platform selection
      income_level: ta.demographics?.incomeLevel || 'middle',
      education_level: null,
    },
    target_location: ta.location || 'Local',
    interests: ta.interests || [],
    buying_frequency: ta.buyingFrequency || 'monthly',

    // Section 4 — Market Context (challenges + strengths + seasonality)
    challenges: mc.challenges || [],
    additional_challenges: mc.additionalChallenges || null,
    strengths: mc.strengths || [],
    opportunities: [], // removed from form — AI derives from goals + RAG knowledge

    // Additional notes / context
    additional_notes: mc.additionalNotes || null,

    // Market situation — simplified
    seasonality: (mc.seasonality || []).map((s: any) => ({
      category: s.category,
      subcategories: s.subcategories || [],
    })),
    seasonality_other: mc.seasonalityOther || null,
    competitor_behavior: mc.competitorBehavior || null,
    stock_availability: null, // removed from form
    recent_price_changes: null, // removed from form
    price_change_details: null,

    // Section 5 — Platforms (now fully AI/RAG-decided, not user-selected)
    preferred_platforms: [], // intentionally empty — RAG recommends platforms based on evidence
    current_platforms: [],
    platform_experience: null,
    brand_assets: {
      has_logo: bp.hasLogo || false,
      has_brand_style: false,
      brand_colors: [],
    },
  };
}


// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Send the completed SME profile form to the backend and receive an AI strategy.
 * 1. Saves the SME profile to Supabase (fire-and-forget, non-blocking).
 * 2. Calls the FastAPI strategy generation endpoint.
 * 3. Persists the result and display metadata to localStorage.
 */
export async function generateStrategy(formData: any): Promise<StrategyResult> {
  const profile = buildSMEProfile(formData);

  // Save SME profile to Supabase in parallel with strategy generation.
  // We don't await here so it doesn't delay the strategy response — the
  // profile ID is stored in meta once both settle.
  const profileSavePromise = saveSMEProfile(formData, profile).catch((err) => {
    console.warn('[strategyApiService] SME profile save failed (non-fatal):', err);
    return null;
  });

  const [response, smeProfileId] = await Promise.all([
    fetch(`${API_BASE}/api/v1/strategy/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    }),
    profileSavePromise,
  ]);

  if (!response.ok) {
    let detail = `Strategy generation failed (HTTP ${response.status})`;
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // ignore parse error
    }
    throw new Error(detail);
  }

  const strategy: StrategyResult = await response.json();

  // Persist strategy and display metadata to localStorage
  const bp = getSection(formData, 'business-profile');
  const bg = getSection(formData, 'budget-and-goals');
  const ta = getSection(formData, 'target-audience');

  const meta: StrategyMeta = {
    businessType: bp.businessType || 'Business',
    industry: bp.industry || '',
    city: bp.location?.city || '',
    primaryGoal: bg.primaryGoal || '',
    monthlyBudget: String(bg.monthlyBudget || ''),
    targetLocation: ta.location || '',
    generatedAt: new Date().toISOString(),
    smeProfileId: smeProfileId ?? null,
  };

  localStorage.setItem('strategy_result', JSON.stringify(strategy));
  localStorage.setItem('strategy_meta', JSON.stringify(meta));

  return strategy;
}

/** Parse a single SSE part (between double-newlines) into {event, data}. */
function parseSsePart(part: string): { event: string; data: string } | null {
  let event = '';
  let data = '';
  for (const line of part.trim().split('\n')) {
    if (line.startsWith('event: ')) event = line.slice(7).trim();
    else if (line.startsWith('data: ')) data = line.slice(6).trim();
  }
  return event && data ? { event, data } : null;
}

/** Dispatch a single parsed SSE message. Returns the result payload or null. */
function dispatchSseMessage(
  msg: { event: string; data: string },
  onStatus: (m: string) => void,
  onToken: (t: string) => void,
): StrategyResult | null {
  let payload: any;
  try { payload = JSON.parse(msg.data); } catch { return null; }
  if (msg.event === 'status') { onStatus(payload.message ?? ''); return null; }
  if (msg.event === 'token') { onToken(payload.text ?? ''); return null; }
  if (msg.event === 'result') return payload as StrategyResult;
  if (msg.event === 'error') throw new Error(payload.detail || 'Stream error');
  return null;
}

/** Read an SSE ReadableStream, dispatching events until the "result" event. */
async function readSseResponse(
  body: ReadableStream<Uint8Array>,
  onStatus: (m: string) => void,
  onToken: (t: string) => void,
): Promise<StrategyResult> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result: StrategyResult | null = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';
    for (const part of parts) {
      const msg = parseSsePart(part);
      if (!msg) continue;
      const r = dispatchSseMessage(msg, onStatus, onToken);
      if (r) result = r;
    }
  }
  if (!result) throw new Error('No strategy result received from stream');
  return result;
}

/**
 * Streaming variant of generateStrategy.
 * Connects to /api/v1/strategy/generate-stream (SSE) and calls:
 *   onStatus(message)  — progress updates
 *   onToken(text)      — incremental LLM output chunks (typing effect)
 * Resolves with the final StrategyResult once "result" event arrives.
 */
export async function generateStrategyStream(
  formData: any,
  onStatus: (message: string) => void,
  onToken: (text: string) => void,
): Promise<StrategyResult> {
  const profile = buildSMEProfile(formData);

  const profileSavePromise = saveSMEProfile(formData, profile).catch((err) => {
    console.warn('[strategyApiService] SME profile save failed (non-fatal):', err);
    return null;
  });

  const response = await fetch(`${API_BASE}/api/v1/strategy/generate-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });

  if (!response.ok || !response.body) {
    let detail = `Strategy stream failed (HTTP ${response.status})`;
    try { const b = await response.json(); detail = b.detail || detail; } catch { /* ignore */ }
    throw new Error(detail);
  }

  const result = await readSseResponse(response.body, onStatus, onToken);
  const bp = getSection(formData, 'business-profile');
  const bg = getSection(formData, 'budget-and-goals');
  const ta = getSection(formData, 'target-audience');
  const smeProfileId = await profileSavePromise;

  const meta: StrategyMeta = {
    businessType: bp.businessType || 'Business',
    industry: bp.industry || '',
    city: bp.location?.city || '',
    primaryGoal: bg.primaryGoal || '',
    monthlyBudget: String(bg.monthlyBudget || ''),
    targetLocation: ta.location || '',
    generatedAt: new Date().toISOString(),
    smeProfileId: smeProfileId ?? null,
  };

  localStorage.setItem('strategy_result', JSON.stringify(result));
  localStorage.setItem('strategy_meta', JSON.stringify(meta));

  return result;
}

/** Load persisted strategy data (null if not yet generated) */
export function loadStrategyFromStorage(): { strategy: StrategyResult; meta: StrategyMeta } | null {
  try {
    const raw = localStorage.getItem('strategy_result');
    const rawMeta = localStorage.getItem('strategy_meta');
    if (!raw || !rawMeta) return null;
    return {
      strategy: JSON.parse(raw) as StrategyResult,
      meta: JSON.parse(rawMeta) as StrategyMeta,
    };
  } catch {
    return null;
  }
}

/** Clear persisted strategy (e.g. on logout or regenerate) */
export function clearStrategyStorage(): void {
  localStorage.removeItem('strategy_result');
  localStorage.removeItem('strategy_meta');
}

// ── Real-time update API ─────────────────────────────────────────────────────

export interface DriftCheckResult {
  status: string;
  strategy_id: string;
  drift_level: string;
  similarity: number;
  regenerate: boolean;
  last_drift_check: string;
  auto_refreshed: {
    new_strategy_id: string;
    strategy: StrategyResult;
  } | null;
}

export interface RefreshResult {
  status: string;
  previous_strategy_id: string;
  new_strategy_id: string | null;
  version: number;
  confidence_score: number;
  drift_level: string | null;
  strategy: StrategyResult;
}

/** Toggle real-time auto-updates on or off for a strategy */
export async function toggleRealtime(strategyId: string, enabled: boolean): Promise<void> {
  const response = await fetch(`${API_BASE}/api/v1/realtime/toggle-realtime`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ strategy_id: strategyId, enabled }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || 'Failed to toggle realtime');
  }
}

/** Check drift for a specific strategy against latest knowledge */
export async function checkDrift(strategyId: string): Promise<DriftCheckResult> {
  const response = await fetch(
    `${API_BASE}/api/v1/realtime/drift-check?strategy_id=${encodeURIComponent(strategyId)}`,
  );
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || 'Drift check failed');
  }
  return response.json();
}

/** Force regeneration of a strategy from its stored SME profile */
export async function forceRefresh(strategyId: string): Promise<RefreshResult> {
  const response = await fetch(`${API_BASE}/api/v1/realtime/force-refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ strategy_id: strategyId }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || 'Strategy refresh failed');
  }
  const result: RefreshResult = await response.json();

  // Update localStorage with the new strategy (inject strategy_id from response).
  // Also clear stale drift flags — a freshly-refreshed strategy is never drifted.
  const stored = loadStrategyFromStorage();
  if (result.strategy) {
    const updatedStrategy = {
      ...result.strategy,
      strategy_id: result.new_strategy_id ?? null,
      drift_level: 'LOW',
      regenerate_flag: false,
    };
    localStorage.setItem('strategy_result', JSON.stringify(updatedStrategy));
    if (stored?.meta) {
      const updatedMeta = { ...stored.meta, generatedAt: new Date().toISOString() };
      localStorage.setItem('strategy_meta', JSON.stringify(updatedMeta));
    }
  }

  return result;
}

// ── Version history API ──────────────────────────────────────────────────────

export interface StrategyVersionSummary {
  strategy_id: string;
  version: number;
  confidence_score: number | null;
  drift_level: string | null;
  drift_similarity: number | null;
  regenerate_flag: boolean | null;
  created_at: string;
  auto_updated_at: string | null;
  realtime_enabled: boolean;
  trend_recency_score: number | null;
  similarity_score: number | null;
  data_coverage_score: number | null;
  platform_stability_score: number | null;
  recommended_platforms: string[];
  strategy_summary: string;
}

export interface VersionsResult {
  submission_id: string;
  versions: StrategyVersionSummary[];
}

/** Fetch all stored versions for the same SME profile run (newest first) */
export async function listVersions(strategyId: string): Promise<VersionsResult> {
  const response = await fetch(
    `${API_BASE}/api/v1/strategy/versions?strategy_id=${encodeURIComponent(strategyId)}`,
  );
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || 'Failed to load versions');
  }
  return response.json();
}

/** Fetch a single historical strategy version by its row ID. */
export async function fetchStrategyById(strategyId: string): Promise<StrategyResult> {
  const response = await fetch(
    `${API_BASE}/api/v1/strategy/${encodeURIComponent(strategyId)}`,
  );
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || 'Failed to load strategy');
  }
  return response.json();
}

/**
 * Generate a new strategy version from the stored SME profile — no form re-entry.
 * Updates localStorage so the rest of the app reflects the new version immediately.
 */
export async function generateNewVersion(strategyId: string): Promise<StrategyResult> {
  const response = await fetch(`${API_BASE}/api/v1/strategy/generate-version`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ strategy_id: strategyId }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || 'Failed to generate new version');
  }
  const newStrategy: StrategyResult = await response.json();

  // A freshly-generated strategy has no drift by definition — clear stale flags
  // before persisting so that neither localStorage reads nor React state ever
  // show "Needs update" or "HIGH Drift" immediately after generation.
  const cleanStrategy: StrategyResult = { ...newStrategy, drift_level: 'LOW', regenerate_flag: false };

  // Persist to localStorage so dashboard + view pages reflect the new version
  localStorage.setItem('strategy_result', JSON.stringify(cleanStrategy));
  const stored = loadStrategyFromStorage();
  if (stored?.meta) {
    const updatedMeta = { ...stored.meta, generatedAt: new Date().toISOString() };
    localStorage.setItem('strategy_meta', JSON.stringify(updatedMeta));
  }

  return cleanStrategy;
}
