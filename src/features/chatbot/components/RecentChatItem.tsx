'use client';

import React from 'react';
import type { ChatSessionSummary } from '../types';

interface RecentChatItemProps {
  session: ChatSessionSummary;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const TAG_COLORS: Record<string, string> = {
  strategy:     'bg-violet-500/15 text-violet-400',
  social:       'bg-pink-500/15 text-pink-400',
  content:      'bg-amber-500/15 text-amber-400',
  analytics:    'bg-sky-500/15 text-sky-400',
  campaign:     'bg-emerald-500/15 text-emerald-400',
  optimization: 'bg-orange-500/15 text-orange-400',
};

function tagColor(tag?: string) {
  if (!tag) return 'bg-[#1F2937] text-[#6B7280]';
  const key = Object.keys(TAG_COLORS).find((k) => tag.toLowerCase().includes(k));
  return key ? TAG_COLORS[key] : 'bg-[#1F2937] text-[#6B7280]';
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function RecentChatItem({ session, isActive, onSelect, onDelete }: RecentChatItemProps) {
  return (
    <div
      className={`sa-root group relative flex flex-col gap-1 p-3 rounded-xl border transition-all duration-150
        ${isActive
          ? 'bg-[#22C55E]/8 border-[#22C55E]/25'
          : 'bg-[#13161c] border-[#1c2028] hover:bg-[#1a1d24] hover:border-[#2a303c]'
        }`}
    >
      {/* Invisible full-area click target */}
      <button
        type="button"
        aria-label={`Load conversation: ${session.title || 'Untitled'}`}
        onClick={() => onSelect(session._id)}
        className="absolute inset-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/50 cursor-pointer"
      />
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <span className="sa-heading text-[12.5px] text-white leading-snug line-clamp-1 flex-1">
          {session.title || 'Untitled conversation'}
        </span>
        <span className="sa-subtext text-[10px] text-[#4B5563] flex-shrink-0 mt-0.5">
          {timeAgo(session.updatedAt || session.createdAt)}
        </span>
      </div>

      {/* Summary preview */}
      {session.summary && (
        <p className="sa-subtext text-[11.5px] text-[#6B7280] leading-snug line-clamp-2">
          {session.summary}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-0.5">
        {session.topicTag && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tagColor(session.topicTag)}`}>
            {session.topicTag}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
          <button
            type="button"
            aria-label="Delete conversation"
            onClick={(e) => { e.stopPropagation(); onDelete(session._id); }}
            className="relative z-10 p-1 rounded-md text-[#4B5563] hover:text-red-400 hover:bg-red-400/10 transition-colors duration-100 focus:outline-none"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
