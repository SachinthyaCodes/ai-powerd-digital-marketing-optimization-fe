'use client';

import { useState } from 'react';
import { ChatSessionSummary } from '../services/sessionService';
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TagIcon,
  SparklesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface SessionsTopBarProps {
  sessions: ChatSessionSummary[];
  activeSessionId: string | null;
  isLoading: boolean;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

function timeAgo(dateStr: string) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const TAG_COLORS: Record<string, string> = {
  pricing:    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  returns:    'bg-red-500/20 text-red-300 border-red-500/30',
  inventory:  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  marketing:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  support:    'bg-orange-500/20 text-orange-300 border-orange-500/30',
  onboarding: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  general:    'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

function tagColor(tag: string | null) {
  if (!tag) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  return TAG_COLORS[tag] || 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30';
}

export default function SessionsTopBar({
  sessions,
  activeSessionId,
  isLoading,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: SessionsTopBarProps) {
  const [expanded, setExpanded] = useState(false);

  const activeSession = sessions.find((s) => s._id === activeSessionId);

  return (
    <div className="border-b border-[#1F2933] bg-[#0D1318] flex-shrink-0">
      {/* Collapsed strip — always visible */}
      <div className="flex items-center gap-2 px-4 py-2">
        {/* History toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1F2933] hover:bg-[#2D3748] text-gray-400 hover:text-white transition-colors text-xs font-medium flex-shrink-0"
        >
          <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
          <span>History</span>
          <span className="bg-[#22C55E]/20 text-[#22C55E] text-[10px] px-1.5 rounded-full font-semibold">
            {sessions.length}
          </span>
          {expanded
            ? <ChevronUpIcon className="w-3 h-3" />
            : <ChevronDownIcon className="w-3 h-3" />}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-[#1F2933] flex-shrink-0" />

        {/* Scrollable session chips */}
        <div className="flex-1 overflow-x-auto scrollbar-hide flex items-center gap-1.5 min-w-0">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}

          {!isLoading && sessions.length === 0 && (
            <span className="text-xs text-gray-600 italic">No past conversations</span>
          )}

          {sessions.slice(0, 12).map((session) => {
            const isActive = session._id === activeSessionId;
            return (
              <button
                key={session._id}
                onClick={() => onSelectSession(session._id)}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-all flex-shrink-0 border ${
                  isActive
                    ? 'bg-[#22C55E]/15 border-[#22C55E]/50 text-white'
                    : 'bg-[#1F2933] border-[#2D3748] text-gray-400 hover:text-white hover:border-[#3D4E60]'
                }`}
              >
                {session.insightsGenerated && (
                  <SparklesIcon className="w-3 h-3 text-[#22C55E]/70 flex-shrink-0" />
                )}
                <span className="max-w-[150px] truncate">
                  {session.title || 'New conversation'}
                </span>
                {session.topicTag && (
                  <span className={`hidden sm:inline text-[9px] px-1 py-0.5 rounded border ${tagColor(session.topicTag)}`}>
                    {session.topicTag}
                  </span>
                )}
                {/* Delete on hover */}
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); onDeleteSession(session._id); }}
                  className="hidden group-hover:flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-red-500/30 text-gray-500 hover:text-red-400 flex-shrink-0 transition-colors"
                >
                  ×
                </span>
              </button>
            );
          })}

          {sessions.length > 12 && (
            <span className="text-xs text-gray-600 flex-shrink-0">+{sessions.length - 12} more</span>
          )}
        </div>

        {/* New Chat button */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-black text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* Expanded panel — full session cards */}
      {expanded && (
        <div className="border-t border-[#1F2933] px-4 py-3 max-h-64 overflow-y-auto">
          {sessions.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-4">No past conversations yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {sessions.map((session) => {
                const isActive = session._id === activeSessionId;
                return (
                  <div
                    key={session._id}
                    onClick={() => { onSelectSession(session._id); setExpanded(false); }}
                    className={`group relative rounded-lg p-3 cursor-pointer transition-all border ${
                      isActive
                        ? 'bg-[#1F2933] border-[#22C55E]/40'
                        : 'bg-[#0B0F14] border-[#1F2933] hover:border-[#2D3748] hover:bg-[#131920]'
                    }`}
                  >
                    {/* Title */}
                    <p className="text-xs font-medium text-white line-clamp-2 pr-5 leading-tight">
                      {session.title || 'New conversation'}
                    </p>

                    {/* Summary */}
                    {session.summary && (
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-tight">
                        {session.summary}
                      </p>
                    )}

                    {/* Footer: tag + time */}
                    <div className="mt-2 flex items-center gap-1.5">
                      {session.topicTag && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${tagColor(session.topicTag)}`}>
                          {session.topicTag}
                        </span>
                      )}
                      <div className="flex items-center gap-0.5 ml-auto">
                        <ClockIcon className="w-2.5 h-2.5 text-gray-600" />
                        <span className="text-[9px] text-gray-600">{timeAgo(session.updatedAt)}</span>
                      </div>
                      {session.insightsGenerated && (
                        <SparklesIcon className="w-2.5 h-2.5 text-[#22C55E]/50" title="AI insights ready" />
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      title="Delete session"
                      onClick={(e) => { e.stopPropagation(); onDeleteSession(session._id); }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
