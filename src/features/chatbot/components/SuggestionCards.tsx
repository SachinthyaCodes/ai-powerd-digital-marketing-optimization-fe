'use client';

import React from 'react';
import type { Suggestion } from '../types';

const SUGGESTIONS: Suggestion[] = [
  {
    id: 'Strategy',
    label: 'Marketing Strategy',
    icon: '🎯',
    prompt: 'Help me build a comprehensive marketing strategy for my business.',
    color: '',
  },
  {
    id: 'Social Media',
    label: 'Social Media Plan',
    icon: '📱',
    prompt: 'Create a social media content plan for the next 30 days.',
    color: '',
  },
  {
    id: 'Content',
    label: 'Content Ideas',
    icon: '✍️',
    prompt: 'Generate creative content ideas for my target audience.',
    color: '',
  },
  {
    id: 'Analytics',
    label: 'Analyze Performance',
    icon: '📊',
    prompt: 'How can I analyze and improve my marketing performance metrics?',
    color: '',
  },
  {
    id: 'Campaigns',
    label: 'Campaign Setup',
    icon: '🚀',
    prompt: 'Guide me through setting up a successful marketing campaign.',
    color: '',
  },
  {
    id: 'Optimization',
    label: 'Optimize ROI',
    icon: '⚡',
    prompt: 'What strategies can I use to optimize my marketing ROI?',
    color: '',
  },
];

interface SuggestionCardsProps {
  onSelect: (prompt: string) => void;
}

export default function SuggestionCards({ onSelect }: SuggestionCardsProps) {
  return (
    <div className="sa-root relative flex flex-col items-center justify-center h-full px-4 md:px-6 py-8 select-none bg-transparent overflow-hidden">
      {/* Aurora inner blobs */}
      <div className="sa-aurora-wrap" aria-hidden="true">
        <div className="sa-aurora-blob sa-aurora-blob-1" />
        <div className="sa-aurora-blob sa-aurora-blob-2" />
        <div className="sa-aurora-blob sa-aurora-blob-3" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
      {/* Welcome header */}
      <div className="text-center mb-8">
        <div className="sa-icon-box sa-icon-box-green sa-float w-12 h-12 rounded-xl mx-auto mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            <path d="M5 14v2a7 7 0 0 0 14 0v-2"/>
          </svg>
        </div>
        <h2 className="sa-heading text-white text-xl mb-2">
          How can I help you today?
        </h2>
        <p className="sa-subtext text-[#6B7280] text-[13px] max-w-sm">
          Your AI-powered marketing assistant. Choose a topic below or type your own question.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.prompt)}
            aria-label={`Ask about ${s.label}`}
            className="sa-suggestion-card group relative text-left p-4 rounded-xl border border-[#1c2028]/80 bg-[#13161c]/60 hover:border-[#22C55E]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40 backdrop-blur-sm"
          >
            {/* Icon box */}
            <div className="sa-icon-box sa-icon-box-default mb-3">
              <span className="text-base leading-none">{s.icon}</span>
            </div>
            <span className="sa-heading block text-white text-[13px] mb-1">
              {s.label}
            </span>
            <span className="sa-subtext text-[11.5px] text-[#6B7280] leading-snug">
              Get instant insights
            </span>
            {/* Arrow */}
            <span className="absolute top-3.5 right-3.5 text-[#2a303c] group-hover:text-[#22C55E] transition-colors duration-150">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </span>
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
