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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full max-w-2xl">
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => onSelectPrompt(prompt.text)}
          className="group flex items-start gap-3 px-4 py-3 bg-white/[0.02] rounded-xl text-left hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200"
        >
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 transition-colors ${prompt.bgColor}`}>
            <prompt.icon className={`w-4 h-4 transition-colors ${prompt.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] leading-snug text-white/60 group-hover:text-white/85 transition-colors">{prompt.text}</p>
            <span className={`text-[11px] mt-1 inline-block font-semibold transition-colors ${prompt.badgeColor}`}>
              {prompt.category}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
