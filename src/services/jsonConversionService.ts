/**
 * JSON conversion service for processing form data into structured format
 */

import { MarketingStrategyFormData } from '@/types';

export interface ProcessedFormData {
  businessProfile: {
    businessType: string;
    industry: string;
    businessSize: string;
    location: {
      city: string;
      district: string;
    };
    businessStage: string;
    productsServices: string;
    uniqueSellingProposition: string;
  };
  targetMarket: {
    demographics: {
      ageRange: string;
      gender: string[];
      incomeLevel: string;
    };
    location: string;
    interests: string[];
    buyingFrequency: string;
  };
  businessGoals: {
    primaryGoal: string;
    secondaryGoals: string[];
  };
  marketingBudget: {
    monthlyBudget: string;
    hasMarketingTeam: boolean;
    teamSize?: number;
    contentCreationCapacity: string[];
  };
  digitalPresence: {
    preferredPlatforms: string[];
    platformExperience: Record<string, string>;
    brandAssets: {
      hasLogo: boolean;
      hasBrandStyle: boolean;
      brandColors: string[];
    };
  };
  challenges: {
    currentChallenges: string[];
    additionalChallenges?: string;
  };
  opportunities: {
    strengths: string[];
    opportunities: string[];
    additionalNotes?: string;
  };
  marketSituation: {
    seasonality: Array<{
      category: string;
      factors: string[];
    }>;
    seasonalityOther?: string;
    competitorBehavior: string;
    stockAvailability: string;
    pricingChanges: {
      hasRecentChanges: boolean;
      details?: string;
    };
  };
  metadata: {
    submissionDate: string;
    language: 'si' | 'en' | 'mixed';
    translationApplied: boolean;
    completionRate: number;
  };
}

export interface ConversionOptions {
  includeMetadata?: boolean;
  flattenStructure?: boolean;
  removeEmptyFields?: boolean;
  customFieldMapping?: Record<string, string>;
}

export class FormDataProcessor {
  /**
   * Convert raw form data to structured JSON format
   */
  static convertToStructuredJSON(
    formData: MarketingStrategyFormData,
    options: ConversionOptions = {}
  ): ProcessedFormData {
    const {
      includeMetadata = true,
      removeEmptyFields = true,
    } = options;

    // Process business profile
    const businessProfile = {
      businessType: formData.businessProfile?.businessType || '',
      industry: formData.businessProfile?.industry || '',
      businessSize: this.mapBusinessSize(formData.businessProfile?.businessSize),
      location: {
        city: formData.businessProfile?.location?.city || '',
        district: formData.businessProfile?.location?.district || '',
      },
      businessStage: this.mapBusinessStage(formData.businessProfile?.businessStage),
      productsServices: formData.businessProfile?.productsServices || '',
      uniqueSellingProposition: formData.businessProfile?.uniqueSellingProposition || '',
    };

    // Process target market
    const targetMarket = {
      demographics: {
        ageRange: formData.targetAudience?.demographics?.ageRange || '',
        gender: formData.targetAudience?.demographics?.gender || [],
        incomeLevel: formData.targetAudience?.demographics?.incomeLevel || '',
      },
      location: formData.targetAudience?.location || '',
      interests: formData.targetAudience?.interests || [],
      buyingFrequency: this.mapBuyingFrequency(formData.targetAudience?.buyingFrequency),
    };

    // Process business goals
    const businessGoals = {
      primaryGoal: this.mapPrimaryGoal(formData.businessGoals?.primaryGoal),
      secondaryGoals: formData.businessGoals?.secondaryGoals || [],
    };

    // Process marketing budget
    const marketingBudget = {
      monthlyBudget: formData.budgetResources?.monthlyBudget || '',
      hasMarketingTeam: String(formData.budgetResources?.hasMarketingTeam) === 'true',
      teamSize: formData.budgetResources?.teamSize,
      contentCreationCapacity: formData.budgetResources?.contentCreationCapacity || [],
    };

    // Process digital presence
    const digitalPresence = {
      preferredPlatforms: formData.platformsPreferences?.preferredPlatforms || [],
      platformExperience: formData.platformsPreferences?.platformExperience || {},
      brandAssets: {
        hasLogo: formData.platformsPreferences?.brandAssets?.hasLogo || false,
        hasBrandStyle: formData.platformsPreferences?.brandAssets?.hasBrandStyle || false,
        brandColors: formData.platformsPreferences?.brandAssets?.brandColors || [],
      },
    };

    // Process challenges
    const challenges = {
      currentChallenges: formData.currentChallenges?.challenges || [],
      additionalChallenges: formData.currentChallenges?.additionalChallenges,
    };

    // Process opportunities
    const opportunities = {
      strengths: formData.strengthsOpportunities?.strengths || [],
      opportunities: formData.strengthsOpportunities?.opportunities || [],
      additionalNotes: formData.strengthsOpportunities?.additionalNotes,
    };

    // Process market situation
    const marketSituation = {
      seasonality: (formData.marketSituation?.seasonality || []).map(item => ({
        category: item.category,
        factors: item.subcategories,
      })),
      seasonalityOther: formData.marketSituation?.seasonalityOther,
      competitorBehavior: formData.marketSituation?.competitorBehavior || '',
      stockAvailability: this.mapStockAvailability(formData.marketSituation?.stockAvailability),
      pricingChanges: {
        hasRecentChanges: String(formData.marketSituation?.recentPriceChanges) === 'true',
        details: formData.marketSituation?.priceChangeDetails,
      },
    };

    // Create processed data
    let processedData: ProcessedFormData = {
      businessProfile,
      targetMarket,
      businessGoals,
      marketingBudget,
      digitalPresence,
      challenges,
      opportunities,
      marketSituation,
      metadata: {
        submissionDate: new Date().toISOString(),
        language: 'en', // Will be updated by processor
        translationApplied: false, // Will be updated by processor
        completionRate: this.calculateCompletionRate(formData),
      },
    };

    // Remove empty fields if requested
    if (removeEmptyFields) {
      processedData = this.removeEmptyFields(processedData) as ProcessedFormData;
    }

    // Remove metadata if not requested
    if (!includeMetadata) {
      delete (processedData as any).metadata;
    }

    return processedData;
  }

  /**
   * Generate AI-ready prompt from structured data
   */
  static generateAIPrompt(data: ProcessedFormData): string {
    const sections: string[] = [];

    // Business Overview
    sections.push(`Business Overview:
- Type: ${data.businessProfile?.businessType || 'Not specified'}
- Industry: ${data.businessProfile?.industry || 'Not specified'}
- Size: ${data.businessProfile?.businessSize || 'Not specified'}
- Stage: ${data.businessProfile?.businessStage || 'Not specified'}
- Location: ${data.businessProfile?.location?.city || 'Not specified'}, ${data.businessProfile?.location?.district || 'Not specified'}
- Products/Services: ${data.businessProfile?.productsServices || 'Not specified'}
- USP: ${data.businessProfile?.uniqueSellingProposition || 'Not specified'}`);

    // Target Market
    sections.push(`Target Market:
- Demographics: ${data.targetMarket.demographics?.ageRange || 'Not specified'}, ${(data.targetMarket.demographics?.gender || []).join(', ')}, ${data.targetMarket.demographics?.incomeLevel || 'Not specified'}
- Location: ${data.targetMarket.location || 'Not specified'}
- Interests: ${(data.targetMarket.interests || []).join(', ') || 'Not specified'}
- Buying Frequency: ${data.targetMarket.buyingFrequency || 'Not specified'}`);

    // Goals & Budget
    sections.push(`Marketing Goals & Budget:
- Primary Goal: ${data.businessGoals.primaryGoal || 'Not specified'}
- Secondary Goals: ${(data.businessGoals.secondaryGoals || []).join(', ') || 'None'}
- Monthly Budget: ${data.marketingBudget.monthlyBudget || 'Not specified'}
- Team: ${data.marketingBudget.hasMarketingTeam ? `Yes (${data.marketingBudget.teamSize || 'size not specified'})` : 'No'}`);

    // Digital Presence
    sections.push(`Digital Presence:
- Preferred Platforms: ${(data.digitalPresence.preferredPlatforms || []).join(', ') || 'None selected'}
- Brand Assets: ${data.digitalPresence.brandAssets?.hasLogo ? 'Has Logo' : 'No Logo'}, ${data.digitalPresence.brandAssets?.hasBrandStyle ? 'Has Brand Style' : 'No Brand Style'}`);

    // Challenges & Opportunities
    sections.push(`Current Situation:
- Challenges: ${(data.challenges.currentChallenges || []).join(', ') || 'None specified'}
- Strengths: ${(data.opportunities.strengths || []).join(', ') || 'None specified'}
- Opportunities: ${(data.opportunities.opportunities || []).join(', ') || 'None specified'}`);

    // Market Situation
    const seasonalityText = (data.marketSituation.seasonality || [])
      .map(s => `${s.category}: ${s.factors?.join(', ') || ''}`)
      .join('; ') || 'Not specified';
    
    sections.push(`Market Context:
- Seasonality: ${seasonalityText}
- Competitor Behavior: ${data.marketSituation.competitorBehavior || 'Not specified'}
- Stock Availability: ${data.marketSituation.stockAvailability || 'Not specified'}
- Recent Price Changes: ${data.marketSituation.pricingChanges?.hasRecentChanges ? 'Yes' : 'No'}`);

    return sections.join('\n\n');
  }

  // Helper methods for mapping enum values to readable strings
  private static mapBusinessSize(size?: string): string {
    const sizeMap: Record<string, string> = {
      'solo': 'Solo Entrepreneur',
      'small-team': 'Small Team (2-10 employees)',
      'medium': 'Medium Business (11-50 employees)',
      'large': 'Large Business (50+ employees)',
    };
    return sizeMap[size || ''] || size || '';
  }

  private static mapBusinessStage(stage?: string): string {
    const stageMap: Record<string, string> = {
      'new': 'New Business (0-1 years)',
      'growing': 'Growing Business (1-5 years)',
      'established': 'Established Business (5+ years)',
    };
    return stageMap[stage || ''] || stage || '';
  }

  private static mapBuyingFrequency(frequency?: string): string {
    const frequencyMap: Record<string, string> = {
      'rare': 'Rarely (few times per year)',
      'monthly': 'Monthly',
      'weekly': 'Weekly',
      'daily': 'Daily',
    };
    return frequencyMap[frequency || ''] || frequency || '';
  }

  private static mapPrimaryGoal(goal?: string): string {
    const goalMap: Record<string, string> = {
      'brand-awareness': 'Brand Awareness',
      'leads': 'Lead Generation',
      'sales': 'Direct Sales',
      'customer-retention': 'Customer Retention',
      'local-visits': 'Local Store Visits',
      'online-traffic': 'Website Traffic',
    };
    return goalMap[goal || ''] || goal || '';
  }

  private static mapStockAvailability(availability?: string): string {
    const availabilityMap: Record<string, string> = {
      'always-available': 'Always Available',
      'seasonal': 'Seasonal Availability',
      'limited': 'Limited Stock',
      'pre-order': 'Pre-order/Made-to-order',
    };
    return availabilityMap[availability || ''] || availability || '';
  }

  private static calculateCompletionRate(formData: MarketingStrategyFormData): number {
    const requiredFields = [
      formData.businessProfile?.businessType,
      formData.businessProfile?.industry,
      formData.businessProfile?.businessSize,
      formData.targetAudience?.demographics?.ageRange,
      formData.businessGoals?.primaryGoal,
      formData.budgetResources?.monthlyBudget,
      formData.platformsPreferences?.preferredPlatforms?.length,
    ];

    const completedFields = requiredFields.filter(field => 
      field !== undefined && field !== null && field !== '' && 
      (Array.isArray(field) ? field.length > 0 : true)
    ).length;

    return Math.round((completedFields / requiredFields.length) * 100);
  }

  private static removeEmptyFields(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.filter(item => item !== null && item !== undefined && item !== '');
    }

    if (obj !== null && typeof obj === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value) && value.length === 0) {
            continue;
          }
          if (typeof value === 'object' && Object.keys(value).length === 0) {
            continue;
          }
          cleaned[key] = this.removeEmptyFields(value);
        }
      }
      return cleaned;
    }

    return obj;
  }
}

/**
 * Export formatted JSON with metadata
 */
export function exportFormDataAsJSON(
  data: ProcessedFormData,
  filename?: string
): { json: string; filename: string } {
  const exportData = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    data,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const exportFilename = filename || `marketing-strategy-data-${Date.now()}.json`;

  return {
    json: jsonString,
    filename: exportFilename,
  };
}