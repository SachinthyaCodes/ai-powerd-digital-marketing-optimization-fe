'use client';

import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  SparklesIcon,
  CheckIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { ChatSessionSummary, sessionService, MemoryFact, KnowledgeGap } from '../services/sessionService';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'history' | 'memory' | 'gaps';

interface ChatMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSessionSummary[];
  sessionsLoading: boolean;
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

// ─── helpers ─────────────────────────────────────────────────────────────────
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
};

function tagColor(tag: string | null) {
  if (!tag) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  return TAG_COLORS[tag] || 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30';
}

const CATEGORY_LABELS: Record<string, string> = {
  business_info:      'Business',
  target_audience:    'Audience',
  products_services:  'Products',
  goals:              'Goals',
  challenges:         'Challenges',
  preferences:        'Preferences',
  other:              'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  business_info:      'bg-blue-500/20 text-blue-300',
  target_audience:    'bg-purple-500/20 text-purple-300',
  products_services:  'bg-green-500/20 text-green-300',
  goals:              'bg-yellow-500/20 text-yellow-300',
  challenges:         'bg-red-500/20 text-red-300',
  preferences:        'bg-teal-500/20 text-teal-300',
  other:              'bg-gray-500/20 text-gray-400',
};

// ─── date grouping helper ──────────────────────────────────────────────────
function groupByDate(sessions: ChatSessionSummary[]): { label: string; items: ChatSessionSummary[] }[] {
  const now = Date.now();
  const DAY = 86400000;
  const groups: Record<string, ChatSessionSummary[]> = {};

  sessions.forEach((s) => {
    const diff = now - new Date(s.updatedAt).getTime();
    let label: string;
    if (diff < DAY)              label = 'Today';
    else if (diff < 2 * DAY)     label = 'Yesterday';
    else if (diff < 7 * DAY)     label = 'This Week';
    else                         label = 'Earlier';
    (groups[label] = groups[label] || []).push(s);
  });

  const ORDER = ['Today', 'Yesterday', 'This Week', 'Earlier'];
  return ORDER.filter((l) => groups[l]).map((label) => ({ label, items: groups[label] }));
}

// ─── main panel ──────────────────────────────────────────────────────────────
export default function ChatMenuPanel({
  isOpen,
  onClose,
  sessions,
  sessionsLoading,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: ChatMenuPanelProps) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('history');

  const [memory, setMemory]         = useState<MemoryFact[]>([]);
  const [memoryLoading, setMemLoad] = useState(false);
  const [gaps, setGaps]             = useState<KnowledgeGap[]>([]);
  const [gapsLoading, setGapsLoad]  = useState(false);

  useEffect(() => {
    if (!isOpen || !token) return;
    if (activeTab === 'memory' && memory.length === 0) {
      setMemLoad(true);
      sessionService.getMemory(token).then(setMemory).finally(() => setMemLoad(false));
    }
    if (activeTab === 'gaps' && gaps.length === 0) {
      setGapsLoad(true);
      sessionService.listGaps(token).then(setGaps).finally(() => setGapsLoad(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTab, token]);

  const handleDeleteFact = async (factId: string) => {
    if (!token) return;
    setMemory(await sessionService.deleteMemoryFact(token, factId));
  };

  const handleResolveGap = async (gapId: string) => {
    if (!token) return;
    await sessionService.resolveGap(token, gapId);
    setGaps((prev) => prev.filter((g) => g._id !== gapId));
  };

  const grouped = groupByDate(sessions);

  return (
    <div
      className={`flex-shrink-0 flex flex-col bg-[#0D1318] border-l border-[#1F2933] overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'w-72' : 'w-0'
      }`}
    >
      {/* prevent content flash during close animation */}
      <div className="w-72 flex flex-col h-full">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1F2933] flex-shrink-0">
          <div>
            <p className="text-sm font-semibold text-white">Chat History</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{sessions.length} conversation{sessions.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="p-1.5 rounded-lg hover:bg-[#1F2933] text-gray-500 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* ── New Chat ── */}
        <div className="px-3 py-3 border-b border-[#1F2933] flex-shrink-0">
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F14] text-xs font-bold rounded-lg transition-colors"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            New Conversation
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-[#1F2933] flex-shrink-0">
          {([
            { id: 'history', label: 'History', icon: ChatBubbleLeftRightIcon },
            { id: 'memory',  label: 'Memory',  icon: SparklesIcon },
            { id: 'gaps',    label: 'Gaps',    icon: ExclamationTriangleIcon },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors border-b-2 ${
                activeTab === id
                  ? 'border-[#22C55E] text-[#22C55E]'
                  : 'border-transparent text-gray-600 hover:text-gray-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto">

          {/* HISTORY */}
          {activeTab === 'history' && (
            <div className="py-2">
              {sessionsLoading && (
                <div className="flex justify-center py-10">
                  <div className="w-5 h-5 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!sessionsLoading && sessions.length === 0 && (
                <div className="flex flex-col items-center text-center px-6 py-12">
                  <div className="w-12 h-12 rounded-xl bg-[#1F2933] flex items-center justify-center mb-3">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-400">No conversations yet</p>
                  <p className="text-[10px] text-gray-600 mt-1">Start chatting to see history here</p>
                </div>
              )}

              {grouped.map(({ label, items }) => (
                <div key={label}>
                  {/* Date group label */}
                  <div className="flex items-center gap-2 px-4 py-2">
                    <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">{label}</span>
                    <div className="flex-1 h-px bg-[#1F2933]" />
                  </div>

                  {/* Session rows */}
                  {items.map((s) => {
                    const isActive = s._id === activeSessionId;
                    return (
                      <div
                        key={s._id}
                        onClick={() => onSelectSession(s._id)}
                        className={`group relative flex items-start gap-3 mx-2 mb-1 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                          isActive
                            ? 'bg-[#22C55E]/10 border border-[#22C55E]/25'
                            : 'hover:bg-[#1A1F2E] border border-transparent'
                        }`}
                      >
                        {/* Active dot */}
                        <div className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-[#22C55E]' : 'bg-[#2D3748]'}`} />

                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium leading-snug truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                            {s.title || 'New conversation'}
                          </p>
                          {s.summary && (
                            <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-1 leading-relaxed">
                              {s.summary}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mt-1">
                            {s.topicTag && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${tagColor(s.topicTag)}`}>
                                {s.topicTag}
                              </span>
                            )}
                            <span className="text-[9px] text-gray-700 ml-auto">
                              {new Date(s.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteSession(s._id); }}
                          aria-label="Delete conversation"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 text-gray-600 hover:text-red-400 flex-shrink-0 mt-0.5"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* MEMORY */}
          {activeTab === 'memory' && (
            <div className="p-3 space-y-2">
              <p className="text-[10px] text-gray-600 leading-relaxed pt-1 pb-2">
                Facts learned about your business, injected into every chat automatically.
              </p>
              {memoryLoading && (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!memoryLoading && memory.length === 0 && (
                <div className="flex flex-col items-center text-center px-4 py-10">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3">
                    <SparklesIcon className="w-6 h-6 text-purple-400/70" />
                  </div>
                  <p className="text-xs font-medium text-gray-400">No memory yet</p>
                  <p className="text-[10px] text-gray-600 mt-1">Chat more so the assistant learns your business</p>
                </div>
              )}
              {memory.map((fact) => (
                <div key={fact._id} className="group flex items-start gap-2 p-2.5 bg-[#0B0F14] border border-[#1F2933] rounded-lg hover:border-[#2D3748] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-200 leading-relaxed">{fact.fact}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${CATEGORY_COLORS[fact.category] || 'bg-gray-500/20 text-gray-400'}`}>
                        {CATEGORY_LABELS[fact.category] || fact.category}
                      </span>
                      <span className="text-[9px] text-gray-600">{Math.round(fact.confidence * 100)}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFact(fact._id)}
                    aria-label="Delete memory"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 text-gray-600 hover:text-red-400 flex-shrink-0"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* GAPS */}
          {activeTab === 'gaps' && (
            <div className="p-3 space-y-2">
              <p className="text-[10px] text-gray-600 leading-relaxed pt-1 pb-2">
                Questions your knowledge base couldn't answer. Upload docs to fill these gaps.
              </p>
              {gapsLoading && (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!gapsLoading && gaps.length === 0 && (
                <div className="flex flex-col items-center text-center px-4 py-10">
                  <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center mb-3">
                    <CheckIcon className="w-6 h-6 text-[#22C55E]/70" />
                  </div>
                  <p className="text-xs font-medium text-gray-400">No knowledge gaps</p>
                  <p className="text-[10px] text-gray-600 mt-1">All questions are being answered</p>
                </div>
              )}
              {gaps.map((gap) => (
                <div key={gap._id} className="flex items-start gap-2 p-2.5 bg-[#0B0F14] border border-yellow-500/20 rounded-lg">
                  <ExclamationTriangleIcon className="w-3.5 h-3.5 text-yellow-500/60 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 leading-relaxed">"{gap.question}"</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] text-gray-600">Asked {gap.frequency}×</span>
                      <button
                        onClick={() => handleResolveGap(gap._id)}
                        className="ml-auto text-[9px] flex items-center gap-0.5 px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 transition-colors font-medium"
                      >
                        <CheckIcon className="w-2.5 h-2.5" />
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
