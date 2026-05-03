'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type BusinessProfile } from '@/types';

interface BusinessProfileStepProps {
  data: Partial<BusinessProfile>;
  onDataUpdate: (data: BusinessProfile) => void;
  showErrors?: boolean;
}

const BUSINESS_TYPES = [
  'Restaurant/Food',
  'Retail/E-commerce',
  'Healthcare',
  'Education',
  'Technology',
  'Construction',
  'Beauty/Wellness',
  'Professional Services',
  'Entertainment',
  'Real Estate',
  'Manufacturing',
  'Other'
];

const BUSINESS_SIZES = [
  { value: 'solo', label: 'Solo (Just me)' },
  { value: 'small-team', label: 'Small Team (2–10 people)' },
  { value: 'medium', label: 'Medium (11–50 people)' },
  { value: 'large', label: 'Large (50+ people)' }
];

const BUSINESS_STAGES = [
  { value: 'new', label: 'New (0–1 years)' },
  { value: 'growing', label: 'Growing (1–3 years)' },
  { value: 'established', label: 'Established (3+ years)' }
];

export function BusinessProfileStep({ data, onDataUpdate, showErrors }: BusinessProfileStepProps) {
  const { register, watch, reset } = useForm<BusinessProfile>({
    defaultValues: data
  });

  const watchedData = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      onDataUpdate(value as BusinessProfile);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataUpdate]);

  return (
    <div className="space-y-8">
      {/* Row 1: Business Type + Specific Industry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-[#F9FAFB] mb-3">
            Business Type <span className="text-[#22C55E]">*</span>
          </label>
          <select
            {...register('businessType', { required: true })}
            className={`w-full px-4 py-3 bg-[#1F2933] border ${showErrors && !watchedData.businessType ? 'border-red-500/50' : 'border-[#1F2933]'} text-[#F9FAFB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all`}
          >
            <option value="">Select business type</option>
            {BUSINESS_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {showErrors && !watchedData.businessType && (
            <p className="text-xs text-red-400 mt-2">Please select your business type</p>
          )}
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-[#F9FAFB] mb-3">
            Specific Industry <span className="text-[#CBD5E1]/40 text-xs font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            {...register('industry')}
            placeholder="e.g., Italian Restaurant, Fashion Retail"
            className="w-full px-4 py-3 bg-[#1F2933] border border-[#1F2933] text-[#F9FAFB] placeholder-[#CBD5E1]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Row 2: Business Size + Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="businessSize" className="block text-sm font-medium text-[#F9FAFB] mb-3">
            Business Size <span className="text-[#22C55E]">*</span>
          </label>
          <select
            {...register('businessSize', { required: true })}
            className={`w-full px-4 py-3 bg-[#1F2933] border ${showErrors && !watchedData.businessSize ? 'border-red-500/50' : 'border-[#1F2933]'} text-[#F9FAFB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all`}
          >
            <option value="">Select business size</option>
            {BUSINESS_SIZES.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
          {showErrors && !watchedData.businessSize && (
            <p className="text-xs text-red-400 mt-2">Please select your business size</p>
          )}
        </div>

        <div>
          <label htmlFor="businessStage" className="block text-sm font-medium text-[#F9FAFB] mb-3">
            Business Stage <span className="text-[#22C55E]">*</span>
          </label>
          <select
            {...register('businessStage', { required: true })}
            className={`w-full px-4 py-3 bg-[#1F2933] border ${showErrors && !watchedData.businessStage ? 'border-red-500/50' : 'border-[#1F2933]'} text-[#F9FAFB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all`}
          >
            <option value="">Select business stage</option>
            {BUSINESS_STAGES.map(stage => (
              <option key={stage.value} value={stage.value}>{stage.label}</option>
            ))}
          </select>
          {showErrors && !watchedData.businessStage && (
            <p className="text-xs text-red-400 mt-2">Please select your business stage</p>
          )}
        </div>
      </div>

      {/* Row 3: City + District */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-[#F9FAFB] mb-3">
            City <span className="text-[#22C55E]">*</span>
          </label>
          <input
            type="text"
            {...register('location.city', { required: true })}
            placeholder="e.g., Colombo, Kandy, Galle"
            className={`w-full px-4 py-3 bg-[#1F2933] border ${showErrors && !watchedData.location?.city ? 'border-red-500/50' : 'border-[#1F2933]'} text-[#F9FAFB] placeholder-[#CBD5E1]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all`}
          />
          {showErrors && !watchedData.location?.city && (
            <p className="text-xs text-red-400 mt-2">Please enter your city</p>
          )}
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-medium text-[#F9FAFB] mb-3">
            District / Area <span className="text-[#CBD5E1]/40 text-xs font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            {...register('location.district')}
            placeholder="e.g., Colombo 07, Nugegoda"
            className="w-full px-4 py-3 bg-[#1F2933] border border-[#1F2933] text-[#F9FAFB] placeholder-[#CBD5E1]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Products / Services */}
      <div>
        <label htmlFor="productsServices" className="block text-sm font-medium text-[#F9FAFB] mb-3">
          Products / Services <span className="text-[#22C55E]">*</span>
        </label>
        <textarea
          {...register('productsServices', { required: true })}
          rows={3}
          maxLength={500}
          placeholder="Briefly describe what you sell or offer"
          className={`w-full px-4 py-3 bg-[#1F2933] border ${showErrors && !watchedData.productsServices?.trim() ? 'border-red-500/50' : 'border-[#1F2933]'} text-[#F9FAFB] placeholder-[#CBD5E1]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all resize-none`}
        />
        <div className="flex justify-between items-center mt-2">
          {showErrors && !watchedData.productsServices?.trim() ? (
            <p className="text-xs text-red-400">Please describe your products or services</p>
          ) : <span />}
          <span className={`text-xs ml-auto ${(watchedData.productsServices?.length || 0) > 450 ? 'text-yellow-400' : 'text-[#CBD5E1]/40'}`}>
            {watchedData.productsServices?.length || 0}/500
          </span>
        </div>
      </div>

      {/* USP */}
      <div>
        <label htmlFor="uniqueSellingProposition" className="block text-sm font-medium text-[#F9FAFB] mb-3">
          What makes you different? (USP) <span className="text-[#22C55E]">*</span>
        </label>
        <textarea
          {...register('uniqueSellingProposition', { required: true })}
          rows={3}
          maxLength={500}
          placeholder="What sets your business apart from competitors?"
          className={`w-full px-4 py-3 bg-[#1F2933] border ${showErrors && !watchedData.uniqueSellingProposition?.trim() ? 'border-red-500/50' : 'border-[#1F2933]'} text-[#F9FAFB] placeholder-[#CBD5E1]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all resize-none`}
        />
        <div className="flex justify-between items-center mt-2">
          {showErrors && !watchedData.uniqueSellingProposition?.trim() ? (
            <p className="text-xs text-red-400">Please describe what makes your business unique</p>
          ) : <span />}
          <span className={`text-xs ml-auto ${(watchedData.uniqueSellingProposition?.length || 0) > 450 ? 'text-yellow-400' : 'text-[#CBD5E1]/40'}`}>
            {watchedData.uniqueSellingProposition?.length || 0}/500
          </span>
        </div>
      </div>

      {/* Has Logo — moved from old Platforms step */}
      <div className="pt-2">
        <label className="block text-sm font-medium text-[#F9FAFB] mb-3">
          Brand Assets
        </label>
        <label className="flex items-center gap-3 p-4 bg-[#1F2933] border border-[#1F2933] rounded-lg cursor-pointer hover:border-[#22C55E]/30 transition-all">
          <input
            type="checkbox"
            {...register('hasLogo')}
            className="w-4 h-4 text-[#22C55E] bg-[#1F2933] border-[#CBD5E1]/30 rounded focus:ring-[#22C55E] focus:ring-2"
          />
          <div>
            <span className="text-[#F9FAFB] text-sm font-medium">I already have a business logo</span>
            <p className="text-xs text-[#CBD5E1]/60 mt-0.5">This helps us tailor visual content recommendations</p>
          </div>
        </label>
      </div>
    </div>
  );
}