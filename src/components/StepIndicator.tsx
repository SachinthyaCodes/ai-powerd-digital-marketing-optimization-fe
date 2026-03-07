import { Fragment } from 'react';
import { Check } from 'lucide-react';
import { type StepConfig } from '@/types';

interface StepIndicatorProps {
  steps: StepConfig[];
  currentStepIndex: number;
  onStepClick: (stepIndex: number) => void;
}

export function StepIndicator({ steps, currentStepIndex, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="max-w-4xl mx-auto">
      {/* Row 1: circles with lines between them as flex items — no overlap possible */}
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isClickable = index <= currentStepIndex;

          return (
            <Fragment key={step.id}>
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`
                  flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200
                  ${isCompleted
                    ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]'
                    : isActive
                    ? 'bg-[#22C55E] text-[#0B0F14]'
                    : 'bg-[#1F2933] text-[#CBD5E1] border border-[#1F2933]'}
                  ${isClickable ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-40'}
                `}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
              </button>

              {index < steps.length - 1 && (
                <div className={`flex-1 h-px ${isCompleted ? 'bg-[#22C55E]/40' : 'bg-[#374151]'}`} />
              )}
            </Fragment>
          );
        })}
      </div>

      {/* Row 2: labels centered under each circle using matching flex spacers */}
      <div className="flex items-start mt-3">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <Fragment key={step.id}>
              <div className="flex-shrink-0 w-10 flex justify-center">
                <p className={`text-xs font-medium text-center w-16 leading-tight ${
                  isActive ? 'text-[#F9FAFB]' :
                  isCompleted ? 'text-[#22C55E]' : 'text-[#CBD5E1]/60'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && <div className="flex-1" />}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}