'use client';

import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  SparklesIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { ChatSessionSummary, sessionService, MemoryFact, KnowledgeGap } from '../services/sessionService';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'memory' | 'gaps';

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
  const [activeTab, setActiveTab] = useState<Tab>('memory');

  // Memory state
  const [memory, setMemory]           = useState<MemoryFact[]>([]);
  const [memoryLoading, setMemLoad]   = useState(false);

  // Gaps state
  const [gaps, setGaps]               = useState<KnowledgeGap[]>([]);
  const [gapsLoading, setGapsLoad]    = useState(false);

  // Load memory + gaps when panel opens
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
    const updated = await sessionService.deleteMemoryFact(token, factId);
    setMemory(updated);
  };

  const handleResolveGap = async (gapId: string) => {
    if (!token) return;
    await sessionService.resolveGap(token, gapId);
    setGaps((prev) => prev.filter((g) => g._id !== gapId));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — covers only the left chat pane (absolute, not fixed) */}
      <div className="absolute inset-0 z-30 bg-black/50" onClick={onClose} />

      {/* Drawer — slides in from right within the chat pane */}
      <div className="absolute top-0 right-0 h-full w-full sm:w-80 z-40 bg-[#0C1220] border-l border-[#1A2535] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A2535]">
          <span className="text-sm font-semibold text-slate-200">Memory &amp; Gaps</span>
          <button title="Close" onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#1F2933] text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1F2933]">
          {([
            { id: 'memory',  label: 'Memory',   icon: SparklesIcon,            count: memory.length },
            { id: 'gaps',    label: 'Gaps',      icon: ExclamationTriangleIcon, count: gaps.length },
          ] as const).map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                activeTab === id
                  ? 'border-[#22C55E] text-[#22C55E]'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {count > 0 && (
                <span className={`text-[9px] px-1.5 rounded-full font-bold ${
                  activeTab === id ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#1F2933] text-gray-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── MEMORY ── */}
          {activeTab === 'memory' && (
            <div className="p-3 space-y-2">
              <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                Facts the AI learned about your business from past conversations. These are automatically injected into every new chat.
              </p>
              {memoryLoading && (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!memoryLoading && memory.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-3">
                    <SparklesIcon className="w-7 h-7 text-purple-400/80" />
                  </div>
                  <p className="text-xs font-medium text-gray-300">No memory yet</p>
                  <p className="text-[11px] text-gray-500 mt-1">Chat more so the AI can learn your business.</p>
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
                      <span className="text-[9px] text-gray-400">
                        {Math.round(fact.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                  <button
                    title="Delete fact"
                    onClick={() => handleDeleteFact(fact._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 text-gray-600 hover:text-red-400 flex-shrink-0"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── KNOWLEDGE GAPS ── */}
          {activeTab === 'gaps' && (
            <div className="p-3 space-y-2">
              <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                Questions your customers asked that your knowledge base couldn't answer. Upload documents to fill these gaps.
              </p>
              {gapsLoading && (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!gapsLoading && gaps.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-3">
                    <CheckIcon className="w-7 h-7 text-[#22C55E]/80" />
                  </div>
                  <p className="text-xs font-medium text-gray-300">No knowledge gaps</p>
                  <p className="text-[10px] text-gray-500 mt-1">Your knowledge base is covering all questions</p>
                </div>
              )}
              {gaps.map((gap) => (
                <div key={gap._id} className="flex items-start gap-2 p-2.5 bg-[#0B0F14] border border-yellow-500/20 rounded-lg">
                  <ExclamationTriangleIcon className="w-3.5 h-3.5 text-yellow-500/60 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 leading-relaxed">"{gap.question}"</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] text-gray-400">
                        Asked {gap.frequency}× · {timeAgo(gap.lastAsked)}
                      </span>
                      <button
                        onClick={() => handleResolveGap(gap._id)}
                        className="ml-auto text-[9px] flex items-center gap-0.5 px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 transition-colors font-medium"
                      >
                        <CheckIcon className="w-2.5 h-2.5" />
                        Mark resolved
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-[#1F2933]">
          <p className="text-[10px] text-gray-500 leading-relaxed">
            AI auto-generates titles, tags &amp; learns your business from every chat
          </p>
        </div>
      </div>
    </>
  );
}
