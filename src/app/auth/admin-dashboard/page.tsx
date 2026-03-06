'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, User, ServiceInfo } from '@/types/auth';
import { authService } from '@/services/authService';

function AdminDashboardContent() {
  const { user, logout, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [aiMetrics, setAiMetrics] = useState<any>(null);
  const [gapsAnalytics, setGapsAnalytics] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) return;
      try {
        const [dashboard, usersList] = await Promise.all([
          authService.getAdminDashboard(token),
          authService.getAllUsers(token, 0, 10),
        ]);
        setDashboardData(dashboard);
        setUsers(usersList);
        // Auto-fetch service token (independent – don’t block if not provisioned)
        try {
          const svc = await authService.getAdminService(token);
          setServiceInfo(svc);
        } catch {
          // Not provisioned yet – silently skip
        }
        // Fetch knowledge base documents
        try {
          const docs = await authService.getDocuments(token);
          setDocuments(docs);
        } catch {
          // silently skip
        }
        // Fetch AI metrics + knowledge gap analytics (non-blocking)
        try {
          const [metrics, gaps] = await Promise.all([
            authService.getAiMetrics(token),
            authService.getGapsAnalytics(token),
          ]);
          setAiMetrics(metrics);
          setGapsAnalytics(gaps);
        } catch {
          // silently skip — metrics are optional
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [token]);

  const handleCopyToken = () => {
    if (!serviceInfo?.tenantId) return;
    navigator.clipboard.writeText(serviceInfo.tenantId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    setUploadMsg('');
    try {
      const result = await authService.uploadDocument(token, file);
      setUploadMsg(result.message);
      const docs = await authService.getDocuments(token);
      setDocuments(docs);
    } catch (err: any) {
      setUploadMsg(`Error: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!token || !confirm('Delete this document and all its vectors from the knowledge base?')) return;
    try {
      await authService.deleteDocument(token, docId);
      setDocuments(documents.filter((d) => d._id !== docId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!token) return;
    if (!confirm('Delete this user permanently?')) return;
    try {
      await authService.deleteUser(token, userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    }
  };

  const handleToggleActive = async (userId: string) => {
    if (!token) return;
    try {
      const target = users.find((u) => u.id === userId);
      const updated = await authService.updateUser(token, userId, {
        is_active: !target?.is_active,
      });
      setUsers(users.map((u) => (u.id === userId ? updated : u)));
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    }
  };

  const stats = dashboardData?.stats;

  return (
    <div className="min-h-screen bg-[#0B0F14] font-sans">
      {/* Top nav */}
      <header className="bg-[#1F2933] border-b border-[#CBD5E1]/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Logo.png" alt="Serendib AI" className="h-8 w-auto" />
            <div className="h-5 w-px bg-[#CBD5E1]/20" />
            <span className="text-[#CBD5E1] text-sm font-medium">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[#F9FAFB] text-sm font-medium leading-none">
                {user?.full_name || user?.username}
              </span>
              <span className="text-[#22C55E] text-xs mt-0.5">Admin</span>
            </div>
            <Link
              href="/"
              className="px-3 py-1.5 bg-[#0B0F14] border border-[#CBD5E1]/20 text-[#CBD5E1] hover:text-[#F9FAFB] rounded-lg text-xs transition"
            >
              Marketing Tool
            </Link>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg text-xs transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#F9FAFB]">Dashboard</h1>
          <p className="text-[#CBD5E1] text-sm mt-1">
            Manage your store — <span className="text-[#22C55E]">{stats?.storeName || 'Store not linked'}</span>
            {!user?.is_verified && (
              <span className="ml-3 inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded text-xs">
                ⚠ Pending verification
              </span>
            )}
          </p>
        </div>

        {/* Service token card */}
        {serviceInfo ? (
          <div className="bg-[#1F2933] rounded-2xl border border-[#22C55E]/20 p-6 mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#22C55E] text-xs font-semibold uppercase tracking-widest">AI Service</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    serviceInfo.status === 'active'
                      ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
                      : serviceInfo.status === 'suspended'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>{serviceInfo.status}</span>
                </div>
                <p className="text-[#F9FAFB] font-semibold text-lg truncate">{serviceInfo.name}</p>
                {serviceInfo.storeName && (
                  <p className="text-[#CBD5E1] text-xs mt-0.5">{serviceInfo.storeName}{serviceInfo.storeCategory ? ` • ${serviceInfo.storeCategory}` : ''}</p>
                )}
                <div className="mt-3">
                  <p className="text-[#CBD5E1] text-xs mb-1.5">Service Token <span className="text-[#CBD5E1]/50">(RAG namespace • unique per store)</span></p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-[#0B0F14] border border-[#CBD5E1]/10 rounded-lg px-4 py-2.5 text-[#22C55E] text-sm font-mono tracking-wide truncate">
                      {serviceInfo.tenantId}
                    </code>
                    <button
                      onClick={handleCopyToken}
                      className="flex-shrink-0 px-4 py-2.5 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E]/20 rounded-lg text-xs font-medium transition"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Customer Chat Link */}
                <div className="mt-4 pt-4 border-t border-[#1F2933]">
                  <p className="text-[#CBD5E1] text-xs mb-1.5">
                    Customer Chat Link
                    <span className="ml-1 text-[#CBD5E1]/50">(share with your customers)</span>
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <code className="flex-1 bg-[#0B0F14] border border-[#CBD5E1]/10 rounded-lg px-3 py-2 text-[#22C55E] text-xs font-mono truncate">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/chat/{serviceInfo.tenantId}
                    </code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/chat/${serviceInfo.tenantId}`); }}
                      className="flex-shrink-0 px-4 py-2.5 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E]/20 rounded-lg text-xs font-medium transition whitespace-nowrap"
                    >
                      Copy Link
                    </button>
                  </div>
                  <details className="group">
                    <summary className="text-[#CBD5E1] text-xs cursor-pointer hover:text-[#22C55E] transition-colors list-none flex items-center gap-1 select-none">
                      <span className="group-open:hidden">▸</span>
                      <span className="hidden group-open:inline">▾</span>
                      &nbsp;Show embed code
                    </summary>
                    <pre className="mt-2 bg-[#0B0F14] border border-[#CBD5E1]/10 rounded-lg p-3 text-[10px] text-[#6B7280] overflow-x-auto whitespace-pre-wrap">{`<iframe\n  src="${typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/chat/${serviceInfo.tenantId}"\n  width="400"\n  height="650"\n  style="border:none;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.3);"\n  title="Smart Assistant"\n></iframe>`}</pre>
                  </details>
                </div>
              </div>
            </div>
          </div>
        ) : !loading ? (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3">
            <span className="text-yellow-400 text-lg">⚠</span>
            <p className="text-yellow-300 text-sm">No AI service provisioned yet. Ask the Superadmin to create a service for your email.</p>
          </div>
        ) : null}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: users.length, color: 'text-[#22C55E]' },
            { label: 'Active', value: users.filter((u) => u.is_active).length, color: 'text-blue-400' },
            { label: 'Inactive', value: users.filter((u) => !u.is_active).length, color: 'text-red-400' },
            { label: 'Customers', value: stats?.totalCustomers ?? '—', color: 'text-purple-400' },
          ].map((s) => (
            <div key={s.label} className="bg-[#1F2933] rounded-xl border border-[#CBD5E1]/10 p-5">
              <p className="text-[#CBD5E1] text-xs mb-2">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Welcome banner */}
        {dashboardData?.message && (
          <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-xl p-4 mb-8">
            <p className="text-[#22C55E] text-sm">{dashboardData.message}</p>
          </div>
        )}

        {/* Users table */}
        <div className="bg-[#1F2933] rounded-2xl border border-[#CBD5E1]/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-[#CBD5E1]/10 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#F9FAFB]">Users</h2>
              <p className="text-[#CBD5E1] text-xs mt-0.5">Manage customer accounts</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <svg className="animate-spin h-5 w-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-[#CBD5E1] text-sm">Loading...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400 text-sm">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#CBD5E1] text-sm">No users yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#CBD5E1]/10">
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#CBD5E1]/60 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#CBD5E1]/60 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#CBD5E1]/60 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#CBD5E1]/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBD5E1]/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#CBD5E1]/5 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] text-xs font-semibold uppercase">
                            {(u.username || u.email)[0]}
                          </div>
                          <div>
                            <p className="text-[#F9FAFB] font-medium">{u.username}</p>
                            {u.full_name && <p className="text-[#CBD5E1] text-xs">{u.full_name}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#CBD5E1]">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.is_active
                            ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${u.is_active ? 'bg-[#22C55E]' : 'bg-red-400'}`} />
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== UserRole.SUPERADMIN && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleToggleActive(u.id)}
                              className="px-3 py-1.5 bg-[#0B0F14] border border-[#CBD5E1]/20 text-[#CBD5E1] hover:text-[#F9FAFB] rounded-lg text-xs transition"
                            >
                              {u.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg text-xs transition"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Knowledge Base */}
        {serviceInfo && (
          <div className="mt-6 bg-[#1F2933] rounded-2xl border border-[#CBD5E1]/10 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#CBD5E1]/10 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#F9FAFB]">Knowledge Base</h2>
                <p className="text-[#CBD5E1] text-xs mt-0.5">Upload store documents — they are embedded into your AI assistant</p>
              </div>
              <label className={`cursor-pointer px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E]/20 rounded-lg text-xs font-medium transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? 'Uploading…' : '+ Upload File'}
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleUpload}
                />
              </label>
            </div>

            {uploadMsg && (
              <div className={`mx-6 mt-4 px-4 py-2.5 rounded-lg text-xs ${
                uploadMsg.startsWith('Error')
                  ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                  : 'bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]'
              }`}>
                {uploadMsg}
              </div>
            )}

            {documents.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[#CBD5E1] text-sm">No documents yet.</p>
                <p className="text-[#CBD5E1]/50 text-xs mt-1">Upload a PDF, DOCX or TXT to build your store’s knowledge base.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#CBD5E1]/5">
                {documents.map((doc) => (
                  <div key={doc._id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-[#0B0F14] border border-[#CBD5E1]/10 flex items-center justify-center text-[#CBD5E1] text-xs font-bold uppercase flex-shrink-0">
                        {doc.fileType}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#F9FAFB] text-sm font-medium truncate">{doc.filename}</p>
                        <p className="text-[#CBD5E1] text-xs">
                          {doc.chunkCount} chunks • {(doc.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        doc.status === 'ready'
                          ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
                          : doc.status === 'failed'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {doc.status}
                      </span>
                      <button
                        onClick={() => handleDeleteDocument(doc._id)}
                        className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg text-xs transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Monitoring Section */}
        {aiMetrics && (
          <div className="mt-6 bg-[#1F2933] rounded-2xl border border-[#CBD5E1]/10 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#CBD5E1]/10">
              <h2 className="text-base font-semibold text-[#F9FAFB]">AI Performance Monitoring</h2>
              <p className="text-[#CBD5E1] text-xs mt-0.5">Research metrics — RAG pipeline evaluation</p>
            </div>

            {/* Metric cards */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Queries', value: aiMetrics.totalQueries ?? 0, color: 'text-[#22C55E]' },
                { label: 'Knowledge Gaps', value: aiMetrics.totalGaps ?? 0, color: 'text-yellow-400' },
                { label: 'Avg Response (ms)', value: aiMetrics.avgResponseTimeMs ?? 0, color: 'text-blue-400' },
                { label: 'Store Knowledge Rate', value: `${aiMetrics.storeKnowledgeRate ?? 0}%`, color: 'text-purple-400' },
              ].map((m) => (
                <div key={m.label} className="bg-[#0B0F14] rounded-xl border border-[#CBD5E1]/10 p-4">
                  <p className="text-[#CBD5E1] text-xs mb-1">{m.label}</p>
                  <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Model usage breakdown */}
            {aiMetrics.modelUsage && Object.keys(aiMetrics.modelUsage).length > 0 && (
              <div className="px-6 pb-5">
                <p className="text-[#CBD5E1] text-xs font-medium mb-3">LLM Model Usage</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(aiMetrics.modelUsage as Record<string, number>).map(([model, count]) => (
                    <span
                      key={model}
                      className="px-3 py-1.5 bg-[#0B0F14] border border-[#CBD5E1]/10 rounded-lg text-xs text-[#CBD5E1]"
                    >
                      <span className={`font-semibold ${
                        model.startsWith('ollama') ? 'text-[#22C55E]'
                        : model.startsWith('groq')  ? 'text-blue-400'
                        : 'text-purple-400'
                      }`}>{model}</span>
                      <span className="ml-2 text-[#CBD5E1]/60">{count} calls</span>
                    </span>
                  ))}
                </div>
                {aiMetrics.fallbackRate > 0 && (
                  <p className="text-xs text-yellow-400 mt-2">⚠ Fallback rate: {aiMetrics.fallbackRate}%</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Knowledge Gap Analytics */}
        {gapsAnalytics && gapsAnalytics.totalGaps > 0 && (
          <div className="mt-6 bg-[#1F2933] rounded-2xl border border-[#CBD5E1]/10 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#CBD5E1]/10 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#F9FAFB]">Knowledge Gaps</h2>
                <p className="text-[#CBD5E1] text-xs mt-0.5">
                  {gapsAnalytics.unresolvedGaps} unresolved of {gapsAnalytics.totalGaps} total — upload documents to fill these gaps
                </p>
              </div>
            </div>
            <div className="divide-y divide-[#CBD5E1]/5">
              {gapsAnalytics.topGaps.map((gap: any) => (
                <div key={gap._id} className="px-6 py-3 flex items-center justify-between gap-4">
                  <p className="text-[#CBD5E1] text-sm truncate flex-1">{gap.question}</p>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded text-xs">
                      asked {gap.frequency}×
                    </span>
                    {gap.resolved && (
                      <span className="px-2 py-0.5 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded text-xs">resolved</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Capabilities info */}
        <div className="mt-6 bg-[#1F2933] rounded-2xl border border-[#CBD5E1]/10 p-6">
          <h3 className="text-[#F9FAFB] font-medium mb-3 text-sm">Admin capabilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'View and manage users',
              'Activate / deactivate accounts',
              'Delete user accounts',
              'Access marketing tools',
              'Monitor store activity',
              'Configure assistant settings',
            ].map((cap) => (
              <div key={cap} className="flex items-center gap-2 text-[#CBD5E1] text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                {cap}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
