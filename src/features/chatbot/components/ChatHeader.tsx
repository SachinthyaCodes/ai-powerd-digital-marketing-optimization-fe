'use client';

import React from 'react';

interface ChatHeaderProps {
  onOpenRecent: () => void;
  isTyping: boolean;
}

export default function ChatHeader({ onOpenRecent, isTyping }: ChatHeaderProps) {
  return (
    <div className="sa-root w-full border-b border-[#1c2028] bg-[#0d0f12] flex-shrink-0">
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between px-4 md:px-6 py-4">
      {/* Left: icon box + title */}
      <div className="flex items-center gap-3">
        {/* Icon box — matches screenshot icon squares */}
        <div className="relative flex-shrink-0">
          <div className="sa-icon-box sa-icon-box-green">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
              <path d="M5 14v2a7 7 0 0 0 14 0v-2"/>
            </svg>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#22C55E] border-[1.5px] border-[#0d0f12] sa-online-dot" />
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

      {/* Right: Recent Chats button */}
      <button
        onClick={onOpenRecent}
        title="Recent chats"
        aria-label="Open recent chats"
        className="sa-subtext flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#13161c] hover:bg-[#1a1d24] border border-[#1c2028] hover:border-[#2a303c] text-[#9CA3AF] hover:text-white text-[12px] font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span className="hidden sm:inline">Recent Chats</span>
      </button>
      </div>
    </div>
  );
}
