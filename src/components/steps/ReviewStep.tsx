'use client';

import { type MarketingStrategyFormData } from '@/types';
import { CheckCircle, AlertCircle, Cpu } from 'lucide-react';

interface ReviewStepProps {
  data: Partial<MarketingStrategyFormData>;
  onSubmit: () => void;
  isSubmitting: boolean;
  processingStatus?: string;
  processingResult?: any;
  streamingText?: string;
}

export function ReviewStep({ data, onSubmit, isSubmitting, processingStatus, processingResult, streamingText }: ReviewStepProps) {
  const sections = [
    { key: 'businessProfile' as const, name: 'Business Profile' },
    { key: 'budgetAndGoals' as const, name: 'Budget & Goals' },
    { key: 'targetAudience' as const, name: 'Your Customers' },
    { key: 'marketContext' as const, name: 'Market Context' },
  ];

  const completed = sections.filter(s => {
    const d = data[s.key] as any;
    return d && Object.keys(d).length > 0;
  });
  const isComplete = completed.length === sections.length;

  const bp = data.businessProfile as any;
  const bg = data.budgetAndGoals as any;
  const ta = data.targetAudience as any;
  const mc = data.marketContext as any;

  const GOAL_LABELS: Record<string, string> = {
    'brand-awareness': 'Brand Awareness',
    'leads': 'Generate Leads',
    'sales': 'Increase Sales',
    'customer-retention': 'Customer Retention',
    'local-visits': 'Local Store Visits',
    'online-traffic': 'Website Traffic',
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-[#22C55E]/[0.05] border border-[#22C55E]/20 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-1">
          <Cpu className="w-5 h-5 text-[#22C55E]" />
          <h3 className="text-base font-semibold text-[#F9FAFB]">Ready to Generate Your Strategy</h3>
        </div>
        <p className="text-sm text-[#94A3B8]">
          Our AI will analyse your profile and recommend the best marketing platforms, budget split, and action plan — entirely based on market data.
        </p>
      </div>

      {/* Completion status bar */}
      <div className="bg-[#0B0F14] border border-[#1F2933] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Form Completion</h4>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isComplete ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {completed.length}/{sections.length} complete
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sections.map(section => {
            const d = data[section.key] as any;
            const done = d && Object.keys(d).length > 0;
            return (
              <div key={section.key} className="flex items-center justify-between p-3 bg-[#1F2933] rounded-lg">
                <span className="text-sm text-[#CBD5E1]">{section.name}</span>
                {done ? (
                  <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Business Profile */}
        {bp && (
          <div className="bg-[#0B0F14] border border-[#1F2933] rounded-xl p-5 space-y-1.5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#22C55E]/60 font-semibold mb-3">Business Profile</p>
            <p className="text-sm text-[#F9FAFB] font-medium">{bp.businessType}{bp.industry ? ` · ${bp.industry}` : ''}</p>
            <p className="text-xs text-[#94A3B8]">{bp.businessSize} · {bp.businessStage}</p>
            <p className="text-xs text-[#94A3B8]">📍 {bp.location?.city}{bp.location?.district ? `, ${bp.location.district}` : ''}</p>
            {bp.hasLogo && <p className="text-xs text-[#22C55E]/70">✓ Has business logo</p>}
          </div>
        )}

        {/* Budget & Goals */}
        {bg && (
          <div className="bg-[#0B0F14] border border-[#1F2933] rounded-xl p-5 space-y-1.5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#22C55E]/60 font-semibold mb-3">Budget & Goals</p>
            <p className="text-sm text-[#F9FAFB] font-medium">{bg.monthlyBudget}</p>
            <p className="text-xs text-[#94A3B8]">🎯 {GOAL_LABELS[bg.primaryGoal] || bg.primaryGoal}</p>
            <p className="text-xs text-[#94A3B8]">Team: {bg.hasMarketingTeam === 'true' ? 'Yes' : 'Solo'}</p>
            {Array.isArray(bg.contentCreationCapacity) && bg.contentCreationCapacity.length > 0 && (
              <p className="text-xs text-[#94A3B8]">🎨 {bg.contentCreationCapacity.slice(0, 2).join(', ')}{bg.contentCreationCapacity.length > 2 ? ` +${bg.contentCreationCapacity.length - 2}` : ''}</p>
            )}
          </div>
        )}

        {/* Target Audience */}
        {ta && (
          <div className="bg-[#0B0F14] border border-[#1F2933] rounded-xl p-5 space-y-1.5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#22C55E]/60 font-semibold mb-3">Your Customers</p>
            <p className="text-sm text-[#F9FAFB] font-medium">Age {ta.demographics?.ageRange}</p>
            <p className="text-xs text-[#94A3B8]">{ta.demographics?.incomeLevel}</p>
            <p className="text-xs text-[#94A3B8]">📍 {ta.location}</p>
            <p className="text-xs text-[#94A3B8]">Buys: {ta.buyingFrequency}</p>
            {Array.isArray(ta.interests) && ta.interests.length > 0 && (
              <p className="text-xs text-[#94A3B8]">❤ {ta.interests.slice(0, 3).join(', ')}{ta.interests.length > 3 ? ` +${ta.interests.length - 3}` : ''}</p>
            )}
          </div>
        )}

        {/* Market Context */}
        {mc && (
          <div className="bg-[#0B0F14] border border-[#1F2933] rounded-xl p-5 space-y-1.5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#22C55E]/60 font-semibold mb-3">Market Context</p>
            {Array.isArray(mc.challenges) && mc.challenges.length > 0 && (
              <p className="text-xs text-[#94A3B8]">⚠ {mc.challenges.length} challenge{mc.challenges.length !== 1 ? 's' : ''} identified</p>
            )}
            {Array.isArray(mc.strengths) && mc.strengths.length > 0 && (
              <p className="text-xs text-[#94A3B8]">💪 {mc.strengths.length} strength{mc.strengths.length !== 1 ? 's' : ''} identified</p>
            )}
            {Array.isArray(mc.seasonality) && mc.seasonality.length > 0 && (
              <p className="text-xs text-[#22C55E]/70">📅 Seasonal factors included</p>
            )}
            {mc.competitorBehavior && (
              <p className="text-xs text-[#22C55E]/70">🔍 Competitor context provided</p>
            )}
          </div>
        )}
      </div>

      {/* Incomplete warning */}
      {!isComplete && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-400">Some sections are incomplete</p>
            <p className="text-xs text-[#94A3B8] mt-1">Please go back and complete all required fields for the most accurate strategy.</p>
          </div>
        </div>
      )}

      {/* Processing status */}
      {(isSubmitting || processingStatus) && (
        <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#22C55E]/30 border-t-[#22C55E]" />
            )}
            <p className="text-sm text-[#94A3B8]">{processingStatus || 'Processing...'}</p>
          </div>
          {streamingText && (
            <div className="max-h-32 overflow-y-auto rounded-lg bg-[#0B0F14] border border-[#2D3748] p-3">
              <p className="text-xs text-[#64748B] font-mono leading-relaxed whitespace-pre-wrap break-words">
                {streamingText}
                <span className="inline-block w-1.5 h-3 bg-[#22C55E] ml-0.5 animate-pulse" />
              </p>
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <div className="border-t border-[#1F2933] pt-6">
        <button
          onClick={onSubmit}
          disabled={!isComplete || isSubmitting}
          className="w-full py-4 bg-[#22C55E] text-[#0B0F14] rounded-xl font-semibold text-sm hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Generating Your Strategy...' : '✨ Get My AI Marketing Strategy'}
        </button>
        {isComplete && !isSubmitting && (
          <p className="text-xs text-[#64748B] mt-3 text-center">
            Our AI analyses your profile against real Sri Lanka market data to recommend the best platforms and plan for your business.
          </p>
        )}
      </div>

    </div>
  );
}