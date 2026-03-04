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
    iconColor: 'text-[#22C55E]',
    bgColor: 'bg-[#22C55E]/10 group-hover:bg-[#22C55E]/20',
    badgeColor: 'text-[#22C55E]',
  },
  {
    id: 2,
    text: 'How can I improve my social media engagement?',
    icon: UserGroupIcon,
    category: 'Social Media',
    iconColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10 group-hover:bg-purple-500/20',
    badgeColor: 'text-purple-400',
  },
  {
    id: 3,
    text: 'Create a content calendar for next month',
    icon: CalendarIcon,
    category: 'Content',
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10 group-hover:bg-blue-500/20',
    badgeColor: 'text-blue-400',
  },
  {
    id: 4,
    text: 'Analyze my target audience demographics',
    icon: ChartBarIcon,
    category: 'Analytics',
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    badgeColor: 'text-amber-400',
  },
  {
    id: 5,
    text: 'Generate campaign ideas for product launch',
    icon: MegaphoneIcon,
    category: 'Campaigns',
    iconColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10 group-hover:bg-rose-500/20',
    badgeColor: 'text-rose-400',
  },
  {
    id: 6,
    text: 'Suggest ways to increase conversion rates',
    icon: LightBulbIcon,
    category: 'Optimization',
    iconColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 group-hover:bg-yellow-500/20',
    badgeColor: 'text-yellow-400',
  },
];

export default function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => onSelectPrompt(prompt.text)}
          className="group flex items-center gap-3 px-4 py-3 bg-[#1A1F2E] text-white rounded-lg text-left hover:bg-[#252B3B] border border-[#2D3748] hover:border-[#22C55E]/40 transition-all duration-200"
        >
          <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${prompt.bgColor}`}>
            <prompt.icon className={`w-4 h-4 transition-colors ${prompt.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-snug text-white/90 group-hover:text-white transition-colors">{prompt.text}</p>
            <span className={`text-xs mt-1 inline-block font-medium transition-colors opacity-80 group-hover:opacity-100 ${prompt.badgeColor}`}>
              {prompt.category}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
