/* ── Smart Assistant – shared types ─────────────────────────────────────── */

export type KnowledgeSource = 'store' | 'general';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  knowledgeSource?: KnowledgeSource | null;
}

export interface ChatSession {
  _id: string;
  userId: string;
  tenantId: string;
  title: string | null;
  summary: string | null;
  topicTag: string | null;
  messages: ChatMessage[];
  isEnded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSessionSummary {
  _id: string;
  title: string | null;
  summary: string | null;
  topicTag: string | null;
  createdAt: string;
  updatedAt: string;
  isEnded: boolean;
}

export interface MemoryFact {
  _id: string;
  fact: string;
  category: string;
  confidence: number;
  createdAt: string;
}

export interface SendMessageResponse {
  response: string;
  model: string;
  usedFallback: boolean;
  knowledgeSource: KnowledgeSource;
  confidence: number;
  sources: string[];
  sessionId: string | null;
  timestamp: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  tenantId: string;
  storeName: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface Suggestion {
  id: string;
  text: string;
  category: string;
  icon: string;
}

/* ── Manage-portal types ────────────────────────────────────────────────── */

export interface SADocument {
  _id: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt';
  size: number;
  status: 'processing' | 'ready' | 'failed';
  chunkCount?: number;
  errorMessage?: string;
  createdAt: string;
}

export interface KnowledgeGap {
  _id: string;
  question: string;
  frequency: number;
  lastAsked: string;
  resolved: boolean;
}

export interface GapsAnalytics {
  topGaps: KnowledgeGap[];
  totalGaps: number;
  unresolvedGaps: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
}

export interface ServiceSettings {
  tools: Tool[];
  enabledTools: string[];
  assistantTone: string;
  assistantLanguage: string;
}

export interface SAService {
  _id: string;
  name: string;
  storeName?: string;
  storeCategory?: string;
  assignedEmail?: string;
  tenantId?: string;
  status: 'pending' | 'active';
  adminId?: { email: string; username: string; full_name: string } | null;
  createdAt: string;
}
