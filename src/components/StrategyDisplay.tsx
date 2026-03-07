'use client';

import React from 'react';

interface MarketingPillar {
  name: string;
  goal: string;
}

interface ContentCategory {
  category: string;
  examples: string[];
}

interface BudgetSplit {
  paid_ads: number;
  content_creation: number;
  influencers: number;
  tools: number;
}

interface CopywritingStyle {
  tone: string;
  language_mix: string;
}

interface AdsVsOrganic {
  recommended_ratio: string;
  reason: string;
}

interface MarketingStrategy {
  marketing_pillars: MarketingPillar[];
  content_categories: ContentCategory[];
  platform_strategy: Record<string, string>;
  budget_split: BudgetSplit;
  copywriting_style: CopywritingStyle;
  ads_vs_organic: AdsVsOrganic;
}

interface StrategyDisplayProps {
  strategy: MarketingStrategy;
  metadata?: {
    generation_time_ms: number;
    llm_provider: string;
    model: string;
  };
}

const StrategyDisplay: React.FC<StrategyDisplayProps> = ({ strategy, metadata }) => {
  const formatTone = (tone: string) => {
    return tone.charAt(0).toUpperCase() + tone.slice(1).replace(/-/g, ' ');
  };

  const formatLanguageMix = (mix: string) => {
    return mix
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getPlatformIcon = (platform: string) => {
    return platform.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* Header with Generation Info */}
      {metadata && (
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  AI-Powered Strategy Generated
                </h3>
                <p className="text-xs text-gray-400">
                  Generated in {(metadata.generation_time_ms / 1000).toFixed(1)}s using {metadata.model}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marketing Pillars */}
      <section className="bg-[#111111] border border-gray-800 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Marketing Pillars</h3>
              <p className="text-xs text-gray-400 mt-0.5">Core strategic focus areas for your business</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategy.marketing_pillars.map((pillar, index) => (
              <div key={index} className="bg-black/30 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base mb-2">{pillar.name}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{pillar.goal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Categories */}
      <section className="bg-[#111111] border border-gray-800 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Content Categories</h3>
              <p className="text-xs text-gray-400 mt-0.5">Actionable content ideas for your campaigns</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategy.content_categories.map((category, index) => (
              <div key={index} className="bg-black/30 rounded-xl p-4 border border-gray-800">
                <h4 className="font-semibold text-white mb-3 flex items-center text-sm">
                  <div className="w-6 h-6 bg-green-500/10 rounded flex items-center justify-center mr-2">
                    <span className="text-xs text-green-400">{index + 1}</span>
                  </div>
                  {category.category}
                </h4>
                <ul className="space-y-2">
                  {category.examples.map((example, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Strategy */}
      <section className="bg-[#111111] border border-gray-800 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Platform Strategies</h3>
              <p className="text-xs text-gray-400 mt-0.5">Platform-specific tactics and approaches</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {Object.entries(strategy.platform_strategy).map(([platform, strategyText], index) => (
              <div key={index} className="bg-black/30 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{getPlatformIcon(platform)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-base mb-2">{platform}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{strategyText}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Budget & Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Split */}
        <section className="bg-[#111111] border border-gray-800 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Budget Allocation</h3>
                <p className="text-xs text-gray-400 mt-0.5">How to distribute your marketing budget</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { key: 'paid_ads', label: 'Paid Advertising', color: '#3b82f6', icon: 'PA' },
                { key: 'content_creation', label: 'Content Creation', color: '#10b981', icon: 'CC' },
                { key: 'influencers', label: 'Influencer Collaboration', color: '#a855f7', icon: 'IC' },
                { key: 'tools', label: 'Tools & Software', color: '#f59e0b', icon: 'TS' },
              ].map(({ key, label, color, icon }) => {
                const value = strategy.budget_split[key as keyof BudgetSplit];
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-400 bg-gray-800 rounded px-1.5 py-0.5">{icon}</span>
                        <span className="text-sm font-medium text-gray-300">{label}</span>
                      </div>
                      <span className="text-base font-bold text-white">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${value}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Copywriting & Content Mix */}
        <section className="bg-[#111111] border border-gray-800 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Content Guidelines</h3>
                <p className="text-xs text-gray-400 mt-0.5">Tone, language, and content distribution</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            {/* Copywriting Style */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Copywriting Style</h4>
              <div className="space-y-2.5">
                <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-400">Tone</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-pink-500/10 text-pink-500 border border-pink-500/20">
                      {formatTone(strategy.copywriting_style.tone)}
                    </span>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-400">Language Mix</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      {formatLanguageMix(strategy.copywriting_style.language_mix)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ads vs Organic */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Content Distribution</h4>
              <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-400">Organic vs Paid Ratio</span>
                  <span className="text-lg font-bold text-green-500">
                    {strategy.ads_vs_organic.recommended_ratio}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {strategy.ads_vs_organic.reason}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Download/Print Actions */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">Ready to implement?</h3>
            <p className="text-sm text-gray-400 mt-1">
              Save or share your personalized marketing strategy
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="bg-transparent border border-gray-800 text-gray-400 px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center space-x-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print</span>
            </button>
            <button
              onClick={() => {
                const strategyData = JSON.stringify(strategy, null, 2);
                const blob = new Blob([strategyData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'marketing-strategy.json';
                a.click();
              }}
              className="bg-white text-black px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-all flex items-center space-x-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyDisplay;
