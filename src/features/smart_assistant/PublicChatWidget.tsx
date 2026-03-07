'use client';

import { useState, useCallback } from 'react';
import type { ChatMessage } from './types';
import * as api from './api';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import './smart-assistant.css';

interface Props {
  tenantId: string;
  storeName: string;
}

/**
 * Public (unauthenticated) chat widget for customer-facing pages.
 * Requires tenantId + storeName (resolved by the parent page).
 */
export default function PublicChatWidget({ tenantId, storeName }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');

  const send = useCallback(
    async (text: string) => {
      setError('');
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const context = messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await api.publicSendMessage(text, tenantId, context);

        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: res.response,
          timestamp: res.timestamp,
          knowledgeSource: res.knowledgeSource,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
      } finally {
        setIsTyping(false);
      }
    },
    [messages, tenantId],
  );

  return (
    <div className="sa-public-widget">
      <header className="sa-public-header">
        <div className="sa-public-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h2 className="sa-public-title">{storeName} Assistant</h2>
          <span className="sa-public-status"><span className="sa-status-dot" /> Online</span>
        </div>
      </header>

      <div className="sa-public-body">
        {messages.length === 0 ? (
          <div className="sa-public-welcome">
            <p>👋 Hi! How can I help you with <strong>{storeName}</strong> today?</p>
          </div>
        ) : (
          <MessageList messages={messages} isTyping={isTyping} />
        )}
      </div>

      {error && <div className="sa-error-bar">{error}</div>}

      <ChatInput onSend={send} disabled={isTyping} />
    </div>
  );
}
