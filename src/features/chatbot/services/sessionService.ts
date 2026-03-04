/**
 * Session Service – connects the frontend to /api/admin/sessions endpoints.
 */

const BASE = '/api/sessions-proxy';

export interface ChatSessionSummary {
  _id: string;
  title: string | null;
  summary: string | null;
  topicTag: string | null;
  messageCount?: number;
  isEnded: boolean;
  insightsGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSessionFull extends ChatSessionSummary {
  messages: {
    _id: string;
    role: 'user' | 'assistant';
    content: string;
    knowledgeSource?: 'store' | 'general' | null;
    createdAt: string;
  }[];
}

export interface KnowledgeGap {
  _id: string;
  question: string;
  frequency: number;
  lastAsked: string;
  resolved: boolean;
}

export interface MemoryFact {
  _id: string;
  fact: string;
  category: string;
  confidence: number;
  createdAt: string;
}

class SessionService {
  private headers(token: string) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async listSessions(token: string): Promise<ChatSessionSummary[]> {
    const res = await fetch(`${BASE}/sessions`, { headers: this.headers(token) });
    if (!res.ok) throw new Error('Failed to load sessions');
    const data = await res.json();
    return data.sessions;
  }

  async createSession(token: string): Promise<ChatSessionFull> {
    const res = await fetch(`${BASE}/sessions`, {
      method: 'POST',
      headers: this.headers(token),
    });
    if (!res.ok) throw new Error('Failed to create session');
    const data = await res.json();
    return data.session;
  }

  async loadSession(token: string, sessionId: string): Promise<ChatSessionFull> {
    const res = await fetch(`${BASE}/sessions/${sessionId}`, { headers: this.headers(token) });
    if (!res.ok) throw new Error('Failed to load session');
    const data = await res.json();
    return data.session;
  }

  async deleteSession(token: string, sessionId: string): Promise<void> {
    await fetch(`${BASE}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: this.headers(token),
    });
  }

  async endSession(token: string, sessionId: string): Promise<void> {
    await fetch(`${BASE}/sessions/${sessionId}/end`, {
      method: 'PATCH',
      headers: this.headers(token),
    });
  }

  async listGaps(token: string): Promise<KnowledgeGap[]> {
    const res = await fetch(`${BASE}/gaps`, { headers: this.headers(token) });
    if (!res.ok) return [];
    const data = await res.json();
    return data.gaps;
  }

  async resolveGap(token: string, gapId: string): Promise<void> {
    await fetch(`${BASE}/gaps/${gapId}/resolve`, {
      method: 'PATCH',
      headers: this.headers(token),
    });
  }

  async getMemory(token: string): Promise<MemoryFact[]> {
    const res = await fetch(`${BASE}/memory`, { headers: this.headers(token) });
    if (!res.ok) return [];
    const data = await res.json();
    return data.facts;
  }

  async deleteMemoryFact(token: string, factId: string): Promise<MemoryFact[]> {
    const res = await fetch(`${BASE}/memory/${factId}`, {
      method: 'DELETE',
      headers: this.headers(token),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.facts;
  }
}

export const sessionService = new SessionService();
