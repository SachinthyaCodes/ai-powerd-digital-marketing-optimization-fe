'use client';

import { useState, useCallback, useEffect } from 'react';
import { chatbotService } from '../services/chatbotService';
import { sessionService, ChatSessionSummary, ChatSessionFull } from '../services/sessionService';
import { useAuth } from '@/contexts/AuthContext';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  knowledgeSource?: 'store' | 'general';
}

export function useChatbot() {
  const { token } = useAuth();

  // ── Active chat state ──────────────────────────────────────────────────────
  const [messages, setMessages]         = useState<Message[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState<string | null>(null);

  // ── Session state ──────────────────────────────────────────────────────────
  const [sessionList, setSessionList]         = useState<ChatSessionSummary[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // ── Load session list on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    setSessionsLoading(true);
    sessionService.listSessions(token)
      .then(setSessionList)
      .catch(() => {})
      .finally(() => setSessionsLoading(false));
  }, [token]);

  // ── Refresh session list ───────────────────────────────────────────────────
  const refreshSessionList = useCallback(async () => {
    if (!token) return;
    try {
      const list = await sessionService.listSessions(token);
      setSessionList(list);
    } catch { /* silent */ }
  }, [token]);

  // ── Switch to an existing session ─────────────────────────────────────────
  const loadSession = useCallback(async (sessionId: string) => {
    if (!token) return;
    try {
      const session: ChatSessionFull = await sessionService.loadSession(token, sessionId);
      setActiveSessionId(session._id);
      setMessages(
        session.messages.map((m) => ({
          id:              m._id,
          content:         m.content,
          role:            m.role,
          timestamp:       new Date(m.createdAt),
          knowledgeSource: m.knowledgeSource ?? undefined,
        }))
      );
      setError(null);
    } catch {
      setError('Failed to load session');
    }
  }, [token]);

  // ── Start a brand-new session ──────────────────────────────────────────────
  const newChat = useCallback(async () => {
    // End current session in background so insights get generated
    if (activeSessionId && token) {
      sessionService.endSession(token, activeSessionId)
        .then(refreshSessionList)
        .catch(() => {});
    }

    if (!token) {
      setMessages([]);
      setActiveSessionId(null);
      setError(null);
      return;
    }

    try {
      const session = await sessionService.createSession(token);
      setActiveSessionId(session._id);
      setMessages([]);
      setError(null);
      setSessionList((prev) => [session as unknown as ChatSessionSummary, ...prev]);
    } catch {
      setActiveSessionId(null);
      setMessages([]);
      setError(null);
    }
  }, [token, activeSessionId, refreshSessionList]);

  // ── Send a message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Auto-create a session on first message if none active
    let sessionId = activeSessionId;
    if (!sessionId && token) {
      try {
        const session = await sessionService.createSession(token);
        sessionId = session._id;
        setActiveSessionId(sessionId);
        setSessionList((prev) => [session as unknown as ChatSessionSummary, ...prev]);
      } catch { /* continue without session */ }
    }

    const userMessage: Message = {
      id:        Date.now().toString(),
      content,
      role:      'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatbotService.sendMessage(
        content,
        messages,
        token ?? undefined,
        sessionId ?? undefined
      );

      const assistantMessage: Message = {
        id:              (Date.now() + 1).toString(),
        content:         response.content,
        role:            'assistant',
        timestamp:       new Date(),
        knowledgeSource: response.knowledgeSource,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setMessages((prev) => [
        ...prev,
        {
          id:        (Date.now() + 1).toString(),
          content:   'Sorry, I encountered an error. Please try again.',
          role:      'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, token, activeSessionId]);

  // ── Delete a session ───────────────────────────────────────────────────────
  const deleteSession = useCallback(async (sessionId: string) => {
    if (!token) return;
    await sessionService.deleteSession(token, sessionId);
    setSessionList((prev) => prev.filter((s) => s._id !== sessionId));
    if (activeSessionId === sessionId) {
      setMessages([]);
      setActiveSessionId(null);
    }
  }, [token, activeSessionId]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    newChat,
    sessionList,
    sessionsLoading,
    activeSessionId,
    loadSession,
    deleteSession,
  };
}
