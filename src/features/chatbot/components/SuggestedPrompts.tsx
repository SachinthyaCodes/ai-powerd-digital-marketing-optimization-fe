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
    iconClass: 'text-[#22C55E]',
    iconBg: 'bg-[#22C55E]/10 border-[#22C55E]/20',
    badge: 'bg-[#22C55E]/10 text-[#22C55E]',
  },
  {
    id: 2,
    text: 'How can I improve my social media engagement?',
    icon: UserGroupIcon,
    category: 'Social Media',
    iconClass: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    badge: 'bg-violet-500/10 text-violet-400',
  },
  {
    id: 3,
    text: 'Create a content calendar for next month',
    icon: CalendarIcon,
    category: 'Content',
    iconClass: 'text-sky-400',
    iconBg: 'bg-sky-500/10 border-sky-500/20',
    badge: 'bg-sky-500/10 text-sky-400',
  },
  {
    id: 4,
    text: 'Analyze my target audience demographics',
    icon: ChartBarIcon,
    category: 'Analytics',
    iconClass: 'text-orange-400',
    iconBg: 'bg-orange-500/10 border-orange-500/20',
    badge: 'bg-orange-500/10 text-orange-400',
  },
  {
    id: 5,
    text: 'Generate campaign ideas for a product launch',
    icon: MegaphoneIcon,
    category: 'Campaigns',
    iconClass: 'text-rose-400',
    iconBg: 'bg-rose-500/10 border-rose-500/20',
    badge: 'bg-rose-500/10 text-rose-400',
  },
  {
    id: 6,
    text: 'Suggest ways to increase conversion rates',
    icon: LightBulbIcon,
    category: 'Optimization',
    iconClass: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-400',
  },
];

export default function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 w-full max-w-3xl">
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => onSelectPrompt(prompt.text)}
          className="group flex flex-col gap-3 p-4 rounded-xl text-left bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.11] transition-all duration-150 hover:-translate-y-0.5"
        >
          {/* Icon */}
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${prompt.iconBg}`}>
            <prompt.icon className={`w-4 h-4 ${prompt.iconClass}`} />
          </div>

          {/* Text */}
          <div>
            <p className="text-[13px] text-white/60 group-hover:text-white/90 leading-snug transition-colors">
              {prompt.text}
            </p>
            <span className={`inline-block mt-2.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${prompt.badge}`}>
              {prompt.category}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
