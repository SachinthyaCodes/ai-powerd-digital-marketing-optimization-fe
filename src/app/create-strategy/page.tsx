'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthHeader } from '@/components/AuthHeader';
import Sidebar from '@/components/Sidebar';
import { StepIndicator } from '@/components/StepIndicator';
import { BusinessProfileStep } from '@/components/steps/BusinessProfileStep';
import { BudgetAndGoalsStep } from '@/components/steps/BudgetAndGoalsStep';
import { TargetAudienceStep } from '@/components/steps/TargetAudienceStep';
import { MarketContextStep } from '@/components/steps/MarketContextStep';
import { ReviewStep } from '@/components/steps/ReviewStep';
import { type MarketingStrategyFormData, type StepConfig } from '@/types';
import { generateStrategyStream } from '@/services/strategyApiService';

const DRAFT_KEY = 'strategy_form_draft';

const STEPS: StepConfig[] = [
  {
    id: 'business-profile',
    title: 'Business Profile',
    description: 'Tell us about your business'
  },
  {
    id: 'budget-and-goals',
    title: 'Budget & Goals',
    description: 'Your resources and primary objective'
  },
  {
    id: 'target-audience',
    title: 'Your Customers',
    description: 'Who are you trying to reach?'
  },
  {
    id: 'market-context',
    title: 'Market Context',
    description: 'Challenges, strengths, and seasonal factors'
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: ''
  }
];

// Map step IDs to the camelCase keys used in MarketingStrategyFormData
const STEP_KEY_MAP: Record<string, keyof MarketingStrategyFormData> = {
  'business-profile': 'businessProfile',
  'budget-and-goals': 'budgetAndGoals',
  'target-audience': 'targetAudience',
  'market-context': 'marketContext',
};

function Home() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<MarketingStrategyFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [streamingText, setStreamingText] = useState<string>('');
  const [processingResult] = useState<any>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState<'saving' | 'saved' | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load draft from localStorage on first mount ──────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.formData && Object.keys(parsed.formData).length > 0) {
          setFormData(parsed.formData);
          if (typeof parsed.stepIndex === 'number') {
            setCurrentStepIndex(Math.min(parsed.stepIndex, STEPS.length - 2)); // don't restore review step
          }
          setDraftRestored(true);
          // Auto-hide the banner after 5 seconds
          setTimeout(() => setDraftRestored(false), 5000);
        }
      }
    } catch {
      // Corrupt draft — ignore silently
    }
  }, []);

  // ── Debounced draft saver ─────────────────────────────────────────────
  const saveDraft = useCallback((data: Partial<MarketingStrategyFormData>, stepIndex: number) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSaveIndicator('saving');
    debounceTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ formData: data, stepIndex }));
        setSaveIndicator('saved');
        setTimeout(() => setSaveIndicator(null), 2000);
      } catch {
        setSaveIndicator(null);
      }
    }, 600);
  }, []);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData({});
    setCurrentStepIndex(0);
    setDraftRestored(false);
  };

  const currentStep = STEPS[currentStepIndex];

  const validateCurrentStep = (): boolean => {
    const key = STEP_KEY_MAP[currentStep.id];
    if (!key) return true; // review step
    const d = formData[key] as any;
    if (!d) return false;

    switch (currentStep.id) {
      case 'business-profile':
        return !!(
          d.businessType &&
          d.businessSize &&
          d.businessStage &&
          d.location?.city &&
          d.productsServices?.trim() &&
          d.uniqueSellingProposition?.trim()
        );
      case 'budget-and-goals':
        return !!(
          d.monthlyBudget &&
          d.hasMarketingTeam &&
          d.contentCreationCapacity?.length > 0 &&
          d.primaryGoal
        );
      case 'target-audience':
        return !!(
          d.demographics?.ageRange &&
          d.demographics?.incomeLevel &&
          d.location?.trim() &&
          d.interests?.length > 0 &&
          d.buyingFrequency
        );
      case 'market-context':
        return !!(d.challenges?.length > 0 && d.strengths?.length > 0);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (currentStepIndex < STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      saveDraft(formData, nextIndex);
    }
  };

  const handlePrevious = () => {
    setShowErrors(false);
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      saveDraft(formData, prevIndex);
    }
  };

  const handleStepDataUpdate = (stepData: any) => {
    const key = STEP_KEY_MAP[currentStep.id];
    if (key) {
      setFormData(prev => {
        const updated = { ...prev, [key]: stepData };
        saveDraft(updated, currentStepIndex);
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setProcessingStatus('Checking your answers...');
    setStreamingText('');

    try {
      await generateStrategyStream(
        formData,
        (msg) => setProcessingStatus(msg),
        (chunk) => setStreamingText((prev) => prev + chunk),
      );

      // Clear the draft on success so the form starts fresh next time
      localStorage.removeItem(DRAFT_KEY);

      setProcessingStatus('Your strategy is ready! Taking you there now...');
      setTimeout(() => {
        router.push('/dashboard/strategy/view');
      }, 1200);
    } catch (error) {
      console.error('Strategy generation failed:', error);
      setProcessingStatus(
        `Something went wrong: ${error instanceof Error ? error.message : 'Please try again'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    const key = STEP_KEY_MAP[currentStep.id];
    const stepProps = {
      data: (key ? formData[key] : {}) as any || {},
      onDataUpdate: handleStepDataUpdate,
      showErrors,
    };

    switch (currentStep.id) {
      case 'business-profile':
        return <BusinessProfileStep {...stepProps} />;
      case 'budget-and-goals':
        return <BudgetAndGoalsStep {...stepProps} />;
      case 'target-audience':
        return <TargetAudienceStep {...stepProps} />;
      case 'market-context':
        return <MarketContextStep {...stepProps} />;
      case 'review':
        return (
          <ReviewStep
            data={formData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            processingStatus={processingStatus}
            processingResult={processingResult}
            streamingText={streamingText}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0F14]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#0B0F14]">
        <div className="min-h-screen">

          {/* Header */}
          <header className="border-b border-[#1F2933] bg-[#0B0F14] relative">
            <div className="max-w-4xl mx-auto px-8 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-[#F9FAFB] mb-1">Tell Us About Your Business</h1>
                  <p className="text-[#CBD5E1] text-sm">
                    Answer a few questions and our AI will build a data-driven marketing plan for you
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Auto-save indicator */}
                  {saveIndicator === 'saving' && (
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-pulse" />
                      <span>Saving draft…</span>
                    </div>
                  )}
                  {saveIndicator === 'saved' && (
                    <div className="flex items-center gap-1.5 text-xs text-[#22C55E]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <span>Draft saved</span>
                    </div>
                  )}
                  <span className="text-sm text-[#CBD5E1] tabular-nums">
                    Step <span className="text-[#F9FAFB] font-medium">{currentStepIndex + 1}</span> of {STEPS.length}
                  </span>
                  <a
                    href="/dashboard"
                    className="px-6 py-2.5 bg-[#22C55E] text-[#0B0F14] rounded-lg hover:bg-[#16A34A] transition-colors font-medium text-sm"
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>
            </div>

            {/* Draft restored banner */}
            {draftRestored && (
              <div className="max-w-4xl mx-auto px-8 pb-4">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-[#22C55E]">↩</span>
                    <p className="text-sm text-[#22C55E] font-medium">Draft restored — your previous progress has been loaded.</p>
                  </div>
                  <button
                    onClick={clearDraft}
                    className="text-xs text-[#64748B] hover:text-[#CBD5E1] transition-colors underline underline-offset-2"
                  >
                    Clear &amp; start fresh
                  </button>
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F2933]">
              <div
                className="h-full bg-[#22C55E] transition-all duration-500 ease-out"
                style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </header>

          {/* Step Indicator */}
          <div className="max-w-4xl mx-auto px-8 py-12">
            <StepIndicator
              steps={STEPS}
              currentStepIndex={currentStepIndex}
              onStepClick={setCurrentStepIndex}
            />
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-8 pb-20">
            <div className="bg-[#0B0F14] border border-[#1F2933] rounded-2xl p-10">
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-[#F9FAFB] mb-2">
                  {currentStep.title}
                </h2>
                {currentStep.description && (
                  <p className="text-[#CBD5E1] text-sm">{currentStep.description}</p>
                )}
              </div>

              {renderCurrentStep()}

              {/* Navigation Buttons */}
              {currentStep.id !== 'review' && (
                <div className="mt-12 pt-8 border-t border-[#1F2933]">
                  {showErrors && (
                    <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      <p className="text-sm text-red-400">Please complete all required fields before continuing</p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevious}
                      disabled={currentStepIndex === 0}
                      className="px-6 py-3 bg-[#0B0F14] text-[#F9FAFB] rounded-lg border border-[#1F2933] hover:border-[#CBD5E1]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 bg-[#22C55E] text-[#0B0F14] rounded-lg font-medium hover:bg-[#16A34A] transition-all"
                    >
                      {currentStepIndex === STEPS.length - 2 ? 'Review' : 'Next →'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <AuthHeader />
      <Home />
    </ProtectedRoute>
  );
}
