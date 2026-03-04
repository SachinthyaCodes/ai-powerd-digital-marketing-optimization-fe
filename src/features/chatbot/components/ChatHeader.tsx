'use client';

import { EllipsisVerticalIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ChatHeaderProps {
  onNewChat?: () => void;
  onOpenPanel?: () => void;
}

export default function ChatHeader({ onNewChat, onOpenPanel }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 bg-[#0B0F14]/80 backdrop-blur-md border-b border-white/[0.04]">
      {/* Left — title */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#22C55E]" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </div>
        <div>
          <h1 className="text-[13px] font-semibold text-white/90 leading-none">Smart Chatbot</h1>
          <span className="text-[10px] text-[#22C55E]/70 font-medium">Online</span>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onNewChat}
          title="New chat"
          className="h-8 px-3 flex items-center gap-1.5 rounded-lg text-[11px] font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.06] transition-all"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>
        <button
          onClick={onOpenPanel}
          title="Memory & Gaps"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all"
        >
          <EllipsisVerticalIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
