// Types for the marketing strategy form data

// ── Step 1: Business Profile ──────────────────────────────────────────────────
export interface BusinessProfile {
  businessType: string;
  industry: string;
  businessSize: 'solo' | 'small-team' | 'medium' | 'large';
  location: {
    city: string;
    district: string;
  };
  businessStage: 'new' | 'growing' | 'established';
  productsServices: string;
  uniqueSellingProposition: string;
  hasLogo: boolean; // moved from old PlatformsPreferences step
}

// ── Step 2: Budget & Goals (merged Budget + Goals) ───────────────────────────
export interface BudgetAndGoals {
  monthlyBudget: string;
  hasMarketingTeam: string; // 'true' | 'false' string (radio value)
  contentCreationCapacity: string[];
  primaryGoal: 'brand-awareness' | 'leads' | 'sales' | 'customer-retention' | 'local-visits' | 'online-traffic';
}

// ── Step 3: Your Customers ────────────────────────────────────────────────────
export interface TargetAudience {
  demographics: {
    ageRange: string;
    incomeLevel: string;
  };
  location: string;
  interests: string[];
  buyingFrequency: 'rare' | 'monthly' | 'weekly' | 'daily';
}

// ── Step 4: Market Context (merged Challenges + Strengths + Market Situation) ─
export interface MarketContext {
  challenges: string[];
  additionalChallenges?: string;
  strengths: string[];
  additionalNotes?: string;
  seasonality: {
    category: string;
    subcategories: string[];
  }[];
  seasonalityOther?: string;
  competitorBehavior?: string;
}

export interface MarketingStrategyFormData {
  businessProfile: BusinessProfile;
  budgetAndGoals: BudgetAndGoals;
  targetAudience: TargetAudience;
  marketContext: MarketContext;
}

export type FormStep =
  | 'business-profile'
  | 'budget-and-goals'
  | 'target-audience'
  | 'market-context'
  | 'review';

export interface StepConfig {
  id: FormStep;
  title: string;
  description: string;
}

// Strategy Generator Types
export interface MarketingPillar {
  name: string;
  goal: string;
}

export interface ContentCategory {
  category: string;
  examples: string[];
}

export interface BudgetSplit {
  paid_ads: number;
  content_creation: number;
  influencers: number;
  tools: number;
}

export interface CopywritingStyle {
  tone: 'professional' | 'friendly' | 'casual' | 'aspirational' | 'educational' | 'playful';
  language_mix: 'english_only' | 'sinhala_only' | 'mixed_english_primary' | 'mixed_sinhala_primary' | 'balanced';
}

export interface AdsVsOrganic {
  recommended_ratio: string;
  reason: string;
}

export interface MarketingStrategy {
  marketing_pillars: MarketingPillar[];
  content_categories: ContentCategory[];
  platform_strategy: Record<string, string>;
  budget_split: BudgetSplit;
  copywriting_style: CopywritingStyle;
  ads_vs_organic: AdsVsOrganic;
}

export interface StrategyGenerationMetadata {
  generation_time_ms: number;
  llm_provider: string;
  model: string;
}

export interface StrategyGenerationResult {
  success: boolean;
  strategy?: MarketingStrategy;
  error?: string;
  metadata?: StrategyGenerationMetadata;
}