'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type TargetAudience } from '@/types';

interface TargetAudienceStepProps {
  data: Partial<TargetAudience>;
  onDataUpdate: (data: TargetAudience) => void;
  showErrors?: boolean;
}

const AGE_RANGES = ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'];

const INCOME_LEVELS = [
  'Low income (Under LKR 1M annually)',
  'Middle income (LKR 1M–2.5M annually)',
  'Upper middle (LKR 2.5M–5M annually)',
  'High income (LKR 5M+ annually)',
  'Mixed income levels'
];

const COMMON_INTERESTS = [
  'Food & Dining',
  'Fashion & Beauty',
  'Health & Fitness',
  'Technology',
  'Travel',
  'Entertainment',
  'Sports',
  'Home & Garden',
  'Business & Finance',
  'Education',
  'Family & Parenting',
  'Art & Culture'
];

const BUYING_FREQUENCIES = [
  { value: 'rare', label: 'Rare (a few times per year)' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' }
];

export function TargetAudienceStep({ data, onDataUpdate, showErrors }: TargetAudienceStepProps) {
  const { register, watch, reset } = useForm<TargetAudience>({
    defaultValues: data
  });

  const watchedData = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      onDataUpdate(value as TargetAudience);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataUpdate]);

  return (
    <div className="space-y-8">

      {/* Row: Age Range + Income Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="ageRange" className="block text-sm font-medium text-[#F9FAFB] mb-3">
            Primary Age Range <span className="text-[#22C55E]">*</span>
          </label>
          <select
            {...register('demographics.ageRange', { required: true })}
            className={`w-full px-4 py-3 bg-[#1F2933] border ${showErrors && !watchedData.demographics?.ageRange ? 'border-red-500/50' : 'border-[#1F2933]'} text-[#F9FAFB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all`}
          >
            <option value="">Select age range</option>
            {AGE_RANGES.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
          {showErrors && !watchedData.demographics?.ageRange && (
            <p className="text-xs text-red-400 mt-2">Please select the primary age range</p>
          )}
        </div>

        <div>
          <label htmlFor="incomeLevel" className="block text-sm font-medium text-[#F9FAFB] mb-3">
            Income Level <span className="text-[#22C55E]">*</span>
          </label>
          <select
            {...register('demographics.incomeLevel', { required: true })}
            className={`w-full px-4 py-3 bg-[#1F2933] border ${showErrors && !watchedData.demographics?.incomeLevel ? 'border-red-500/50' : 'border-[#1F2933]'} text-[#F9FAFB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all`}
          >
            <option value="">Select income level</option>
            {INCOME_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {showErrors && !watchedData.demographics?.incomeLevel && (
            <p className="text-xs text-red-400 mt-2">Please select the income level</p>
          )}
        </div>
      </div>

      {/* Customer Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-[#F9FAFB] mb-3">
          Where are your customers located? <span className="text-[#22C55E]">*</span>
        </label>
        <input
          type="text"
          {...register('location', { required: true })}
          placeholder="e.g., Local area, Colombo, nationwide"
          className={`w-full px-4 py-3 bg-[#1F2933] border ${showErrors && !watchedData.location?.trim() ? 'border-red-500/50' : 'border-[#1F2933]'} text-[#F9FAFB] placeholder-[#CBD5E1]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all`}
        />
        {showErrors && !watchedData.location?.trim() && (
          <p className="text-xs text-red-400 mt-2">Please enter the customer location</p>
        )}
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-medium text-[#F9FAFB] mb-4">
          Customer Interests <span className="text-[#22C55E]">*</span>
          {(Array.isArray(watchedData.interests) ? watchedData.interests : []).length > 0 && (
            <span className="ml-2 text-xs text-[#22C55E] font-normal">
              {(Array.isArray(watchedData.interests) ? watchedData.interests : []).length} selected
            </span>
          )}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {COMMON_INTERESTS.map(interest => (
            <label key={interest} className="flex items-center p-3 bg-[#1F2933] border border-[#1F2933] rounded-lg cursor-pointer hover:border-[#22C55E]/30 transition-all">
              <input
                type="checkbox"
                {...register('interests')}
                value={interest}
                className="w-4 h-4 text-[#22C55E] bg-[#1F2933] border-[#CBD5E1]/30 rounded focus:ring-[#22C55E] focus:ring-2"
              />
              <span className="ml-2 text-sm text-[#F9FAFB]">{interest}</span>
            </label>
          ))}
        </div>
        {showErrors && !(Array.isArray(watchedData.interests) && watchedData.interests.length > 0) ? (
          <p className="text-xs text-red-400 mt-3">Please select at least one interest</p>
        ) : (
          <p className="text-xs text-[#CBD5E1]/60 mt-3">Choose interests that best represent your customers</p>
        )}
      </div>

      {/* Buying Frequency */}
      <div>
        <label htmlFor="buyingFrequency" className="block text-sm font-medium text-[#F9FAFB] mb-3">
          How often do customers buy this type of product/service? <span className="text-[#22C55E]">*</span>
        </label>
        <select
          {...register('buyingFrequency', { required: true })}
          className={`w-full px-4 py-3 bg-[#1F2933] border ${showErrors && !watchedData.buyingFrequency ? 'border-red-500/50' : 'border-[#1F2933]'} text-[#F9FAFB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all`}
        >
          <option value="">Select buying frequency</option>
          {BUYING_FREQUENCIES.map(freq => (
            <option key={freq.value} value={freq.value}>{freq.label}</option>
          ))}
        </select>
        {showErrors && !watchedData.buyingFrequency && (
          <p className="text-xs text-red-400 mt-2">Please select the buying frequency</p>
        )}
      </div>

    </div>
  );
}