'use client';

import { useState } from 'react';
import StrategyDisplay from '@/components/StrategyDisplay';

// Mock strategy data for demonstration
const mockStrategy = {
  marketing_pillars: [
    {
      name: "Community Coffee Culture",
      goal: "Increase weekday foot traffic by 40% through morning commuter targeting"
    },
    {
      name: "Sustainability Storytelling",
      goal: "Build brand awareness around eco-friendly sourcing to attract conscious consumers"
    }
  ],
  content_categories: [
    {
      category: "Behind-the-Scenes",
      examples: [
        "Coffee roasting process videos",
        "Meet the local farmers series",
        "Sustainable packaging showcase"
      ]
    },
    {
      category: "Seasonal Specials",
      examples: [
        "Rainy day combo deals",
        "Weekend brunch menu highlights",
        "Limited-time festival specials"
      ]
    },
    {
      category: "Customer Stories",
      examples: [
        "Regular customer spotlights",
        "Community meetup highlights",
        "Customer recipe creations"
      ]
    }
  ],
  platform_strategy: {
    "Instagram": "Visual-first strategy with daily Stories showcasing fresh brews, Reels for behind-the-scenes content (roasting process, latte art), and feed posts highlighting sustainability initiatives. Use location tags to attract nearby customers.",
    "Facebook": "Community building through event announcements (weekend tastings, coffee workshops), sharing customer reviews, and running local partnership campaigns. Post longer-form content about sourcing stories and eco-initiatives.",
    "WhatsApp Business": "Direct customer engagement with exclusive weekday morning deals sent via broadcast lists, quick response to reservation inquiries, and personalized loyalty rewards for regulars."
  },
  budget_split: {
    paid_ads: 27,
    content_creation: 43,
    influencers: 15,
    tools: 15
  },
  copywriting_style: {
    tone: "friendly",
    language_mix: "mixed_english_primary"
  },
  ads_vs_organic: {
    recommended_ratio: "70:30",
    reason: "Small budget requires organic growth foundation with targeted paid boosts for weekday promotions and new customer acquisition campaigns"
  }
};

const mockMetadata = {
  generation_time_ms: 10500,
  llm_provider: "azure",
  model: "gpt-4"
};

export default function StrategyDemoPage() {
  const [showStrategy, setShowStrategy] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F14]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-[#0B0F14] border-b border-[#1F2933]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Strategy Generator Demo</h1>
          <p className="text-[#0B0F14]/80 text-sm sm:text-base">
            See what your personalized marketing strategy looks like
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!showStrategy ? (
          <div className="text-center py-8 sm:py-16">
            <div className="bg-[#0B0F14] border border-[#1F2933] rounded-lg shadow-lg p-8 sm:p-12 max-w-2xl mx-auto">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎯</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] mb-4">
                Ready to See Your Strategy?
              </h2>
              <p className="text-[#CBD5E1] mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
                This demo shows what your AI-generated marketing strategy will look like.
                It includes marketing pillars, content ideas, platform strategies, and budget allocation.
              </p>
              <button
                onClick={() => setShowStrategy(true)}
                className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-[#0B0F14] px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:from-[#16A34A] hover:to-[#15803D] transition-all transform hover:scale-105 text-base sm:text-lg font-semibold shadow-lg w-full sm:w-auto"
              >
                Generate Demo Strategy
              </button>
              <div className="mt-6 text-sm text-gray-500">
                <p>This is a demo using sample data</p>
                <p>Real strategy generation happens after form submission</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Personalized Marketing Strategy
                  </h2>
                  <p className="text-gray-600 mt-1">
                    AI-powered recommendations tailored for your business
                  </p>
                </div>
                <button
                  onClick={() => setShowStrategy(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset Demo
                </button>
              </div>
            </div>

            <StrategyDisplay strategy={mockStrategy} metadata={mockMetadata} />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                How to Get Your Real Strategy
              </h3>
              <ol className="text-blue-800 space-y-2">
                <li>1. Fill out the 8-step marketing strategy form</li>
                <li>2. Submit your business information</li>
                <li>3. Our AI analyzes your profile + market trends</li>
                <li>4. Receive your personalized strategy in 10-15 seconds</li>
              </ol>
              <div className="mt-4">
                <a
                  href="/"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Marketing Strategy Form →
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
