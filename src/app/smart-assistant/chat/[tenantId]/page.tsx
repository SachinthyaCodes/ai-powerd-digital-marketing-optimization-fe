'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { getStore, publicSendMessage } from '@/features/smart_assistant/api';
import '@/features/smart_assistant/smart-assistant.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  knowledgeSource?: string;
}

export default function PublicChatPage() {
  const params   = useParams();
  const tenantId = typeof params.tenantId === 'string' ? params.tenantId : Array.isArray(params.tenantId) ? params.tenantId[0] : '';

  const [storeName, setStoreName]   = useState('');
  const [storeLoading, setSToreLoading] = useState(true);
  const [storeError, setStoreError] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Load store info
  useEffect(() => {
    if (!tenantId) { setStoreError('Invalid chat link.'); setSToreLoading(false); return; }
    getStore(tenantId)
      .then(s => { setStoreName(s.storeName); setSToreLoading(false); })
      .catch(() => { setStoreError('Store not found or unavailable.'); setSToreLoading(false); });
  }, [tenantId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const ctx = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));
      const res = await publicSendMessage(msg, tenantId, ctx);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.response,
        model: res.model,
        knowledgeSource: res.knowledgeSource,
      }]);
    } catch (err: unknown) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err instanceof Error ? `Error: ${err.message}` : 'Sorry, something went wrong. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  }

  if (storeLoading) {
    return (
      <div className="sa-public-chat-page sa-public-chat-page--center">
        <div className="sa-spinner" />
      </div>
    );
  }

  if (storeError) {
    return (
      <div className="sa-public-chat-page sa-public-chat-page--center">
        <div className="sa-public-chat-error">
          <div className="sa-public-chat-error-icon">!</div>
          <p>{storeError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-public-chat-page">
      {/* Header */}
      <div className="sa-public-chat-header">
        <div className="sa-public-chat-avatar">AI</div>
        <div>
          <div className="sa-public-chat-store-name">{storeName}</div>
          <div className="sa-public-chat-status">
            <span className="sa-public-chat-dot" />
            Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="sa-public-chat-messages">
        {messages.length === 0 && (
          <div className="sa-public-chat-welcome">
            <div className="sa-public-chat-welcome-icon">Hi</div>
            <p>Hi! I&apos;m the AI assistant for <strong>{storeName}</strong>.</p>
            <p>How can I help you today?</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`sa-public-bubble sa-public-bubble--${m.role}`}>
            {m.role === 'assistant' && (
              <div className="sa-public-bubble-avatar">AI</div>
            )}
            <div className="sa-public-bubble-body">
              <div className="sa-public-bubble-text">{m.content}</div>
              {m.role === 'assistant' && m.knowledgeSource && (
                <div className="sa-public-bubble-meta">
                  {m.knowledgeSource === 'store' ? 'From store knowledge base' : 'General knowledge'}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="sa-public-bubble sa-public-bubble--assistant">
            <div className="sa-public-bubble-avatar">AI</div>
            <div className="sa-public-bubble-body">
              <div className="sa-chat-typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form className="sa-public-chat-input-bar" onSubmit={handleSend}>
        <input
          className="sa-public-chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Ask ${storeName}…`}
          disabled={loading}
          autoComplete="off"
          autoFocus
        />
        <button
          className="sa-public-chat-send"
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
