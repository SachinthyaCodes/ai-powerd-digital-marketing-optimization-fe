'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, User } from '@/types/auth';
import { authService } from '@/services/authService';

interface SystemStats {
  total_users: number;
  active_users: number;
  superadmins: number;
  admins: number;
  regular_users: number;
  inactive_users: number;
}

function SuperadminDashboardContent() {
  const { user, logout, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'admins' | 'superadmins'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showProvision, setShowProvision] = useState(false);
  const [provisionLoading, setProvisionLoading] = useState(false);
  const [form, setForm] = useState({ name: '', assignedEmail: '', storeName: '', storeCategory: '' });

  useEffect(() => { loadDashboard(); }, [token]);

  const loadDashboard = async () => {
    if (!token) return;
    try {
      const [systemStats, usersList, servicesList] = await Promise.all([
        authService.getSystemStats(token),
        authService.getAllUsersAdmin(token, 0, 100),
        authService.getServices(token),
      ]);
      setStats(systemStats);
      setUsers(usersList);
      setServices(servicesList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (!token || !confirm('Demote / set this user to Admin?')) return;
    try {
      const updated = await authService.promoteToAdmin(token, userId);
      setUsers(users.map((u) => (u.id === userId ? updated : u)));
      loadDashboard();
    } catch (err: any) { alert(err.message); }
  };

  const handlePromoteToSuperadmin = async (userId: string) => {
    if (!token || !confirm('Promote to Superadmin? This grants full platform access.')) return;
    try {
      const updated = await authService.promoteToSuperadmin(token, userId);
      setUsers(users.map((u) => (u.id === userId ? updated : u)));
      loadDashboard();
    } catch (err: any) { alert(err.message); }
  };

  const handleDemoteToUser = async (userId: string) => {
    if (!token || !confirm('Demote this account to regular User?')) return;
    try {
      const updated = await authService.demoteToUser(token, userId);
      setUsers(users.map((u) => (u.id === userId ? updated : u)));
      loadDashboard();
    } catch (err: any) { alert(err.message); }
  };

  const handleToggleActive = async (userId: string) => {
    if (!token) return;
    try {
      const updated = await authService.toggleUserActive(token, userId);
      setUsers(users.map((u) => (u.id === userId ? updated : u)));
      loadDashboard();
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!token || !confirm('⚠️ Delete this user permanently? This cannot be undone.')) return;
    try {
      await authService.deleteUserAdmin(token, userId);
      setUsers(users.filter((u) => u.id !== userId));
      loadDashboard();
    } catch (err: any) { alert(err.message); }
  };

  const handleCopyToken = (tenantId: string) => {
    navigator.clipboard.writeText(tenantId);
    setCopiedId(tenantId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setProvisionLoading(true);
    try {
      await authService.provisionService(token, form);
      setForm({ name: '', assignedEmail: '', storeName: '', storeCategory: '' });
      setShowProvision(false);
      loadDashboard();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProvisionLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!token || !confirm('Delete this service? The linked admin will lose their AI service token.')) return;
    try {
      await authService.deleteService(token, serviceId);
      loadDashboard();
    } catch (err: any) { alert(err.message); }
  };

  const filteredUsers = users.filter((u) => {
    if (activeTab === 'admins') return u.role === UserRole.ADMIN;
    if (activeTab === 'superadmins') return u.role === UserRole.SUPERADMIN;
    return true;
  });

  const roleBadge = (role: string) => {
    const map: Record<string, string> = {
      superadmin: 'bg-red-500/10 text-red-400 border-red-500/20',
      admin: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      user: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };
    return map[role] ?? 'bg-[#CBD5E1]/10 text-[#CBD5E1]';
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] font-sans">
      {/* Top nav */}
      <header className="bg-[#1F2933] border-b border-[#CBD5E1]/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Logo.png" alt="Serendib AI" className="h-8 w-auto" />
            <div className="h-5 w-px bg-[#CBD5E1]/20" />
            <span className="text-[#CBD5E1] text-sm font-medium">Superadmin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[#F9FAFB] text-sm font-medium leading-none">
                {user?.full_name || user?.username}
              </span>
              <span className="text-red-400 text-xs mt-0.5">Superadmin</span>
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
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#F9FAFB]">Platform Overview</h1>
          <p className="text-[#CBD5E1] text-sm mt-1">Full control over all accounts, roles, and services</p>
        </div>

        {/* Stats grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {[
              { label: 'Total', value: stats.total_users, accent: 'text-[#F9FAFB]' },
              { label: 'Active', value: stats.active_users, accent: 'text-[#22C55E]' },
              { label: 'Inactive', value: stats.inactive_users, accent: 'text-red-400' },
              { label: 'Superadmins', value: stats.superadmins, accent: 'text-red-400' },
              { label: 'Admins', value: stats.admins, accent: 'text-yellow-400' },
              { label: 'Users', value: stats.regular_users, accent: 'text-blue-400' },
            ].map((s) => (
              <div key={s.label} className="bg-[#1F2933] rounded-xl border border-[#CBD5E1]/10 p-4">
                <p className="text-[#CBD5E1] text-xs mb-1.5">{s.label}</p>
                <p className={`text-2xl font-bold ${s.accent}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* User management table */}
        <div className="bg-[#1F2933] rounded-2xl border border-[#CBD5E1]/10 overflow-hidden">
          {/* Table header + tabs */}
          <div className="px-6 py-5 border-b border-[#CBD5E1]/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#F9FAFB]">User Management</h2>
                <p className="text-[#CBD5E1] text-xs mt-0.5">Promote, demote, activate, or delete any account</p>
              </div>
              <div className="flex items-center gap-1 bg-[#0B0F14] rounded-lg p-1 border border-[#CBD5E1]/10">
                {(['all', 'admins', 'superadmins'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                      activeTab === t
                        ? 'bg-[#1F2933] text-[#F9FAFB] shadow'
                        : 'text-[#CBD5E1] hover:text-[#F9FAFB]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#CBD5E1]/5">
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#CBD5E1]/60 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#CBD5E1]/60 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#CBD5E1]/60 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#CBD5E1]/60 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#CBD5E1]/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBD5E1]/5">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#CBD5E1]/5 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold uppercase border ${
                            u.role === UserRole.SUPERADMIN
                              ? 'bg-red-500/10 border-red-500/20 text-red-400'
                              : u.role === UserRole.ADMIN
                              ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                              : 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]'
                          }`}>
                            {(u.username || u.email)[0]}
                          </div>
                          <div>
                            <p className="text-[#F9FAFB] font-medium">
                              {u.username}
                              {u.id === user?.id && (
                                <span className="ml-2 text-[#CBD5E1]/40 text-xs">(you)</span>
                              )}
                            </p>
                            {u.full_name && <p className="text-[#CBD5E1] text-xs">{u.full_name}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#CBD5E1]">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${roleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          u.is_active
                            ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${u.is_active ? 'bg-[#22C55E]' : 'bg-red-400'}`} />
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.id !== user?.id ? (
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {/* Role actions */}
                            {u.role === UserRole.USER && (
                              <>
                                <button onClick={() => handlePromoteToAdmin(u.id)}
                                  className="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 rounded text-xs transition">
                                  → Admin
                                </button>
                                <button onClick={() => handlePromoteToSuperadmin(u.id)}
                                  className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded text-xs transition">
                                  → Superadmin
                                </button>
                              </>
                            )}
                            {u.role === UserRole.ADMIN && (
                              <>
                                <button onClick={() => handlePromoteToSuperadmin(u.id)}
                                  className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded text-xs transition">
                                  → Superadmin
                                </button>
                                <button onClick={() => handleDemoteToUser(u.id)}
                                  className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 rounded text-xs transition">
                                  ↓ User
                                </button>
                              </>
                            )}
                            {u.role === UserRole.SUPERADMIN && (
                              <>
                                <button onClick={() => handlePromoteToAdmin(u.id)}
                                  className="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 rounded text-xs transition">
                                  ↓ Admin
                                </button>
                                <button onClick={() => handleDemoteToUser(u.id)}
                                  className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 rounded text-xs transition">
                                  ↓ User
                                </button>
                              </>
                            )}
                            {/* Toggle + delete */}
                            <button onClick={() => handleToggleActive(u.id)}
                              className="px-2.5 py-1 bg-[#0B0F14] border border-[#CBD5E1]/20 text-[#CBD5E1] hover:text-[#F9FAFB] rounded text-xs transition">
                              {u.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => handleDeleteUser(u.id)}
                              className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded text-xs transition font-medium">
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#CBD5E1]/30 text-xs text-right block">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="mt-4 flex items-center gap-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3">
          <span className="text-yellow-400 text-sm">⚠</span>
          <p className="text-yellow-400 text-xs">
            Superadmin actions are irreversible. Deleting or demoting accounts takes effect immediately.
          </p>
        </div>

        {/* ──────────────────── SERVICE PROVISIONING ──────────────────── */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#F9FAFB]">AI Service Provisioning</h2>
              <p className="text-[#CBD5E1] text-xs mt-0.5">Each service generates a unique tenant token used as the RAG namespace</p>
            </div>
            <button
              onClick={() => setShowProvision(!showProvision)}
              className="px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E]/20 rounded-lg text-xs font-medium transition"
            >
              {showProvision ? 'Cancel' : '+ New Service'}
            </button>
          </div>

          {/* Provision form */}
          {showProvision && (
            <form onSubmit={handleProvision} className="bg-[#1F2933] rounded-2xl border border-[#22C55E]/20 p-6 mb-6">
              <h3 className="text-[#F9FAFB] font-medium text-sm mb-4">Provision New Service</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[#CBD5E1] text-xs mb-1.5">Service Name <span className="text-red-400">*</span></label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. FreshMart AI Assistant"
                    className="w-full bg-[#0B0F14] border border-[#CBD5E1]/10 rounded-lg px-4 py-2.5 text-[#F9FAFB] text-sm placeholder-[#CBD5E1]/30 focus:outline-none focus:border-[#22C55E]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#CBD5E1] text-xs mb-1.5">Admin Email <span className="text-red-400">*</span></label>
                  <input
                    required
                    type="email"
                    value={form.assignedEmail}
                    onChange={(e) => setForm({ ...form, assignedEmail: e.target.value })}
                    placeholder="admin@store.com"
                    className="w-full bg-[#0B0F14] border border-[#CBD5E1]/10 rounded-lg px-4 py-2.5 text-[#F9FAFB] text-sm placeholder-[#CBD5E1]/30 focus:outline-none focus:border-[#22C55E]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#CBD5E1] text-xs mb-1.5">Store Name</label>
                  <input
                    value={form.storeName}
                    onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                    placeholder="e.g. FreshMart Colombo"
                    className="w-full bg-[#0B0F14] border border-[#CBD5E1]/10 rounded-lg px-4 py-2.5 text-[#F9FAFB] text-sm placeholder-[#CBD5E1]/30 focus:outline-none focus:border-[#22C55E]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#CBD5E1] text-xs mb-1.5">Store Category</label>
                  <input
                    value={form.storeCategory}
                    onChange={(e) => setForm({ ...form, storeCategory: e.target.value })}
                    placeholder="e.g. Grocery, Pharmacy, Electronics"
                    className="w-full bg-[#0B0F14] border border-[#CBD5E1]/10 rounded-lg px-4 py-2.5 text-[#F9FAFB] text-sm placeholder-[#CBD5E1]/30 focus:outline-none focus:border-[#22C55E]/50"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={provisionLoading}
                  className="px-5 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F14] font-semibold rounded-lg text-sm transition disabled:opacity-50"
                >
                  {provisionLoading ? 'Provisioning...' : 'Provision Service'}
                </button>
                <p className="text-[#CBD5E1]/50 text-xs">A unique tenant token is auto-generated on creation</p>
              </div>
            </form>
          )}

          {/* Services list */}
          {services.length === 0 ? (
            <div className="bg-[#1F2933] rounded-2xl border border-[#CBD5E1]/10 p-10 text-center">
              <p className="text-[#CBD5E1] text-sm">No services provisioned yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((svc) => (
                <div key={svc._id} className="bg-[#1F2933] rounded-2xl border border-[#CBD5E1]/10 p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-[#F9FAFB] font-semibold text-sm">{svc.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                          svc.status === 'active'
                            ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
                            : svc.status === 'suspended'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>{svc.status}</span>
                      </div>
                      <p className="text-[#CBD5E1] text-xs mb-2">
                        {svc.assignedEmail}
                        {svc.storeName ? ` • ${svc.storeName}` : ''}
                        {svc.storeCategory ? ` • ${svc.storeCategory}` : ''}
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="bg-[#0B0F14] border border-[#CBD5E1]/10 rounded-lg px-3 py-1.5 text-[#22C55E] text-xs font-mono tracking-wide flex-1 truncate">
                          {svc.tenantId}
                        </code>
                        <button
                          onClick={() => handleCopyToken(svc.tenantId)}
                          className="flex-shrink-0 px-3 py-1.5 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E]/20 rounded-lg text-xs transition"
                        >
                          {copiedId === svc.tenantId ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteService(svc._id)}
                      className="flex-shrink-0 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg text-xs transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SuperadminDashboardPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.SUPERADMIN}>
      <SuperadminDashboardContent />
    </ProtectedRoute>
  );
}
