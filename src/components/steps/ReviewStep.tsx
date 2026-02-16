'use client';

import { type MarketingStrategyFormData } from '@/types';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ReviewStepProps {
  data: Partial<MarketingStrategyFormData>;
  onSubmit: () => void;
  isSubmitting: boolean;
  processingStatus?: string;
  processingResult?: any;
}

export function ReviewStep({ data, onSubmit, isSubmitting, processingStatus, processingResult }: ReviewStepProps) {
  const getCompletionStatus = () => {
    const sections = [
      { name: 'Business Profile', data: data.businessprofile },
      { name: 'Budget & Resources', data: data.budgetresources },
      { name: 'Business Goals', data: data.businessgoals },
      { name: 'Target Audience', data: data.targetaudience },
      { name: 'Platforms & Preferences', data: data.platformspreferences },
      { name: 'Current Challenges', data: data.currentchallenges },
      { name: 'Strengths & Opportunities', data: data.strengthsopportunities },
      { name: 'Market Situation', data: data.marketsituation }
    ];

    const completed = sections.filter(section => section.data && Object.keys(section.data).length > 0);
    return { completed: completed.length, total: sections.length, sections };
  };

  const { completed, total, sections } = getCompletionStatus();
  const isComplete = completed === total;

  const renderSectionSummary = (sectionName: string, sectionData: any) => {
    if (!sectionData || Object.keys(sectionData).length === 0) {
      return (
        <div className="flex items-center text-yellow-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">Incomplete</span>
        </div>
      );
    }

    return (
      <div className="flex items-center text-[#22C55E]">
        <CheckCircle className="w-4 h-4 mr-2" />
        <span className="text-sm">Complete</span>
      </div>
    );
  };

  const formatBusinessProfile = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-2 text-sm text-[#CBD5E1]">
        <p><strong>Business:</strong> {data.businessType} {data.industry && `- ${data.industry}`}</p>
        <p><strong>Size:</strong> {data.businessSize}</p>
        <p><strong>Stage:</strong> {data.businessStage}</p>
        <p><strong>Location:</strong> {data.location?.city} {data.location?.district && `, ${data.location.district}`}</p>
      </div>
    );
  };

  const formatBudgetResources = (data: any) => {
    if (!data) return null;
    
    const contentCapacity = Array.isArray(data.contentCreationCapacity) 
      ? data.contentCreationCapacity 
      : data.contentCreationCapacity 
        ? [data.contentCreationCapacity]
        : [];
    
    return (
      <div className="space-y-2 text-sm text-[#CBD5E1]">
        <p><strong>Budget:</strong> {data.monthlyBudget}</p>
        <p><strong>Team:</strong> {data.hasMarketingTeam === 'true' ? `Yes (${data.teamSize || 'size not specified'})` : 'Solo'}</p>
        <p><strong>Capabilities:</strong> {contentCapacity.length > 0 ? contentCapacity.join(', ') : 'Not specified'}</p>
      </div>
    );
  };

  const formatBusinessGoals = (data: any) => {
    if (!data) return null;
    
    const secondaryGoals = Array.isArray(data.secondaryGoals) 
      ? data.secondaryGoals 
      : data.secondaryGoals 
        ? [data.secondaryGoals]
        : [];
    
    return (
      <div className="space-y-2 text-sm text-[#CBD5E1]">
        <p><strong>Primary Goal:</strong> {data.primaryGoal?.replace('-', ' ')}</p>
        {secondaryGoals.length > 0 && (
          <p><strong>Secondary Goals:</strong> {secondaryGoals.join(', ')}</p>
        )}
      </div>
    );
  };

  const formatTargetAudience = (data: any) => {
    if (!data) return null;
    
    const genders = Array.isArray(data.demographics?.gender) 
      ? data.demographics.gender 
      : data.demographics?.gender 
        ? [data.demographics.gender]
        : [];
    
    return (
      <div className="space-y-2 text-sm text-[#CBD5E1]">
        <p><strong>Age:</strong> {data.demographics?.ageRange}</p>
        <p><strong>Gender:</strong> {genders.length > 0 ? genders.join(', ') : 'Not specified'}</p>
        <p><strong>Income:</strong> {data.demographics?.incomeLevel}</p>
        <p><strong>Location:</strong> {data.location}</p>
        <p><strong>Buying Frequency:</strong> {data.buyingFrequency}</p>
      </div>
    );
  };

  const formatPlatforms = (data: any) => {
    if (!data) return null;
    
    const platforms = Array.isArray(data.preferredPlatforms) 
      ? data.preferredPlatforms 
      : data.preferredPlatforms 
        ? [data.preferredPlatforms]
        : [];
    
    return (
      <div className="space-y-2 text-sm text-[#CBD5E1]">
        <p><strong>Preferred Platforms:</strong> {platforms.length > 0 ? platforms.join(', ') : 'Not specified'}</p>
        <p><strong>Brand Assets:</strong> 
          {data.brandAssets?.hasLogo ? ' Logo' : ''}
          {data.brandAssets?.hasBrandStyle ? ' Brand Style' : ''}
          {!data.brandAssets?.hasLogo && !data.brandAssets?.hasBrandStyle ? ' None specified' : ''}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-[#0B0F14] border border-[#1F2933] rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-[#F9FAFB] mb-2">
          Review Your Information
        </h3>
        <p className="text-[#CBD5E1] text-sm sm:text-base">
          Please review all sections below. You can go back to edit any section if needed.
        </p>
      </div>

      <div className="bg-[#0B0F14] border border-[#1F2933] rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h4 className="font-medium text-[#F9FAFB] text-base sm:text-lg">Completion Status</h4>
          <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
            isComplete ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-yellow-500/20 text-yellow-500'
          }`}>
            {completed}/{total} sections complete
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {sections.map((section, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#1F2933] rounded-lg">
              <span className="font-medium text-[#CBD5E1] text-sm">{section.name}</span>
              {renderSectionSummary(section.name, section.data)}
            </div>
          ))}
        </div>
      </div>

      {/* Section Details */}
      <div className="space-y-3 sm:space-y-4">
        {sections.map((section, index) => (
          section.data && Object.keys(section.data).length > 0 && (
            <div key={index} className="bg-[#0B0F14] border border-[#1F2933] rounded-lg p-4 sm:p-5">
              <h4 className="font-medium text-[#F9FAFB] mb-3 text-sm sm:text-base">{section.name}</h4>
              {section.name === 'Business Profile' && formatBusinessProfile(section.data)}
              {section.name === 'Budget & Resources' && formatBudgetResources(section.data)}
              {section.name === 'Business Goals' && formatBusinessGoals(section.data)}
              {section.name === 'Target Audience' && formatTargetAudience(section.data)}
              {section.name === 'Platforms & Preferences' && formatPlatforms(section.data)}
              {(section.name === 'Current Challenges' || 
                section.name === 'Strengths & Opportunities' || 
                section.name === 'Market Situation') && (
                <p className="text-sm text-[#CBD5E1]">Information provided ✓</p>
              )}
            </div>
          )
        ))}
      </div>

      {!isComplete && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="font-medium text-yellow-500 text-sm sm:text-base">Incomplete Sections</span>
          </div>
          <p className="text-[#CBD5E1] mt-2 text-sm">
            Please complete all sections to get the most accurate marketing strategy recommendations.
          </p>
        </div>
      )}

      {/* Processing Status */}
      {(isSubmitting || processingStatus) && (
        <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg p-4">
          <h4 className="font-medium text-[#F9FAFB] mb-2 text-sm sm:text-base">Processing Your Data</h4>
          <div className="space-y-2">
            {isSubmitting && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#22C55E] mr-2"></div>
                <span className="text-xs sm:text-sm text-[#CBD5E1]">{processingStatus || 'Processing...'}</span>
              </div>
            )}
            
            {processingResult && (
              <div className="text-xs sm:text-sm text-[#CBD5E1] space-y-1">
                <p>✅ Language Detection: {processingResult.processingMetadata?.detectedLanguage}</p>
                {processingResult.processingMetadata?.translationApplied && (
                  <p>🌐 Translated {processingResult.processingMetadata.translatedFieldsCount} fields</p>
                )}
                <p>📊 Completion Rate: {processingResult.processingMetadata?.completionRate}%</p>
                <p>⏱️ Processing Time: {processingResult.processingMetadata?.totalProcessingTime}ms</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-[#1F2933] pt-6">
        <button
          onClick={onSubmit}
          disabled={!isComplete || isSubmitting}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isSubmitting ? 'Generating Strategy...' : 'Get My Marketing Strategy Recommendations'}
        </button>
        
        {isComplete && !isSubmitting && (
          <p className="text-xs sm:text-sm text-[#CBD5E1] mt-3 text-center">
            Your personalized marketing strategy will be generated based on the information you've provided.
            <br />
            <span className="text-[10px] sm:text-xs">Supports Sinhala and English text with automatic translation.</span>
          </p>
        )}
      </div>
    </div>
  );
}