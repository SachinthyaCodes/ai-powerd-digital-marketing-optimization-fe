/**
 * Content API Service
 * Connects Research Frontend (Next.js) to Content Generator Backend (FastAPI)
 */

// Route all content API calls through the Next.js proxy (/api/content-proxy/*)
// This avoids browser timeouts on slow HF Space requests (poster generation can take 60-120s)
// The proxy has maxDuration=300s and forwards to the real HF Space server-to-server.
const CONTENT_HF_BASE = (
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_CONTENT_API_URL) ||
  'https://gimhanijayasuriya-content-generator-api.hf.space'
).replace(/\/$/, '');

// In the browser use the same-origin proxy; in SSR fall back to direct HF Space URL
const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api/content-proxy'
    : CONTENT_HF_BASE;

// Type Definitions
export interface GenerateTextRequest {
  product_name: string;
  description?: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'urgent' | 'luxurious';
  language?: 'english' | 'sinhala' | 'both';
}

export interface GenerateSmartPosterRequest {
  product_name: string;
  description?: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'urgent' | 'luxurious';
  language?: 'english' | 'sinhala' | 'both';
  season?: string;
  discount?: string;
  business_name?: string;
  phone_number?: string;
  tags?: string[];
  size?: 'facebook' | 'instagram' | 'story' | 'twitter';
  template_style?: 'bold_impact' | 'elegant_sale' | 'dramatic_gradient' | null;
}

export interface TextResponse {
  success: boolean;
  product_name: string;
  content: string;
  full_post?: string;
  language: string;
  model_used?: string;
  pipeline?: string;
  hashtags?: string[];
  gpt2_draft?: string;
  gemini_polished?: string;
  description?: string;
  season?: string;
  discount?: string;
}

export interface PosterResponse {
  product_name: string;
  display_product_name?: string;
  content: string;
  structured_content?: string;  // Has [HEADING]/[BODY] markers — used for render-only calls
  language: string;
  model_used?: string;
  polished?: boolean;
  poster_path: string;
  poster_url?: string;
  background_path?: string;
  background_path_raw?: string;  // Absolute OS path — sent back to render-only endpoint
  season_detected?: string;
  background_generated?: boolean;
  pipeline?: string;
  template_style_used?: string | null;
  shaping_info?: {
    has_sinhala: boolean;
    rakaransaya_count: number;
    yansaya_count: number;
    zwj_count: number;
    nfc_normalized: boolean;
  };
  hashtags?: string[];
  gpt2_draft?: string;
  gemini_polished?: string;
  context?: Record<string, string>;
}

export interface RenderPosterOnlyRequest {
  product_name: string;
  structured_content: string;
  background_path_raw?: string | null;
  size: 'facebook' | 'instagram' | 'story' | 'twitter';
  template_style?: string | null;
  discount?: string;
  business_name?: string;
  phone_number?: string;
  season?: string;
}

export interface RenderPosterOnlyResponse {
  success: boolean;
  poster_path: string;
  poster_url: string;
  size: string;
  template_style?: string | null;
}

export interface HealthResponse {
  status: string;
  version?: string;
  models_loaded?: {
    content_generator: boolean;
    gemini_generator: boolean;
    image_generator: boolean;
    gemini_polisher: boolean;
    sinhala_engine: boolean;
    html_renderer: boolean;
  };
  components?: {
    content_generator: boolean;
    gemini_polish: boolean;
    stability_backgrounds: boolean;
    image_generator: boolean;
  };
  config: {
    use_finetuned: boolean;
    use_gemini_generation?: boolean;
    use_html_rendering?: boolean;
    use_gemini_polish: boolean;
    use_stability_backgrounds?: boolean;
    use_image_ai?: boolean;
  };
  pipeline?: {
    active: string;
    text_generation: string;
    sinhala_shaping: string;
    poster_rendering: string;
    polish: string;
    backgrounds: string;
  };
}

/**
 * Generate text-only content
 */
export async function generateText(data: GenerateTextRequest): Promise<TextResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate_text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

/**
 * Generate smart poster with contextual background + text overlay
 */
export async function generateSmartPoster(data: GenerateSmartPosterRequest): Promise<PosterResponse> {
  try {
    console.log('Sending request to backend:', data);
    
    const response = await fetch(`${API_BASE_URL}/api/generate-smart-poster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      
      let errorDetail;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetail = errorJson.detail || errorText;
      } catch {
        errorDetail = errorText;
      }
      
      throw new Error(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating smart poster:', error);
    throw error;
  }
}

/**
 * Render a poster from already-generated content — skips Gemini API + background generation.
 * Use this to create multiple poster sizes from a single Gemini call.
 */
export async function renderPosterOnly(data: RenderPosterOnlyRequest): Promise<RenderPosterOnlyResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/render-poster-only`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail;
      try {
        errorDetail = JSON.parse(errorText)?.detail || errorText;
      } catch {
        errorDetail = errorText;
      }
      throw new Error(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in renderPosterOnly:', error);
    throw error;
  }
}

/**
 * Generate poster with uploaded/provided image
 */
export async function generateWithImage(
  data: GenerateTextRequest & { image_url?: string }
): Promise<PosterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-with-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating with image:', error);
    throw error;
  }
}

/**
 * Get full URL for a poster image
 */
export function getPosterUrl(posterPath: string): string {
  const cleanPath = posterPath.startsWith('/') ? posterPath.substring(1) : posterPath;
  // Always use the direct HF Space URL for images (not the proxy)
  return `${CONTENT_HF_BASE}/${cleanPath}`;
}

/**
 * Check backend health status
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking backend health:', error);
    throw error;
  }
}

/**
 * Helper to build description from tags and discount
 */
export function buildDescription(params: {
  discount?: string;
  tags?: string[];
  season?: string;
}): string {
  const parts: string[] = [];
  
  // NOTE: discount is NOT included here — it is sent as a separate `discount` field
  // to the backend and rendered as large text on the poster. Adding it here would
  // cause Gemini to receive it twice and potentially include it in the ad copy.
  
  if (params.season && params.season !== 'No specific season') {
    parts.push(`${params.season} special`);
  }
  
  if (params.tags && params.tags.length > 0) {
    const tagLabels = params.tags.map(tag => 
      tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
    parts.push(tagLabels.join(', '));
  }
  
  return parts.join(' - ') || 'Quality product';
}

/**
 * Map frontend tag selections to backend tone
 */
export function mapTone(tags: string[]): 'professional' | 'casual' | 'friendly' | 'urgent' | 'luxurious' {
  // top-rated or best-seller → luxurious/premium feel
  if (tags.includes('top-rated') || tags.includes('best-seller')) {
    return 'luxurious';
  }
  // limited-time creates urgency
  if (tags.includes('limited-time')) {
    return 'urgent';
  }
  // great-value or easy-installments → friendly, accessible
  if (tags.includes('great-value') || tags.includes('easy-installments')) {
    return 'friendly';
  }
  return 'professional';
}

export default {
  generateText,
  generateSmartPoster,
  generateWithImage,
  getPosterUrl,
  checkHealth,
  buildDescription,
  mapTone,
};
