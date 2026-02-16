'use client';

import { 
  EllipsisVerticalIcon, 
  ArrowPathIcon,
  TrashIcon,
  BookmarkIcon 
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ChatHeaderProps {
  onNewChat?: () => void;
  onClearHistory?: () => void;
}

export default function ChatHeader({ onNewChat, onClearHistory }: ChatHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="border-b border-[#1F2933] bg-[#0B0F14] px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
            AI Smart Chatbot
          </h1>
          <p className="text-sm text-white mt-1 opacity-70">
            Your intelligent marketing assistant
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="px-4 py-2 bg-[#1F2933] text-white rounded-lg text-sm font-medium hover:bg-[#2D3748] transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            New Chat
          </button>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1F2933] text-white hover:bg-[#2D3748] transition-colors"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-[#1F2933] rounded-lg shadow-xl border border-[#2D3748] py-2 z-20">
                  <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2D3748] transition-colors flex items-center gap-3">
                    <BookmarkIcon className="w-4 h-4" />
                    Save Conversation
                  </button>
                  <button
                    onClick={() => {
                      onClearHistory?.();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2D3748] hover:text-red-400 transition-colors flex items-center gap-3"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Clear History
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
