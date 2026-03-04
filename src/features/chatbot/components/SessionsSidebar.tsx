'use client';

import { ChatSessionSummary } from '../services/sessionService';
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  TrashIcon,
  TagIcon,
  ClockIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface SessionsSidebarProps {
  sessions: ChatSessionSummary[];
  activeSessionId: string | null;
  isLoading: boolean;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const TAG_COLORS: Record<string, string> = {
  pricing:     'bg-yellow-500/20 text-yellow-300',
  returns:     'bg-red-500/20 text-red-300',
  inventory:   'bg-blue-500/20 text-blue-300',
  marketing:   'bg-purple-500/20 text-purple-300',
  support:     'bg-orange-500/20 text-orange-300',
  onboarding:  'bg-teal-500/20 text-teal-300',
  general:     'bg-gray-500/20 text-gray-300',
};

function tagColor(tag: string | null) {
  if (!tag) return 'bg-gray-500/20 text-gray-400';
  return TAG_COLORS[tag] || 'bg-[#22C55E]/20 text-[#22C55E]';
}

export default function SessionsSidebar({
  sessions,
  activeSessionId,
  isLoading,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: SessionsSidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 bg-[#0D1318] border-r border-[#1F2933] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#1F2933]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-4 h-4 text-[#22C55E]" />
            <span className="text-sm font-semibold text-white">Chat History</span>
          </div>
          <span className="text-xs text-gray-500">{sessions.length}</span>
        </div>
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-black text-sm font-semibold rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <SparklesIcon className="w-8 h-8 text-gray-600 mb-2" />
            <p className="text-xs text-gray-500">No conversations yet.<br />Start chatting!</p>
          </div>
        )}

        {sessions.map((session) => {
          const isActive = session._id === activeSessionId;
          return (
            <div
              key={session._id}
              onClick={() => onSelectSession(session._id)}
              className={`group relative rounded-lg p-3 cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#1F2933] border border-[#22C55E]/40'
                  : 'hover:bg-[#1A2028] border border-transparent'
              }`}
            >
              {/* Title */}
              <p className={`text-xs font-medium leading-tight line-clamp-2 pr-6 ${
                isActive ? 'text-white' : 'text-gray-300'
              }`}>
                {session.title || 'New conversation'}
              </p>

              {/* Topic tag */}
              {session.topicTag && (
                <div className="mt-1.5 flex items-center gap-1">
                  <TagIcon className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${tagColor(session.topicTag)}`}>
                    {session.topicTag}
                  </span>
                </div>
              )}

              {/* Timestamp */}
              <div className="mt-1 flex items-center gap-1">
                <ClockIcon className="w-3 h-3 text-gray-600" />
                <span className="text-[10px] text-gray-600">{timeAgo(session.updatedAt)}</span>
                {session.insightsGenerated && (
                  <span title="AI insights generated" className="ml-auto">
                    <SparklesIcon className="w-3 h-3 text-[#22C55E]/60" />
                  </span>
                )}
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session._id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="p-3 border-t border-[#1F2933]">
        <div className="flex items-center gap-2 text-[10px] text-gray-600">
          <SparklesIcon className="w-3 h-3 text-[#22C55E]/50 flex-shrink-0" />
          <span>AI auto-titles &amp; remembers your business after each chat</span>
        </div>
      </div>
    </aside>
  );
}
