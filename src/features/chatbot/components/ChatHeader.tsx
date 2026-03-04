'use client';

import { PlusIcon } from '@heroicons/react/24/outline';

interface ChatHeaderProps {
  onNewChat?: () => void;
  onOpenPanel?: () => void;
}

export default function ChatHeader({ onNewChat, onOpenPanel }: ChatHeaderProps) {
  return (
    <div className="flex-shrink-0 h-[54px] bg-[#070B12] border-b border-white/[0.05] px-5 flex items-center justify-between">

      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#22C55E] flex items-center justify-center shadow-md shadow-[#22C55E]/25">
            <svg className="w-4 h-4 text-[#070B12]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
            </svg>
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22C55E] rounded-full border-[2px] border-[#070B12] animate-pulse" />
        </div>
        <div>
          <h1 className="text-[13px] font-semibold text-white leading-none tracking-[-0.01em]">Smart Assistant</h1>
          <p className="text-[10px] text-[#22C55E]/80 font-medium mt-[3px]">● Online</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-medium text-white/45 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all"
        >
          <PlusIcon className="w-3 h-3" />
          New Chat
        </button>

        <button
          onClick={onOpenPanel}
          aria-label="Assistant menu"
          className="h-8 w-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
