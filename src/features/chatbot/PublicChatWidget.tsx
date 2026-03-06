'use client';

/**
 * PublicChatWidget — customer-facing chat interface
 *
 * Uses the unauthenticated POST /api/chat backend endpoint.
 * Requires only a tenantId (store identifier) passed as a prop.
 * No login required — any customer can chat with the store's AI assistant.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './chatbot.css';
import { API_BASE_URL } from '@/config/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Msg {
  role: 'user' | 'assistant';
  content: string;
  knowledgeSource?: 'store' | 'general' | null;
  timestamp: Date;
}

interface Props {
  tenantId: string;
  storeName?: string;
}

// ─── Tiny markdown renderer (matches admin chat) ──────────────────────────────
function renderContent(text: string): React.ReactNode {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const inner      = part.slice(3, -3);
      const nlIdx      = inner.indexOf('\n');
      const lang       = nlIdx > -1 ? inner.slice(0, nlIdx).trim() : '';
      const code       = nlIdx > -1 ? inner.slice(nlIdx + 1) : inner;
      return (
        <pre key={i} className="overflow-x-auto bg-[#0D1117] rounded-md p-3 my-2 text-[12px]">
          {lang && <span className="text-[#6B7280] block mb-1">{lang}</span>}
          <code className="text-[#E5E7EB]">{code}</code>
        </pre>
      );
    }
    return (
      <span key={i}>
        {part.split('\n').map((line, li, arr) => (
          <React.Fragment key={li}>
            {line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((seg, si) => {
              if (seg.startsWith('`') && seg.endsWith('`'))
                return <code key={si} className="bg-[#1a2030] px-1 rounded text-[#86efac]">{seg.slice(1, -1)}</code>;
              if (seg.startsWith('**') && seg.endsWith('**'))
                return <strong key={si} className="text-[#E5E7EB] font-semibold">{seg.slice(2, -2)}</strong>;
              return <span key={si}>{seg}</span>;
            })}
            {li < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
      </span>
    );
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PublicChatWidget({ tenantId, storeName = 'Smart Assistant' }: Props) {
  const [messages, setMessages]       = useState<Msg[]>([]);
  const [input,    setInput]          = useState('');
  const [isTyping, setIsTyping]       = useState(false);
  const [error,    setError]          = useState<string | null>(null);
  const contextRef = useRef<{ role: string; content: string }[]>([]);
  const bottomRef  = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Msg = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    contextRef.current = [...contextRef.current, { role: 'user', content: text }].slice(-10);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          message:  text,
          context:  contextRef.current.slice(0, -1),
          tenantId,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: Msg = {
        role:            'assistant',
        content:         data.response,
        knowledgeSource: data.knowledgeSource,
        timestamp:       new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      contextRef.current = [...contextRef.current, { role: 'assistant', content: data.response }].slice(-10);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ ${msg}`, timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, tenantId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="sa-root flex flex-col h-full min-h-0 bg-[#0B1120] rounded-2xl overflow-hidden border border-[#1c2028]">

      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4 border-b border-[#1c2028]/60">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-[#0f2318] border border-[#22C55E]/20 flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
              <path d="M5 14v2a7 7 0 0 0 14 0v-2"/>
            </svg>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#0B1120]" />
        </div>
        <div>
          <p className="sa-heading text-white text-[15px] leading-tight">{storeName}</p>
          <p className="sa-subtext text-[11px] text-[#22C55E] flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] inline-block" />
            {isTyping ? 'Thinking…' : 'Online · Powered by AI'}
          </p>
        </div>
      </div>

      {/* Message list */}
      <div className="sa-chat-scroll flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-[#0f2318] border border-[#22C55E]/20 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                <path d="M5 14v2a7 7 0 0 0 14 0v-2"/>
              </svg>
            </div>
            <p className="sa-heading text-white text-[15px]">How can I help you today?</p>
            <p className="sa-subtext text-[#6B7280] text-xs max-w-[260px]">
              Ask me anything about {storeName}. I'll answer from our knowledge base.
            </p>
          </div>
        )}

        {messages.map((m, i) => {
          const isUser = m.role === 'user';
          return (
            <div key={i} className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border
                ${isUser ? 'bg-[#1a2030] border-[#2a303c]' : 'bg-[#0f2318] border-[#22C55E]/20'}`}>
                {isUser
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><path d="M5 14v2a7 7 0 0 0 14 0v-2"/></svg>
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`px-3.5 py-2.5 text-[13.5px] leading-relaxed rounded-2xl
                  ${isUser
                    ? 'bg-[#22C55E]/15 border border-[#22C55E]/25 text-[#E5E7EB] rounded-tr-sm'
                    : 'bg-[#0D1117] border border-[#1c2028] text-[#CBD5E1] rounded-tl-sm'
                  }`}>
                  {renderContent(m.content)}
                </div>
                <div className={`flex items-center gap-1.5 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="sa-subtext text-[10px] text-[#4B5563]">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!isUser && m.knowledgeSource && (
                    <span className={`sa-subtext text-[9px] px-1.5 py-0.5 rounded border font-medium
                      ${m.knowledgeSource === 'store'
                        ? 'bg-[#22C55E]/8 border-[#22C55E]/20 text-[#22C55E]'
                        : 'bg-[#1c2028] border-[#2a303c] text-[#6B7280]'
                      }`}>
                      {m.knowledgeSource === 'store' ? '✦ store knowledge' : '✦ general'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2.5">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0f2318] border border-[#22C55E]/20 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><path d="M5 14v2a7 7 0 0 0 14 0v-2"/></svg>
            </div>
            <div className="bg-[#0D1117] border border-[#1c2028] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((n) => (
                <span key={n} className="sa-typing-dot" style={{ animationDelay: `${n * 0.18}s` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-[#1c2028]/60">
        {error && <p className="text-red-400 text-xs mb-2 px-1">{error}</p>}
        <div className="flex items-end gap-2 bg-[#0D1117] border border-[#1c2028] rounded-xl px-3 py-2
                        focus-within:border-[#22C55E]/40 transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question…"
            rows={1}
            className="flex-1 bg-transparent text-[#E5E7EB] text-[13.5px] placeholder-[#4B5563]
                       resize-none focus:outline-none py-1 leading-relaxed max-h-28 overflow-y-auto"
            style={{ fontFamily: 'inherit' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#22C55E] hover:bg-[#16A34A]
                       disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center
                       transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-[#374151] mt-2">Powered by Smart Assistant · {storeName}</p>
      </div>
    </div>
  );
}
