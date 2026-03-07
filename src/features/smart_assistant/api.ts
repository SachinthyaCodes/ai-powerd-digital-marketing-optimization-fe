/* ── Smart Assistant – API client ───────────────────────────────────────── */

import type {
  AuthResponse,
  AuthUser,
  ChatSessionSummary,
  ChatSession,
  MemoryFact,
  SendMessageResponse,
  SADocument,
  KnowledgeGap,
  GapsAnalytics,
  Tool,
  ServiceSettings,
  SAService,
} from './types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/* ── helpers ─────────────────────────────────────────────────────────── */

const TOKEN_KEY = 'sa_token';
const USER_KEY  = 'sa_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuth(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function authHeaders(): HeadersInit {
  const token = getToken();
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function handleRes<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

/* ── Auth ─────────────────────────────────────────────────────────────── */

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleRes<AuthResponse>(res);
}

export async function register(data: {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleRes<AuthUser>(res);
}

export async function getMe(): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: authHeaders(),
  });
  return handleRes<AuthUser>(res);
}

/* ── Chat ─────────────────────────────────────────────────────────────── */

export async function sendMessage(
  message: string,
  context: { role: string; content: string }[] = [],
  sessionId?: string | null,
): Promise<SendMessageResponse> {
  const res = await fetch(`${API_BASE}/api/admin/chat`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message, context, sessionId }),
  });
  return handleRes<SendMessageResponse>(res);
}

/* ── Sessions ────────────────────────────────────────────────────────── */

export async function listSessions(): Promise<ChatSessionSummary[]> {
  const res = await fetch(`${API_BASE}/api/admin/sessions`, {
    headers: authHeaders(),
  });
  const data = await handleRes<{ sessions: ChatSessionSummary[] }>(res);
  return data.sessions;
}

export async function createSession(): Promise<ChatSession> {
  const res = await fetch(`${API_BASE}/api/admin/sessions`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const data = await handleRes<{ session: ChatSession }>(res);
  return data.session;
}

export async function getSession(id: string): Promise<ChatSession> {
  const res = await fetch(`${API_BASE}/api/admin/sessions/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
  });
  const data = await handleRes<{ session: ChatSession }>(res);
  return data.session;
}

export async function deleteSession(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/sessions/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleRes<{ message: string }>(res);
}

export async function endSession(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/sessions/${encodeURIComponent(id)}/end`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  await handleRes<{ message: string; sessionId: string }>(res);
}

/* ── Memory ──────────────────────────────────────────────────────────── */

export async function getMemory(): Promise<MemoryFact[]> {
  const res = await fetch(`${API_BASE}/api/admin/memory`, {
    headers: authHeaders(),
  });
  const data = await handleRes<{ facts: MemoryFact[] }>(res);
  return data.facts;
}

export async function deleteMemoryFact(factId: string): Promise<MemoryFact[]> {
  const res = await fetch(`${API_BASE}/api/admin/memory/${encodeURIComponent(factId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await handleRes<{ facts: MemoryFact[] }>(res);
  return data.facts;
}

/* ── Public chat (no auth) ───────────────────────────────────────────── */

export async function publicSendMessage(
  message: string,
  tenantId: string,
  context: { role: string; content: string }[] = [],
): Promise<SendMessageResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, tenantId, context }),
  });
  return handleRes<SendMessageResponse>(res);
}

export async function getStore(tenantId: string): Promise<{ storeName: string; tenantId: string; active: boolean }> {
  const res = await fetch(`${API_BASE}/api/chat/store/${encodeURIComponent(tenantId)}`);
  return handleRes<{ storeName: string; tenantId: string; active: boolean }>(res);
}

/* ── Admin dashboard ─────────────────────────────────────────────────── */

export async function getAdminDashboard(): Promise<{
  message: string;
  admin: AuthUser;
  stats: { totalCustomers: number; storeName: string; serviceId: string; accountVerified: boolean };
}> {
  const res = await fetch(`${API_BASE}/api/admin/dashboard`, { headers: authHeaders() });
  return handleRes(res);
}

export async function getAdminService(): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/api/admin/service`, { headers: authHeaders() });
  return handleRes(res);
}

export async function getAiMetrics(): Promise<{
  totalQueries: number;
  totalGaps: number;
  totalDocuments: number;
  modelUsage: Record<string, number>;
  fallbackRate: number;
  avgResponseTimeMs: number;
  storeKnowledgeRate: number;
}> {
  const res = await fetch(`${API_BASE}/api/admin/ai-metrics`, { headers: authHeaders() });
  return handleRes(res);
}

/* ── Superadmin dashboard ────────────────────────────────────────────── */

export async function getSuperadminDashboard(): Promise<{
  message: string;
  superadmin: AuthUser;
  stats: {
    totalAdmins: number;
    totalUsers: number;
    totalServices: number;
    activeServices: number;
    pendingServices: number;
  };
}> {
  const res = await fetch(`${API_BASE}/api/superadmin/dashboard`, { headers: authHeaders() });
  return handleRes(res);
}

export async function getSuperadminStats(): Promise<{
  total_users: number;
  active_users: number;
  superadmins: number;
  admins: number;
  regular_users: number;
  inactive_users: number;
  adminDetails: AuthUser[];
  services: SAService[];
}> {
  const res = await fetch(`${API_BASE}/api/superadmin/stats`, { headers: authHeaders() });
  return handleRes(res);
}

/* ── Auth extras ──────────────────────────────────────────────────────── */

export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    headers: authHeaders(),
  });
  await handleRes<{ message: string }>(res);
}

export async function registerCustomer(data: {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  tenantId: string;
}): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/register/customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleRes<AuthUser>(res);
}

/* ── Admin – Users ────────────────────────────────────────────────────── */

export async function getAdminUsers(skip = 0, limit = 100): Promise<AuthUser[]> {
  const res = await fetch(
    `${API_BASE}/api/admin/users?skip=${skip}&limit=${limit}`,
    { headers: authHeaders() },
  );
  return handleRes<AuthUser[]>(res);
}

export async function updateAdminUser(
  id: string,
  data: { full_name?: string; username?: string; is_active?: boolean },
): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/admin/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleRes<AuthUser>(res);
}

export async function deleteAdminUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleRes<{ message: string }>(res);
}

/* ── Admin – Documents ────────────────────────────────────────────────── */

export async function listDocuments(): Promise<SADocument[]> {
  const res = await fetch(`${API_BASE}/api/admin/documents`, { headers: authHeaders() });
  return handleRes<SADocument[]>(res);
}

export async function uploadDocument(file: File): Promise<{
  message: string;
  document: { id: string; filename: string; fileType: string; size: number; status: string };
}> {
  const token = getToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/admin/documents/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  return handleRes(res);
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/documents/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleRes<{ message: string }>(res);
}

/* ── Admin – Knowledge Gaps ───────────────────────────────────────────── */

export async function getGaps(): Promise<KnowledgeGap[]> {
  const res = await fetch(`${API_BASE}/api/admin/gaps`, { headers: authHeaders() });
  const data = await handleRes<{ gaps: KnowledgeGap[] }>(res);
  return data.gaps;
}

export async function resolveGap(id: string): Promise<KnowledgeGap> {
  const res = await fetch(`${API_BASE}/api/admin/gaps/${encodeURIComponent(id)}/resolve`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  const data = await handleRes<{ gap: KnowledgeGap }>(res);
  return data.gap;
}

export async function getGapsAnalytics(): Promise<GapsAnalytics> {
  const res = await fetch(`${API_BASE}/api/admin/gaps/analytics`, { headers: authHeaders() });
  return handleRes<GapsAnalytics>(res);
}

/* ── Admin – Tools & Settings ─────────────────────────────────────────── */

export async function getTools(): Promise<ServiceSettings> {
  const res = await fetch(`${API_BASE}/api/admin/tools`, { headers: authHeaders() });
  return handleRes<ServiceSettings>(res);
}

export async function updateServiceSettings(data: {
  enabledTools?: string[];
  assistantTone?: string;
  assistantLanguage?: string;
}): Promise<{ message: string; enabledTools: string[]; assistantTone: string; assistantLanguage: string }> {
  const res = await fetch(`${API_BASE}/api/admin/service/settings`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

/* ── Superadmin – Users ───────────────────────────────────────────────── */

export async function getSuperadminUsers(skip = 0, limit = 100): Promise<AuthUser[]> {
  const res = await fetch(
    `${API_BASE}/api/superadmin/users?skip=${skip}&limit=${limit}`,
    { headers: authHeaders() },
  );
  return handleRes<AuthUser[]>(res);
}

export async function promoteToAdmin(id: string): Promise<AuthUser> {
  const res = await fetch(
    `${API_BASE}/api/superadmin/users/${encodeURIComponent(id)}/promote-to-admin`,
    { method: 'POST', headers: authHeaders() },
  );
  return handleRes<AuthUser>(res);
}

export async function promoteToSuperadmin(id: string): Promise<AuthUser> {
  const res = await fetch(
    `${API_BASE}/api/superadmin/users/${encodeURIComponent(id)}/promote-to-superadmin`,
    { method: 'POST', headers: authHeaders() },
  );
  return handleRes<AuthUser>(res);
}

export async function demoteToUser(id: string): Promise<AuthUser> {
  const res = await fetch(
    `${API_BASE}/api/superadmin/users/${encodeURIComponent(id)}/demote-to-user`,
    { method: 'POST', headers: authHeaders() },
  );
  return handleRes<AuthUser>(res);
}

export async function deleteSuperadminUser(id: string): Promise<void> {
  const res = await fetch(
    `${API_BASE}/api/superadmin/users/${encodeURIComponent(id)}`,
    { method: 'DELETE', headers: authHeaders() },
  );
  await handleRes<{ message: string }>(res);
}

export async function toggleUserActive(id: string): Promise<AuthUser> {
  const res = await fetch(
    `${API_BASE}/api/superadmin/users/${encodeURIComponent(id)}/toggle-active`,
    { method: 'POST', headers: authHeaders() },
  );
  return handleRes<AuthUser>(res);
}

/* ── Superadmin – Services ────────────────────────────────────────────── */

export async function createService(data: {
  name: string;
  assignedEmail: string;
  storeName?: string;
  storeCategory?: string;
}): Promise<SAService> {
  const res = await fetch(`${API_BASE}/api/superadmin/services`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleRes<SAService>(res);
}

export async function listServices(): Promise<SAService[]> {
  const res = await fetch(`${API_BASE}/api/superadmin/services`, { headers: authHeaders() });
  return handleRes<SAService[]>(res);
}

export async function deleteService(id: string): Promise<void> {
  const res = await fetch(
    `${API_BASE}/api/superadmin/services/${encodeURIComponent(id)}`,
    { method: 'DELETE', headers: authHeaders() },
  );
  await handleRes<{ message: string }>(res);
}
