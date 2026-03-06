// Types for the marketing strategy form data
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
}

export interface MarketingBudgetResources {
  monthlyBudget: string;
  hasMarketingTeam: string;
  teamSize?: number;
  contentCreationCapacity: string[];
}

export interface BusinessGoals {
  primaryGoal: 'brand-awareness' | 'leads' | 'sales' | 'customer-retention' | 'local-visits' | 'online-traffic';
  secondaryGoals: string[];
}

export interface TargetAudience {
  demographics: {
    ageRange: string;
    gender: string[];
    incomeLevel: string;
  };
  location: string;
  interests: string[];
  buyingFrequency: 'rare' | 'monthly' | 'weekly' | 'daily';
}

export interface PlatformsPreferences {
  preferredPlatforms: string[];
  platformExperience: Record<string, 'none' | 'beginner' | 'intermediate' | 'advanced'>;
  brandAssets: {
    hasLogo: boolean;
    hasBrandStyle: boolean;
    brandColors: string[];
  };
}

export interface CurrentChallenges {
  challenges: string[];
  additionalChallenges?: string;
}

export interface StrengthsOpportunities {
  strengths: string[];
  opportunities: string[];
  additionalNotes?: string;
}

export interface MarketSituation {
  seasonality: {
    category: string;
    subcategories: string[];
  }[];
  seasonalityOther?: string;
  competitorBehavior: string;
  stockAvailability: 'always-available' | 'seasonal' | 'limited' | 'pre-order';
  recentPriceChanges: string;
  priceChangeDetails?: string;
}

export interface MarketingStrategyFormData {
  businessProfile: BusinessProfile;
  budgetResources: MarketingBudgetResources;
  businessGoals: BusinessGoals;
  targetAudience: TargetAudience;
  platformsPreferences: PlatformsPreferences;
  currentChallenges: CurrentChallenges;
  strengthsOpportunities: StrengthsOpportunities;
  marketSituation: MarketSituation;
}

export type FormStep = 
  | 'business-profile'
  | 'budget-resources' 
  | 'business-goals'
  | 'target-audience'
  | 'platforms-preferences'
  | 'current-challenges'
  | 'strengths-opportunities'
  | 'market-situation'
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