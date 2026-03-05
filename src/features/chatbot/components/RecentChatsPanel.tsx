'use client';

import React, { useEffect } from 'react';
import type { ChatSessionSummary } from '../types';
import RecentChatItem from './RecentChatItem';

interface RecentChatsPanelProps {
  open: boolean;
  sessions: ChatSessionSummary[];
  activeSessionId: string | null;
  loading: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

export default function RecentChatsPanel({
  open,
  sessions,
  activeSessionId,
  loading,
  onClose,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: RecentChatsPanelProps) {
  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-label="Recent chats"
      className={`sa-root sa-history-panel absolute top-0 right-0 h-full w-[280px] min-w-[280px] max-w-[280px] z-30 flex flex-col transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
    >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#1c2028] flex-shrink-0">
          <h2 className="sa-heading text-white text-[14px]">Recent Chats</h2>
          <button
            type="button"
            aria-label="Close recent chats"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#4B5563] hover:text-white hover:bg-[#1c2028] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* New chat button — matches green CTA from screenshot */}
        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          <button
            type="button"
            onClick={onNewChat}
            className="sa-subtext w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16a34a] text-[#0d0f12] text-[13px] font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Chat
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto sa-chat-scroll px-3 pb-4 space-y-2">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 rounded-full border-2 border-[#22C55E] border-t-transparent animate-spin" />
            </div>
          )}

          {!loading && sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2a303c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p className="sa-heading text-[12px] text-[#6B7280]">No conversations yet</p>
              <p className="sa-subtext text-[11px] text-[#4B5563]">Start chatting to see your history here.</p>
            </div>
          )}

          {!loading &&
            sessions.map((s) => (
              <RecentChatItem
                key={s._id}
                session={s}
                isActive={s._id === activeSessionId}
                onSelect={(id) => { onSelectSession(id); onClose(); }}
                onDelete={onDeleteSession}
              />
            ))}
        </div>
    </div>
  );
}
