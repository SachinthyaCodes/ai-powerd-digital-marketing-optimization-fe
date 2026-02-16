'use client';

import {
  SparklesIcon,
  ChartBarIcon,
  MegaphoneIcon,
  LightBulbIcon,
  UserGroupIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  {
    id: 1,
    text: 'What are the best marketing strategies for my business?',
    icon: SparklesIcon,
    category: 'Strategy',
  },
  {
    id: 2,
    text: 'How can I improve my social media engagement?',
    icon: UserGroupIcon,
    category: 'Social Media',
  },
  {
    id: 3,
    text: 'Create a content calendar for next month',
    icon: CalendarIcon,
    category: 'Content',
  },
  {
    id: 4,
    text: 'Analyze my target audience demographics',
    icon: ChartBarIcon,
    category: 'Analytics',
  },
  {
    id: 5,
    text: 'Generate campaign ideas for product launch',
    icon: MegaphoneIcon,
    category: 'Campaigns',
  },
  {
    id: 6,
    text: 'Suggest ways to increase conversion rates',
    icon: LightBulbIcon,
    category: 'Optimization',
  },
];

export default function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => onSelectPrompt(prompt.text)}
          className="group flex items-center gap-3 px-4 py-3 bg-[#1A1F2E] text-white rounded-lg text-left hover:bg-[#252B3B] border border-[#2D3748] hover:border-[#22C55E]/60 transition-all duration-200"
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#0F1419] group-hover:bg-[#22C55E]/10 flex items-center justify-center transition-colors">
            <prompt.icon className="w-4 h-4 text-white group-hover:text-[#22C55E] transition-colors opacity-70 group-hover:opacity-100" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-snug text-white transition-colors">{prompt.text}</p>
            <span className="text-xs text-white group-hover:text-[#22C55E] mt-1 inline-block font-medium transition-colors opacity-60 group-hover:opacity-100">
              {prompt.category}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
