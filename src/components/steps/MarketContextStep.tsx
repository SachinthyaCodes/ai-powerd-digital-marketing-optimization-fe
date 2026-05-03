'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronDownIcon } from 'lucide-react';
import { type MarketContext } from '@/types';

interface MarketContextStepProps {
  data: Partial<MarketContext>;
  onDataUpdate: (data: MarketContext) => void;
  showErrors?: boolean;
}

// ── Challenges ────────────────────────────────────────────────────────────────
const COMMON_CHALLENGES = [
  { id: 'low-reach', title: 'Low Reach', description: "Not enough people seeing my content or ads" },
  { id: 'low-conversion', title: 'Low Conversion', description: "People see my content but don't take action" },
  { id: 'content-creation', title: 'Cannot Create Content', description: 'Struggling to create engaging posts, videos, or images' },
  { id: 'competitor-pressure', title: 'Competitor Pressure', description: 'Competitors are getting more attention than me' },
  { id: 'inconsistent-posting', title: 'Inconsistent Posting', description: "Can't maintain a regular posting schedule" },
  { id: 'limited-budget', title: 'Limited Budget', description: 'Not enough money to invest in effective marketing' },
  { id: 'no-strategy', title: 'No Clear Strategy', description: "Don't know what marketing approach to take" },
  { id: 'measuring-roi', title: 'Measuring ROI', description: "Can't tell if marketing efforts are working" },
  { id: 'time-management', title: 'Time Management', description: 'Not enough time to manage marketing effectively' },
  { id: 'staying-updated', title: 'Staying Updated', description: 'Marketing trends and algorithms change too fast' },
];

// ── Business Strengths ────────────────────────────────────────────────────────
const BUSINESS_STRENGTHS = [
  { id: 'existing-customers', title: 'Strong Customer Base', description: 'Loyal customers who return regularly' },
  { id: 'community-support', title: 'Community Support', description: 'Local community knows and supports the business' },
  { id: 'high-quality-products', title: 'High-Quality Products/Services', description: 'Superior quality compared to competitors' },
  { id: 'competitive-pricing', title: 'Competitive Pricing', description: 'Better prices than competitors' },
  { id: 'excellent-service', title: 'Excellent Customer Service', description: 'Known for outstanding customer care' },
  { id: 'unique-location', title: 'Great Location', description: 'Strategic or high-traffic location' },
  { id: 'experienced-team', title: 'Experienced Team', description: 'Skilled and knowledgeable staff' },
  { id: 'positive-reputation', title: 'Strong Reputation', description: 'Well-known for reliability and trustworthiness' },
];

// ── Sri Lanka Seasonality ─────────────────────────────────────────────────────
const SEASONALITY_CATEGORIES: Record<string, string[]> = {
  'Religious & Cultural Festivals': [
    'Sinhala & Tamil New Year (April)',
    'Vesak (May)',
    'Poson (June)',
    'Christmas (December)',
    'New Year (January 1st)',
    'Diwali / Deepavali (Oct–Nov)',
    'Ramadan & Eid-ul-Fitr (Dates vary)',
    'Kandy Esala Perahera (July–Aug)',
  ],
  'Education-Related Seasons': [
    'Back-to-School season (Dec–Jan)',
    'O/L Exam season (December)',
    'A/L Exam season (August)',
    'University admission periods',
  ],
  'Weather & Tourism': [
    'South-West Monsoon (May–Sept)',
    'December – April (Tourist peak)',
    'July – August (Cultural festivals / regional tourism)',
    'Dry season boosts outdoor events, travel, clothing',
  ],
  'Economic & Financial Cycles': [
    'Salary Cycle (25th–5th of every month)',
    'Government Budget Season (November)',
    'Inflation spikes / economic uncertainty',
    'Harvest seasons impacting food prices',
  ],
  'Industry-Specific Seasons': [
    'Wedding Seasons (December–March)',
    'Wedding Seasons (August–September)',
    'Foreign tourist peak (Dec–April)',
    'Festival-driven tourism (July–August)',
  ],
  'Holiday & Lifestyle': [
    'School holidays (April, August, December)',
    'New Year resolution season (January)',
    'Special shopping seasons (Year-end December)',
  ],
};

export function MarketContextStep({ data, onDataUpdate, showErrors }: MarketContextStepProps) {
  const { register, watch, reset } = useForm<MarketContext>({
    defaultValues: {
      ...data,
      seasonality: data.seasonality || [],
      challenges: data.challenges || [],
      strengths: data.strengths || [],
    }
  });

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedSeasonality, setSelectedSeasonality] = useState<{ category: string; subcategories: string[] }[]>(
    data.seasonality || []
  );

  const watchedData = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      onDataUpdate({
        ...(value as MarketContext),
        seasonality: selectedSeasonality,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataUpdate, selectedSeasonality]);

  // Emit when seasonality changes
  useEffect(() => {
    onDataUpdate({
      ...(watchedData as MarketContext),
      seasonality: selectedSeasonality,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeasonality]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleSubcategoryChange = (category: string, subcategory: string, checked: boolean) => {
    setSelectedSeasonality(prev => {
      const idx = prev.findIndex(item => item.category === category);
      if (checked) {
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], subcategories: [...updated[idx].subcategories, subcategory] };
          return updated;
        }
        return [...prev, { category, subcategories: [subcategory] }];
      } else {
        if (idx >= 0) {
          const updated = [...prev];
          const filtered = updated[idx].subcategories.filter(s => s !== subcategory);
          if (filtered.length === 0) return updated.filter((_, i) => i !== idx);
          updated[idx] = { ...updated[idx], subcategories: filtered };
          return updated;
        }
        return prev;
      }
    });
  };

  const isSubcategorySelected = (category: string, subcategory: string) => {
    const cat = selectedSeasonality.find(item => item.category === category);
    return cat ? cat.subcategories.includes(subcategory) : false;
  };

  const totalSeasonalitySelected = selectedSeasonality.reduce((acc, cat) => acc + cat.subcategories.length, 0);

  return (
    <div className="space-y-10">

      {/* ── Current Challenges ────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-[#F9FAFB] mb-2">
          Current Marketing Challenges <span className="text-[#22C55E]">*</span>
          {(Array.isArray(watchedData.challenges) ? watchedData.challenges : []).length > 0 && (
            <span className="ml-2 text-xs text-[#22C55E] font-normal">
              {(Array.isArray(watchedData.challenges) ? watchedData.challenges : []).length} selected
            </span>
          )}
        </label>
        <p className="text-sm text-[#CBD5E1]/70 mb-4">Select all challenges that apply — this shapes the solutions we recommend.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {COMMON_CHALLENGES.map(challenge => (
            <label key={challenge.id} className="flex items-start p-4 bg-[#1F2933] border border-[#1F2933] rounded-lg hover:border-[#22C55E]/30 cursor-pointer transition-all">
              <input
                type="checkbox"
                {...register('challenges')}
                value={challenge.id}
                className="w-4 h-4 mt-1 text-[#22C55E] bg-[#1F2933] border-[#CBD5E1]/30 rounded focus:ring-[#22C55E] focus:ring-2 flex-shrink-0"
              />
              <div className="ml-3">
                <span className="font-medium text-[#F9FAFB] block text-sm">{challenge.title}</span>
                <p className="text-xs text-[#CBD5E1] mt-0.5">{challenge.description}</p>
              </div>
            </label>
          ))}
        </div>
        {showErrors && !(Array.isArray(watchedData.challenges) && watchedData.challenges.length > 0) && (
          <p className="text-xs text-red-400 mt-2">Please select at least one challenge</p>
        )}
      </div>

      {/* ── Business Strengths ────────────────────────────────────── */}
      <div className="border-t border-[#1F2933] pt-8">
        <label className="block text-sm font-medium text-[#F9FAFB] mb-2">
          Business Strengths <span className="text-[#22C55E]">*</span>
          {(Array.isArray(watchedData.strengths) ? watchedData.strengths : []).length > 0 && (
            <span className="ml-2 text-xs text-[#22C55E] font-normal">
              {(Array.isArray(watchedData.strengths) ? watchedData.strengths : []).length} selected
            </span>
          )}
        </label>
        <p className="text-sm text-[#CBD5E1]/70 mb-4">Select your key advantages — we'll leverage these in your strategy.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BUSINESS_STRENGTHS.map(strength => (
            <label key={strength.id} className="flex items-start p-4 bg-[#1F2933] border border-[#1F2933] rounded-lg hover:border-[#22C55E]/30 cursor-pointer transition-all">
              <input
                type="checkbox"
                {...register('strengths')}
                value={strength.id}
                className="w-4 h-4 mt-1 text-[#22C55E] bg-[#1F2933] border-[#CBD5E1]/30 rounded focus:ring-[#22C55E] focus:ring-2 flex-shrink-0"
              />
              <div className="ml-3">
                <span className="font-medium text-[#F9FAFB] block text-sm">{strength.title}</span>
                <p className="text-xs text-[#CBD5E1] mt-0.5">{strength.description}</p>
              </div>
            </label>
          ))}
        </div>
        {showErrors && !(Array.isArray(watchedData.strengths) && watchedData.strengths.length > 0) && (
          <p className="text-xs text-red-400 mt-2">Please select at least one strength</p>
        )}
      </div>

      {/* ── Seasonality ───────────────────────────────────────────── */}
      <div className="border-t border-[#1F2933] pt-8">
        <label className="block text-sm font-medium text-[#F9FAFB] mb-2">
          Seasonal Factors <span className="text-[#CBD5E1]/40 text-xs font-normal">(Optional — select what applies)</span>
          {totalSeasonalitySelected > 0 && (
            <span className="ml-2 text-xs text-[#22C55E] font-normal">{totalSeasonalitySelected} selected</span>
          )}
        </label>
        <p className="text-sm text-[#CBD5E1]/70 mb-4">When does your business typically perform better or face challenges?</p>
        <div className="space-y-3">
          {Object.entries(SEASONALITY_CATEGORIES).map(([category, subcategories]) => (
            <div key={category} className="border border-[#1F2933] rounded-lg bg-[#1F2933] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#0B0F14]/50 transition-colors"
              >
                <span className="font-medium text-[#F9FAFB] text-sm">{category}</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-[#CBD5E1] transition-transform ${expandedCategories[category] ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedCategories[category] && (
                <div className="border-t border-[#0B0F14] px-4 pb-4 pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {subcategories.map(subcategory => (
                      <label key={subcategory} className="flex items-start p-2.5 border border-[#0B0F14] rounded hover:bg-[#0B0F14]/50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={isSubcategorySelected(category, subcategory)}
                          onChange={(e) => handleSubcategoryChange(category, subcategory, e.target.checked)}
                          className="w-4 h-4 mt-0.5 text-[#22C55E] bg-[#1F2933] border-[#CBD5E1]/30 rounded focus:ring-[#22C55E] focus:ring-2"
                        />
                        <span className="ml-2 text-xs text-[#CBD5E1]">{subcategory}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Competitor Behavior (Optional) ───────────────────────── */}
      <div className="border-t border-[#1F2933] pt-8">
        <label htmlFor="competitorBehavior" className="block text-sm font-medium text-[#F9FAFB] mb-3">
          Competitor Activity <span className="text-[#CBD5E1]/40 text-xs font-normal">(Optional)</span>
        </label>
        <textarea
          {...register('competitorBehavior')}
          rows={3}
          placeholder="What are your competitors doing? Any new ads, promotions, or strategies you've noticed?"
          className="w-full px-4 py-3 bg-[#1F2933] border border-[#1F2933] text-[#F9FAFB] placeholder-[#CBD5E1]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all resize-none"
        />
        <p className="text-xs text-[#CBD5E1]/60 mt-2">Helps us find gaps and opportunities vs. competitors</p>
      </div>

      {/* ── Additional Notes (Optional) ───────────────────────────── */}
      <div>
        <label htmlFor="additionalNotes" className="block text-sm font-medium text-[#F9FAFB] mb-3">
          Anything else we should know? <span className="text-[#CBD5E1]/40 text-xs font-normal">(Optional)</span>
        </label>
        <textarea
          {...register('additionalNotes')}
          rows={3}
          maxLength={500}
          placeholder="Any unique business context, special circumstances, or additional information..."
          className="w-full px-4 py-3 bg-[#1F2933] border border-[#1F2933] text-[#F9FAFB] placeholder-[#CBD5E1]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all resize-none"
        />
      </div>

    </div>
  );
}
