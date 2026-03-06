'use client';

import React from 'react';
import type { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

/** Very small markdown-like renderer: code blocks, inline code, bold, lists. */
function renderContent(text: string): React.ReactNode {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const inner = part.slice(3, -3);
      const newlineIdx = inner.indexOf('\n');
      const lang = newlineIdx > -1 ? inner.slice(0, newlineIdx).trim() : '';
      const code = newlineIdx > -1 ? inner.slice(newlineIdx + 1) : inner;
      return (
        <pre key={i}>
          {lang && <span className="text-[#6B7280] text-[11px] block mb-1">{lang}</span>}
          <code>{code}</code>
        </pre>
      );
    }

    return (
      <span key={i}>
        {part.split('\n').map((line, li) => {
          const segments = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
          return (
            <React.Fragment key={li}>
              {segments.map((seg, si) => {
                if (seg.startsWith('`') && seg.endsWith('`'))
                  return <code key={si}>{seg.slice(1, -1)}</code>;
                if (seg.startsWith('**') && seg.endsWith('**'))
                  return <strong key={si} className="text-[#E5E7EB] font-semibold">{seg.slice(2, -2)}</strong>;
                return <span key={si}>{seg}</span>;
              })}
              {li < part.split('\n').length - 1 && <br />}
            </React.Fragment>
          );
        })}
      </span>
    );
  });
}

function formatTime(ts: Date | string): string {
  const d = ts instanceof Date ? ts : new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className="sa-root flex items-end gap-3 mb-5 sa-message-enter w-full flex-row">

      {/* AI avatar — left side */}
      {!isUser && (
        <div className="sa-avatar sa-avatar-ai flex-shrink-0 self-end">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            <path d="M5 14v2a7 7 0 0 0 14 0v-2"/>
          </svg>
          <span className="sa-avatar-ring" />
        </div>
      )}

      {/* ── Bubble + metadata ── */}
      {/* ml-auto pushes user content to the right side */}
      <div className={`max-w-[70%] flex flex-col gap-1.5 ${isUser ? 'items-end ml-auto' : 'items-start'}`}>
        {/* Label */}
        <span className={`sa-subtext text-[10.5px] font-medium px-1 ${isUser ? 'sa-label-user' : 'sa-label-ai'}`}>
          {isUser ? 'You' : 'Smart Assistant'}
        </span>

        {/* Message bubble */}
        <div
          className={`sa-bubble px-4 py-3 text-[13.5px] leading-relaxed sa-msg-content
            ${isUser
              ? 'sa-bubble-user rounded-2xl rounded-tr-sm'
              : 'sa-bubble-ai  rounded-2xl rounded-tl-sm'
            }`}
        >
          {renderContent(message.content)}
        </div>

        {/* Timestamp + source badge */}
        <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="sa-subtext text-[10.5px] text-[#4B5563]">
            {formatTime(message.timestamp)}
          </span>
          {!isUser && message.knowledgeSource && (
            <span className={`sa-subtext text-[10px] px-1.5 py-0.5 rounded-md border font-medium
              ${message.knowledgeSource === 'store'
                ? 'bg-[#22C55E]/8 border-[#22C55E]/20 text-[#22C55E]'
                : 'bg-[#1c2028] border-[#2a303c] text-[#6B7280]'
              }`}
            >
              {message.knowledgeSource === 'store' ? '✦ business data' : '✦ general'}
            </span>
          )}
        </div>
      </div>

      {/* User avatar — right side, placed after bubble in DOM */}
      {isUser && (
        <div className="sa-avatar sa-avatar-user flex-shrink-0 self-end">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      )}
    </div>
  );
}
