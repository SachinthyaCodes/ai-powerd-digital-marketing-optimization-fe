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
    <div className="h-full flex bg-[#0D1117]">

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

      {/* ── Right: Sessions sidebar (desktop only) ── */}
      <div className="hidden lg:flex w-64 xl:w-72 flex-shrink-0 flex-col border-l border-white/[0.06] bg-[#0D1117]">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="text-sm font-semibold text-white">Conversations</span>
          </div>
          <button
            title="New chat"
            onClick={newChat}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.07] text-white text-[11px] font-medium transition-all"
          >
            <PlusIcon className="w-3 h-3" />
            New
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {sessionsLoading && (
            <div className="flex justify-center py-10">
              <div className="w-4 h-4 border-2 border-[#22C55E]/60 border-t-[#22C55E] rounded-full animate-spin" />
            </div>
          )}

          {!sessionsLoading && sessionList.length === 0 && (
            <div className="flex flex-col items-center text-center py-14 px-5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-white/40">No conversations yet</p>
              <p className="text-[11px] text-white/20 mt-1">Start chatting to see history</p>
            </div>
          )}

          {!sessionsLoading && groups.map((group) => (
            <div key={group.label} className="mb-2">
              <div className="px-4 pt-3 pb-1.5">
                <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">
                  {group.label}
                </span>
              </div>

              {group.items.map((session) => {
                const isActive = session._id === activeSessionId;
                return (
                  <div
                    key={session._id}
                    onClick={() => loadSession(session._id)}
                    className={`group relative mx-2 mb-0.5 rounded-xl px-3 py-2.5 cursor-pointer transition-all border ${
                      isActive
                        ? 'bg-[#22C55E]/[0.08] border-[#22C55E]/25 shadow-sm'
                        : 'border-transparent hover:bg-white/[0.04] hover:border-white/[0.06]'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#22C55E] rounded-r-full" />
                    )}

                    <p className={`text-xs font-medium leading-snug line-clamp-1 pr-6 transition-colors ${
                      isActive ? 'text-white' : 'text-white/55 group-hover:text-white/80'
                    }`}>
                      {session.title || 'New conversation'}
                    </p>

                    {session.summary && (
                      <p className="text-[10px] text-white/25 mt-0.5 line-clamp-1">{session.summary}</p>
                    )}

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-white/20">{timeAgo(session.updatedAt)}</span>
                      {session.topicTag && (
                        <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${tagColor(session.topicTag)}`}>
                          {session.topicTag}
                        </span>
                      )}
                    </div>

                    <button
                      title="Delete session"
                      onClick={(e) => { e.stopPropagation(); deleteSession(session._id); }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/15 text-white/20 hover:text-red-400"
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
