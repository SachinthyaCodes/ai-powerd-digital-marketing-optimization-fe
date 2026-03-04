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
      {/* Backdrop */}
      <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="absolute top-0 right-0 h-full w-full sm:w-[340px] z-40 bg-[#0B0F14]/95 backdrop-blur-xl border-l border-white/[0.04] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
              <SparklesIcon className="w-3.5 h-3.5 text-[#22C55E]/70" />
            </div>
            <span className="text-[13px] font-semibold text-white/90">Intelligence</span>
          </div>
          <button title="Close" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pt-3 pb-0 gap-1">
          {([
            { id: 'memory',  label: 'Memory',   icon: SparklesIcon,            count: memory.length },
            { id: 'gaps',    label: 'Gaps',      icon: ExclamationTriangleIcon, count: gaps.length },
          ] as const).map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-all ${
                activeTab === id
                  ? 'bg-white/[0.06] text-white/90'
                  : 'text-white/30 hover:text-white/50 hover:bg-white/[0.02]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              {count > 0 && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === id ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-white/[0.04] text-white/30'
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
            <div className="p-4 space-y-2">
              <p className="text-[11px] text-white/30 mb-3 leading-relaxed">
                Facts learned from your conversations. Automatically used in every new chat.
              </p>
              {memoryLoading && (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-[#22C55E]/50 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!memoryLoading && memory.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mx-auto mb-3">
                    <SparklesIcon className="w-5 h-5 text-white/15" />
                  </div>
                  <p className="text-xs font-medium text-white/40">No memory yet</p>
                  <p className="text-[11px] text-white/20 mt-1">Chat more so the AI can learn your business.</p>
                </div>
              )}
              {memory.map((fact) => (
                <div key={fact._id} className="group flex items-start gap-2 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.06] transition-all">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/60 leading-relaxed">{fact.fact}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium ${CATEGORY_COLORS[fact.category] || 'bg-white/[0.04] text-white/30'}`}>
                        {CATEGORY_LABELS[fact.category] || fact.category}
                      </span>
                      <span className="text-[9px] text-white/20">
                        {Math.round(fact.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <button
                    title="Delete fact"
                    onClick={() => handleDeleteFact(fact._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 flex-shrink-0"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── KNOWLEDGE GAPS ── */}
          {activeTab === 'gaps' && (
            <div className="p-4 space-y-2">
              <p className="text-[11px] text-white/30 mb-3 leading-relaxed">
                Questions your knowledge base couldn’t answer. Fill these to improve responses.
              </p>
              {gapsLoading && (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-[#22C55E]/50 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!gapsLoading && gaps.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/10 flex items-center justify-center mx-auto mb-3">
                    <CheckIcon className="w-5 h-5 text-[#22C55E]/40" />
                  </div>
                  <p className="text-xs font-medium text-white/40">All caught up</p>
                  <p className="text-[11px] text-white/20 mt-1">No knowledge gaps detected</p>
                </div>
              )}
              {gaps.map((gap) => (
                <div key={gap._id} className="flex items-start gap-2.5 p-3 bg-amber-500/[0.03] border border-amber-500/10 rounded-xl">
                  <ExclamationTriangleIcon className="w-3.5 h-3.5 text-amber-400/50 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/55 leading-relaxed">“{gap.question}”</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] text-white/20">
                        {gap.frequency}× · {timeAgo(gap.lastAsked)}
                      </span>
                      <button
                        onClick={() => handleResolveGap(gap._id)}
                        className="ml-auto text-[9px] flex items-center gap-0.5 px-2 py-1 rounded-md bg-[#22C55E]/8 text-[#22C55E]/80 hover:bg-[#22C55E]/15 transition-colors font-medium"
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

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.04]">
          <p className="text-[10px] text-white/15 text-center">
            Auto-learns from every conversation
          </p>
        </div>
      </div>
    </>
  );
}
