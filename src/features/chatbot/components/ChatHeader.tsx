'use client';

import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import ChatMenuPanel from './ChatMenuPanel';
import { ChatSessionSummary } from '../services/sessionService';

interface ChatHeaderProps {
  onNewChat?: () => void;
  onClearHistory?: () => void;
  // Session props forwarded to the panel
  sessions?: ChatSessionSummary[];
  sessionsLoading?: boolean;
  activeSessionId?: string | null;
  onSelectSession?: (id: string) => void;
  onDeleteSession?: (id: string) => void;
}

export default function ChatHeader({
  onNewChat,
  onClearHistory,
  sessions = [],
  sessionsLoading = false,
  activeSessionId = null,
  onSelectSession,
  onDeleteSession,
}: ChatHeaderProps) {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      <div className="border-b border-[#1F2933] bg-[#0B0F14] px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
              <span className="hidden sm:inline">Smart Chatbot</span>
              <span className="sm:hidden">Assistant</span>
            </h1>
            <p className="text-xs sm:text-sm text-white mt-1 opacity-70">
              Your intelligent marketing assistant
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* New Chat */}
            <button
              onClick={onNewChat}
              className="px-3 sm:px-4 py-2 bg-[#1F2933] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#2D3748] transition-colors flex items-center gap-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            {/* 3-dots — opens the drawer panel */}
            <button
              onClick={() => setPanelOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1F2933] text-white hover:bg-[#2D3748] transition-colors"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-in panel — sessions, memory, gaps */}
      <ChatMenuPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        sessions={sessions}
        sessionsLoading={sessionsLoading}
        activeSessionId={activeSessionId}
        onNewChat={onNewChat ?? (() => {})}
        onSelectSession={onSelectSession ?? (() => {})}
        onDeleteSession={onDeleteSession ?? (() => {})}
      />
    </>
  );
}
