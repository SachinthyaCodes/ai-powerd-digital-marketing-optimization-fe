'use client';

import React from 'react';

interface ChatHeaderProps {
  onOpenRecent: () => void;
  isTyping: boolean;
}

export default function ChatHeader({ onOpenRecent, isTyping }: ChatHeaderProps) {
  return (
    <div className="sa-root w-full border-b border-[#1c2028]/60 bg-transparent flex-shrink-0">
      <div className="w-full flex items-center justify-between px-4 md:px-6 py-4">
      {/* Left: icon box + title */}
      <div className="flex items-center gap-3">
        {/* Icon box */}
        <div className="relative flex-shrink-0">
          <div className="sa-icon-box sa-icon-box-green">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
              <path d="M5 14v2a7 7 0 0 0 14 0v-2"/>
            </svg>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#22C55E] border-[1.5px] border-[#0B1120] sa-online-dot" />
        </div>

        {/* Title */}
        <div>
          <h1 className="sa-heading text-white text-[15px] leading-tight">
            Smart Assistant
          </h1>
          <p className="sa-subtext text-[11px] text-[#22C55E] flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] inline-block" />
            {isTyping ? 'Thinking…' : 'Online'}
          </p>
        </div>
      </div>

      {/* Right: History pill button */}
      <button
        onClick={onOpenRecent}
        title="Chat history"
        aria-label="Open recent chats"
        className="sa-subtext flex items-center gap-2 px-4 py-2 rounded-full bg-[#111c14]/70 hover:bg-[#22C55E]/10 border border-[#22C55E]/20 hover:border-[#22C55E]/50 text-[#9CA3AF] hover:text-[#22C55E] text-[12px] font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]/60 flex-shrink-0" />
        <span>History</span>
      </button>
      </div>
    </div>
  );
}
