'use client';

import { useState } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import ChatMenuPanel from './components/ChatMenuPanel';
import { useChatbot } from './hooks/useChatbot';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ChatSessionSummary } from './services/sessionService';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function groupByDate(sessions: ChatSessionSummary[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const weekStart = new Date(todayStart.getTime() - 6 * 86400000);
  const groups: { label: string; items: ChatSessionSummary[] }[] = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'This week', items: [] },
    { label: 'Older', items: [] },
  ];
  sessions.forEach((s) => {
    const d = new Date(s.updatedAt);
    if (d >= todayStart) groups[0].items.push(s);
    else if (d >= yesterdayStart) groups[1].items.push(s);
    else if (d >= weekStart) groups[2].items.push(s);
    else groups[3].items.push(s);
  });
  return groups.filter((g) => g.items.length > 0);
}

const TAG_COLORS: Record<string, string> = {
  pricing:    'bg-yellow-500/20 text-yellow-300',
  returns:    'bg-red-500/20 text-red-300',
  inventory:  'bg-blue-500/20 text-blue-300',
  marketing:  'bg-purple-500/20 text-purple-300',
  support:    'bg-orange-500/20 text-orange-300',
  onboarding: 'bg-teal-500/20 text-teal-300',
};
function tagColor(tag: string | null) {
  if (!tag) return '';
  return TAG_COLORS[tag] || 'bg-[#22C55E]/20 text-[#22C55E]';
}

export default function Chatbot() {
  const {
    messages, isLoading, sendMessage, newChat, clearHistory,
    sessionList, sessionsLoading, activeSessionId, loadSession, deleteSession,
  } = useChatbot();

  const [panelOpen, setPanelOpen] = useState(false);
  const groups = groupByDate(sessionList);

  return (
    <div className="h-full flex bg-[#0B0F14]">

      {/* ── Left: Chat ── */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChatHeader
          onNewChat={newChat}
          onOpenPanel={() => setPanelOpen(true)}
        />
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onPromptSelect={sendMessage}
        />
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />

        {/* Memory & Gaps overlay — only covers the chat pane */}
        <ChatMenuPanel
          isOpen={panelOpen}
          onClose={() => setPanelOpen(false)}
          sessions={sessionList}
          sessionsLoading={sessionsLoading}
          activeSessionId={activeSessionId}
          onNewChat={newChat}
          onSelectSession={loadSession}
          onDeleteSession={deleteSession}
        />
      </div>

      {/* ── Right: Sessions sidebar ── */}
      <div className="hidden lg:flex w-64 xl:w-72 flex-shrink-0 flex-col border-l border-white/[0.04] bg-[#0B0F14]/50">

        {/* History header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.04]">
          <span className="text-[13px] font-semibold text-white/70">History</span>
          <button
            title="New chat"
            onClick={newChat}
            className="flex items-center gap-1 text-[11px] text-[#22C55E]/70 hover:text-[#22C55E] font-medium transition-colors"
          >
            <PlusIcon className="w-3 h-3" />
            New
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto py-1">
          {sessionsLoading && (
            <div className="flex justify-center py-10">
              <div className="w-4 h-4 border-2 border-[#22C55E]/50 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!sessionsLoading && sessionList.length === 0 && (
            <div className="text-center py-14 px-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/15" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <p className="text-[11px] text-white/30">No conversations yet</p>
              <p className="text-[10px] text-white/15 mt-0.5">Start chatting to see history here</p>
            </div>
          )}

          {!sessionsLoading && groups.map((group) => (
            <div key={group.label}>
              <div className="px-4 pt-4 pb-1">
                <span className="text-[9px] font-semibold text-white/20 uppercase tracking-widest">
                  {group.label}
                </span>
              </div>

              {group.items.map((session) => {
                const isActive = session._id === activeSessionId;
                return (
                  <div
                    key={session._id}
                    onClick={() => loadSession(session._id)}
                    className={`group relative mx-2 rounded-lg px-3 py-2.5 cursor-pointer transition-all mb-0.5 ${
                      isActive
                        ? 'bg-white/[0.05] border-l-2 border-[#22C55E]'
                        : 'border-l-2 border-transparent hover:bg-white/[0.02]'
                    }`}
                  >
                    <p className={`text-[12px] font-medium leading-snug line-clamp-1 pr-6 transition-colors ${
                      isActive ? 'text-white/80' : 'text-white/40 group-hover:text-white/60'
                    }`}>
                      {session.title || 'New conversation'}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-white/15">{timeAgo(session.updatedAt)}</span>
                      {session.topicTag && (
                        <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-md font-medium ${tagColor(session.topicTag)}`}>
                          {session.topicTag}
                        </span>
                      )}
                    </div>

                    <button
                      title="Delete session"
                      onClick={(e) => { e.stopPropagation(); deleteSession(session._id); }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/10 text-white/15 hover:text-red-400"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
