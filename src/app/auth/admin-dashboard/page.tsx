'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, User } from '@/types/auth';
import { authService } from '@/services/authService';

function AdminDashboardContent() {
  const { user, logout, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [token]);

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
