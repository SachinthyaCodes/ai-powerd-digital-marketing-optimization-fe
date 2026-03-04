'use client';

import { PlusIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface ChatHeaderProps {
  onNewChat?: () => void;
  onOpenPanel?: () => void;
}

export default function ChatHeader({ onNewChat, onOpenPanel }: ChatHeaderProps) {
  return (
    <div className="flex-shrink-0 bg-[#0D1117] border-b border-white/[0.06] px-5 py-3.5">
      <div className="flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-lg shadow-[#22C55E]/20">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
              </svg>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22C55E] rounded-full border-2 border-[#0D1117]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-tight">Smart Assistant</h1>
            <p className="text-[10px] text-[#22C55E] font-medium">Online</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.07] hover:border-white/[0.12] text-white text-xs font-medium transition-all"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          <button
            onClick={onOpenPanel}
            aria-label="Assistant menu"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.07] hover:border-white/[0.12] text-white transition-all"
          >
            <Bars3Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
