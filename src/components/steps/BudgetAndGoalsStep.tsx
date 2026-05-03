'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type BudgetAndGoals } from '@/types';

interface BudgetAndGoalsStepProps {
  data: Partial<BudgetAndGoals>;
  onDataUpdate: (data: BudgetAndGoals) => void;
  showErrors?: boolean;
}

const BUDGET_RANGES = [
  'Under LKR 50,000/month',
  'LKR 50,000 – 100,000/month',
  'LKR 100,000 – 250,000/month',
  'LKR 250,000 – 500,000/month',
  'LKR 500,000 – 1,000,000/month',
  'Over LKR 1,000,000/month'
];

const CONTENT_CAPACITIES = [
  'Professional photography',
  'Video creation',
  'Graphic design',
  'Content writing',
  'Social media management',
  'No content creation capacity'
];

const PRIMARY_GOALS = [
  { value: 'brand-awareness', label: 'Brand Awareness', description: 'Get more people to know about your business' },
  { value: 'leads', label: 'Generate Leads', description: 'Get potential customers to contact you' },
  { value: 'sales', label: 'Increase Sales', description: 'Drive direct sales and revenue' },
  { value: 'customer-retention', label: 'Customer Retention', description: 'Keep existing customers coming back' },
  { value: 'local-visits', label: 'Local Store Visits', description: 'Drive foot traffic to your physical location' },
  { value: 'online-traffic', label: 'Website Traffic', description: 'Increase visitors to your website' }
];

export function BudgetAndGoalsStep({ data, onDataUpdate, showErrors }: BudgetAndGoalsStepProps) {
  const { register, watch, reset } = useForm<BudgetAndGoals>({
    defaultValues: data
  });

  const watchedData = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      onDataUpdate(value as BudgetAndGoals);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataUpdate]);

  return (
    <div className="space-y-10">

      {/* ── Monthly Budget ────────────────────────────────────────── */}
      <div>
        <label htmlFor="monthlyBudget" className="block text-sm font-medium text-[#F9FAFB] mb-3">
          Monthly Marketing Budget <span className="text-[#22C55E]">*</span>
        </label>
        <select
          {...register('monthlyBudget', { required: true })}
          className={`w-full px-4 py-3 bg-[#1F2933] border ${showErrors && !watchedData.monthlyBudget ? 'border-red-500/50' : 'border-[#1F2933]'} text-[#F9FAFB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all`}
        >
          <option value="">Select budget range</option>
          {BUDGET_RANGES.map(range => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
        {showErrors && !watchedData.monthlyBudget && (
          <p className="text-xs text-red-400 mt-2">Please select your monthly budget</p>
        )}
      </div>

      {/* ── Marketing Team ────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-[#F9FAFB] mb-4">
          Do you have a marketing team? <span className="text-[#22C55E]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-center p-4 bg-[#1F2933] border border-[#1F2933] rounded-lg cursor-pointer hover:border-[#22C55E]/30 transition-all">
            <input
              type="radio"
              {...register('hasMarketingTeam', { required: true })}
              value="true"
              className="w-4 h-4 text-[#22C55E] bg-[#1F2933] border-[#CBD5E1]/30 focus:ring-[#22C55E] focus:ring-2"
            />
            <span className="ml-3 text-[#F9FAFB]">Yes, I have a team</span>
          </label>
          <label className="flex items-center p-4 bg-[#1F2933] border border-[#1F2933] rounded-lg cursor-pointer hover:border-[#22C55E]/30 transition-all">
            <input
              type="radio"
              {...register('hasMarketingTeam', { required: true })}
              value="false"
              className="w-4 h-4 text-[#22C55E] bg-[#1F2933] border-[#CBD5E1]/30 focus:ring-[#22C55E] focus:ring-2"
            />
            <span className="ml-3 text-[#F9FAFB]">No, I manage it myself</span>
          </label>
        </div>
        {showErrors && !watchedData.hasMarketingTeam && (
          <p className="text-xs text-red-400 mt-2">Please select an option</p>
        )}
      </div>

      {/* ── Content Creation Capacity ─────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-[#F9FAFB] mb-4">
          Content Creation Capacity <span className="text-[#22C55E]">*</span>
          {(Array.isArray(watchedData.contentCreationCapacity) ? watchedData.contentCreationCapacity : []).length > 0 && (
            <span className="ml-2 text-xs text-[#22C55E] font-normal">
              {(Array.isArray(watchedData.contentCreationCapacity) ? watchedData.contentCreationCapacity : []).length} selected
            </span>
          )}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTENT_CAPACITIES.map(capacity => (
            <label key={capacity} className="flex items-center p-4 bg-[#1F2933] border border-[#1F2933] rounded-lg cursor-pointer hover:border-[#22C55E]/30 transition-all">
              <input
                type="checkbox"
                {...register('contentCreationCapacity')}
                value={capacity}
                className="w-4 h-4 text-[#22C55E] bg-[#1F2933] border-[#CBD5E1]/30 rounded focus:ring-[#22C55E] focus:ring-2"
              />
              <span className="ml-3 text-sm text-[#F9FAFB]">{capacity}</span>
            </label>
          ))}
        </div>
        {showErrors && !(Array.isArray(watchedData.contentCreationCapacity) && watchedData.contentCreationCapacity.length > 0) && (
          <p className="text-xs text-red-400 mt-3">Please select at least one option</p>
        )}
      </div>

      {/* ── Primary Marketing Goal ────────────────────────────────── */}
      <div className="border-t border-[#1F2933] pt-8">
        <p className="text-xs tracking-[0.2em] uppercase text-[#22C55E]/60 font-semibold mb-1">Your Goal</p>
        <label className="block text-sm font-medium text-[#F9FAFB] mb-4">
          What is your primary marketing objective? <span className="text-[#22C55E]">*</span>
        </label>
        <div className="space-y-3">
          {PRIMARY_GOALS.map(goal => (
            <label key={goal.value} className="flex items-start p-4 bg-[#1F2933] border border-[#1F2933] rounded-lg hover:border-[#22C55E]/30 cursor-pointer transition-all">
              <input
                type="radio"
                {...register('primaryGoal', { required: true })}
                value={goal.value}
                className="w-4 h-4 mt-1 text-[#22C55E] bg-[#1F2933] border-[#CBD5E1]/30 focus:ring-[#22C55E] focus:ring-2"
              />
              <div className="ml-3">
                <span className="font-medium text-[#F9FAFB]">{goal.label}</span>
                <p className="text-sm text-[#CBD5E1] mt-0.5">{goal.description}</p>
              </div>
            </label>
          ))}
        </div>
        {showErrors && !watchedData.primaryGoal && (
          <p className="text-xs text-red-400 mt-2">Please select your primary marketing goal</p>
        )}
      </div>

    </div>
  );
}
