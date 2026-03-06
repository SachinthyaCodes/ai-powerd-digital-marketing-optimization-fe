import { Check } from 'lucide-react';
import { type StepConfig } from '@/types';

interface StepIndicatorProps {
  steps: StepConfig[];
  currentStepIndex: number;
  onStepClick: (stepIndex: number) => void;
}

export function StepIndicator({ steps, currentStepIndex, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      <ol className="flex items-center justify-start sm:justify-between gap-3 sm:gap-0 max-w-4xl mx-auto min-w-max sm:min-w-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isClickable = index <= currentStepIndex;

          return (
            <li key={step.id} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200
                    ${
                      isCompleted
                        ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]'
                        : isActive
                        ? 'bg-[#22C55E] text-[#0B0F14]'
                        : 'bg-[#1F2933] text-[#CBD5E1] border border-[#1F2933]'
                    }
                    ${
                      isClickable
                        ? 'hover:scale-105 cursor-pointer'
                        : 'cursor-not-allowed opacity-40'
                    }
                  `}
                  title={step.title}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                
                <p className={`mt-2 sm:mt-3 text-[10px] sm:text-xs font-medium text-center max-w-16 sm:max-w-20 leading-tight hidden sm:block ${
                  isActive ? 'text-[#F9FAFB]' : 
                  isCompleted ? 'text-[#22C55E]' : 'text-[#CBD5E1]/60'
                }`}>
                  {step.title}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`h-px w-8 sm:w-12 mx-2 sm:mx-3 mt-[-20px] sm:mt-[-28px] ${
                  isCompleted ? 'bg-[#22C55E]/40' : 'bg-[#1F2933]'
                }`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}