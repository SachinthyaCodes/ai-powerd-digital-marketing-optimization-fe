'use client';

import { useState, useCallback } from 'react';
import type { AuthUser, ChatMessage, ChatSessionSummary } from './types';
import * as api from './api';
import AuthGate from './AuthGate';
import AssistantLanding from './components/AssistantLanding';
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import SuggestionCards from './components/SuggestionCards';
import RecentChatsPanel from './components/RecentChatsPanel';
import './smart-assistant.css';

function ChatUI({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);

  /* ── send a message ──────────────────────────────────────────────── */
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

        const res = await api.sendMessage(text, context, sessionId);

        if (res.sessionId && !sessionId) {
          setSessionId(res.sessionId);
        }

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
    [messages, sessionId],
  );

  /* ── history panel ─────────────────────────────────────────────── */
  const openHistory = useCallback(async () => {
    setPanelOpen(true);
    try {
      const list = await api.listSessions();
      setSessions(list);
    } catch {
      /* ignore */
    }
  }, []);

  const loadSession = useCallback(async (id: string) => {
    try {
      const session = await api.getSession(id);
      const msgs: ChatMessage[] = (session.messages || []).map((m, i) => ({
        id: `${m.role}-${i}-${Date.now()}`,
        role: m.role,
        content: m.content,
        timestamp: (m as unknown as Record<string, string>).createdAt || new Date().toISOString(),
        knowledgeSource: (m as unknown as Record<string, string>).knowledgeSource as ChatMessage['knowledgeSource'],
      }));
      setMessages(msgs);
      setSessionId(session._id);
      setStarted(true);
      setPanelOpen(false);
    } catch {
      /* ignore */
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await api.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s._id !== id));
      if (sessionId === id) {
        setMessages([]);
        setSessionId(null);
      }
    } catch {
      /* ignore */
    }
  }, [sessionId]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setStarted(true);
    setPanelOpen(false);
  }, []);

  /* ── landing page ──────────────────────────────────────────────── */
  if (!started) {
    return (
      <div className="sa-container">
        <ChatHeader
          storeName={user.storeName}
          onHistoryToggle={openHistory}
          onLogout={onLogout}
          userName={user.full_name || user.username}
        />
        <AssistantLanding onStart={() => setStarted(true)} />
        <RecentChatsPanel
          open={panelOpen}
          sessions={sessions}
          onClose={() => setPanelOpen(false)}
          onSelect={loadSession}
          onDelete={handleDelete}
          onNewChat={handleNewChat}
        />
      </div>
    );
  }

  /* ── chat view ─────────────────────────────────────────────────── */
  return (
    <div className="sa-container">
      <ChatHeader
        storeName={user.storeName}
        onHistoryToggle={openHistory}
        onLogout={onLogout}
        userName={user.full_name || user.username}
      />

      <div className="sa-chat-body">
        {messages.length === 0 ? (
          <div className="sa-empty-state">
            <p className="sa-empty-title">How can I help you today?</p>
            <SuggestionCards onSelect={(text) => send(text)} />
          </div>
        ) : (
          <MessageList messages={messages} isTyping={isTyping} />
        )}
      </div>

      {error && <div className="sa-error-bar">{error}</div>}

      <ChatInput onSend={send} disabled={isTyping} />

      <RecentChatsPanel
        open={panelOpen}
        sessions={sessions}
        onClose={() => setPanelOpen(false)}
        onSelect={loadSession}
        onDelete={handleDelete}
        onNewChat={handleNewChat}
      />
    </div>
  );
}

export default function SmartAssistant() {
  return (
    <AuthGate>
      {(user, onLogout) => <ChatUI user={user} onLogout={onLogout} />}
    </AuthGate>
  );
}
