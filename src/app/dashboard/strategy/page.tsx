'use client';

import { useState } from 'react';
import { 
  SparklesIcon, 
  DocumentTextIcon, 
  BoltIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ClockIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function StrategyPage() {
  const router = useRouter();
  const [quickPrompt, setQuickPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quickStrategy, setQuickStrategy] = useState<string | null>(null);

  const handleQuickGenerate = async () => {
    if (!quickPrompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate API call - replace with actual API integration
    setTimeout(() => {
      setQuickStrategy(`Based on your prompt: "${quickPrompt}"\n\nHere's a quick marketing strategy overview:\n\n1. Target Audience Analysis\n2. Key Marketing Channels\n3. Content Strategy\n4. Budget Allocation\n5. Performance Metrics\n\nFor a more detailed and personalized strategy, try our complete form-based method.`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCompleteStrategy = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0B0F14]">
      {/* Hero Section */}
      <div className="border-b border-[#1F2933]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F9FAFB] mb-3 sm:mb-4 tracking-tight">Marketing Strategy Generator</h1>
            <p className="text-[#CBD5E1] text-base sm:text-lg">Choose your approach to get started</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Section 1: Quick Strategy */}
          <div className="group">
            <div className="bg-[#0B0F14] border border-[#1F2933] rounded-2xl overflow-hidden hover:border-[#CBD5E1]/20 transition-colors h-full flex flex-col">
              {/* Header */}
              <div className="p-6 sm:p-8 lg:p-10 border-b border-[#1F2933]">
                <div className="mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#1F2933] mb-4 sm:mb-6">
                    <BoltIcon className="h-5 w-5 text-[#F9FAFB]" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#F9FAFB] mb-2">Quick Strategy</h2>
                  <p className="text-[#CBD5E1] text-xs sm:text-sm">Get instant insights in seconds</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 lg:p-10 flex-1 flex flex-col">
                <div className="mb-8 flex-1">
                  <label htmlFor="prompt" className="block text-sm font-medium text-[#F9FAFB] mb-3">
                    Describe your challenge
                  </label>
                  <textarea
                    id="prompt"
                    rows={8}
                    value={quickPrompt}
                    onChange={(e) => setQuickPrompt(e.target.value)}
                    placeholder="Example: I run a local bakery and want to increase foot traffic and online orders. My budget is $500/month..."
                    className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1F2933] rounded-xl focus:outline-none focus:border-[#CBD5E1]/30 resize-none text-[#F9FAFB] placeholder:text-[#CBD5E1]/50 transition-colors"
                    disabled={isGenerating}
                  />
                </div>

                <button
                  onClick={handleQuickGenerate}
                  disabled={!quickPrompt.trim() || isGenerating}
                  className="w-full bg-[#0F172A] text-white py-3.5 px-6 rounded-lg font-medium hover:bg-[#1E2A78] transition-colors flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Generate Strategy
                    </>
                  )}
                </button>

                {quickStrategy && (
                  <div className="mt-6 p-5 bg-[#0B0F14] rounded-lg border border-[#1F2933]">
                    <h3 className="font-medium text-[#F9FAFB] mb-3 flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 text-[#22C55E]" />
                      Quick Strategy Overview
                    </h3>
                    <p className="text-[#CBD5E1] whitespace-pre-line text-sm leading-relaxed">{quickStrategy}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-[#0B0F14] border-t border-[#1F2933]">
                <p className="text-xs font-medium text-[#CBD5E1] mb-2">BEST FOR</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-[#CBD5E1]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
                    Quick insights
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
                    Brainstorming
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
                    General overview
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
                    Fast results
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Complete Strategy */}
          <div className="group">
            <div className="bg-[#0B0F14] border border-[#1F2933] rounded-2xl overflow-hidden hover:border-[#CBD5E1]/20 transition-colors h-full flex flex-col">
              {/* Header */}
              <div className="p-6 sm:p-8 lg:p-10 border-b border-[#1F2933]">
                <div className="mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#22C55E]/10 mb-4 sm:mb-6">
                    <ChartBarIcon className="h-5 w-5 text-[#22C55E]" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#F9FAFB] mb-2">Complete Strategy</h2>
                  <p className="text-[#CBD5E1] text-xs sm:text-sm">Comprehensive marketing plan</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 lg:p-10 flex-1 flex flex-col">
                <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10 flex-1">
                  <div>
                    <h3 className="font-medium text-[#F9FAFB] mb-2">Detailed Form-Based Analysis</h3>
                    <p className="text-[#CBD5E1] text-sm leading-relaxed">Comprehensive questions about your business, target audience, and goals</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-[#F9FAFB] mb-2">Trend Analysis Integration</h3>
                    <p className="text-[#CBD5E1] text-sm leading-relaxed">Real-time market trends, competitor insights, and industry data</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-[#F9FAFB] mb-2">AI-Powered Personalization</h3>
                    <p className="text-[#CBD5E1] text-sm leading-relaxed">Custom strategies with specific tactics, timelines, and budget allocation</p>
                  </div>
                </div>

                <button
                  onClick={handleCompleteStrategy}
                  className="w-full bg-[#22C55E] text-[#0B0F14] py-4 px-6 rounded-xl font-medium hover:bg-[#16A34A] transition-colors"
                >
                  Start Complete Form
                </button>

                <div className="mt-6 flex items-center gap-2 text-sm text-[#CBD5E1]">
                  <ClockIcon className="h-4 w-4" />
                  <span>5-10 minutes to complete</span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 border-t border-[#1F2933]">
                <div className="flex flex-wrap gap-3 text-xs text-[#CBD5E1]">
                  <span>Full plans</span>
                  <span>•</span>
                  <span>Budget allocation</span>
                  <span>•</span>
                  <span>Platform selection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
