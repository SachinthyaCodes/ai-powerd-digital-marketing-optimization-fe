'use client';

import { useEffect } from 'react';
import type { ChatSessionSummary } from '../types';
import RecentChatItem from './RecentChatItem';

interface Props {
  open: boolean;
  sessions: ChatSessionSummary[];
  onClose: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
}

export default function RecentChatsPanel({ open, sessions, onClose, onSelect, onDelete, onNewChat }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <>
      {/* overlay */}
      {open && <div className="sa-panel-overlay" onClick={onClose} />}

      <aside className={`sa-recent-panel ${open ? 'sa-recent-panel--open' : ''}`}>
        <div className="sa-recent-panel-header">
          <h2>Chat History</h2>
          <button className="sa-panel-close" onClick={onClose}>✕</button>
        </div>

        <button className="sa-new-chat-btn" onClick={onNewChat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New conversation
        </button>

        <div className="sa-recent-list">
          {sessions.length === 0 && (
            <p className="sa-empty-text">No conversations yet</p>
          )}
          {sessions.map((s) => (
            <RecentChatItem key={s._id} session={s} onSelect={onSelect} onDelete={onDelete} />
          ))}
        </div>
      </aside>
    </>
  );
}
