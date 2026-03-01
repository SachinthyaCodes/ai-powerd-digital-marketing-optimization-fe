'use client';

/**
 * Superadmin Dashboard - For superadmin users with full system control
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, [token]);

  const loadDashboard = async () => {
    if (token) {
      try {
        const [dashboard, systemStats, usersList] = await Promise.all([
          authService.getSuperadminDashboard(token),
          authService.getSystemStats(token),
          authService.getAllUsers(token, 0, 50)
        ]);
        setDashboardData(dashboard);
        setStats(systemStats);
        setUsers(usersList);
      } catch (error: any) {
        console.error('Failed to load dashboard:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePromoteToAdmin = async (userId: number) => {
    if (!token) return;
    if (!confirm('Promote this user to Admin?')) return;

    try {
      const updatedUser = await authService.promoteToAdmin(token, userId);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      loadDashboard(); // Refresh stats
    } catch (error: any) {
      alert(`Failed to promote user: ${error.message}`);
    }
  };

  const handlePromoteToSuperadmin = async (userId: number) => {
    if (!token) return;
    if (!confirm('⚠️ WARNING: Promote this user to Superadmin? This grants full system access!')) return;

    try {
      const updatedUser = await authService.promoteToSuperadmin(token, userId);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      loadDashboard(); // Refresh stats
    } catch (error: any) {
      alert(`Failed to promote user: ${error.message}`);
    }
  };

  const handleDemoteToUser = async (userId: number) => {
    if (!token) return;
    if (!confirm('Demote this user to regular User role?')) return;

    try {
      const updatedUser = await authService.demoteToUser(token, userId);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      loadDashboard(); // Refresh stats
    } catch (error: any) {
      alert(`Failed to demote user: ${error.message}`);
    }
  };

  const handleToggleActive = async (userId: number) => {
    if (!token) return;

    try {
      const updatedUser = await authService.toggleUserActive(token, userId);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      loadDashboard(); // Refresh stats
    } catch (error: any) {
      alert(`Failed to update user: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!token) return;
    if (!confirm('⚠️ Are you sure you want to DELETE this user permanently?')) return;

    try {
      await authService.deleteUser(token, userId);
      setUsers(users.filter(u => u.id !== userId));
      loadDashboard(); // Refresh stats
    } catch (error: any) {
      alert(`Failed to delete user: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-purple-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-red-400">👑</span>
                Superadmin Dashboard
              </h1>
              <p className="text-red-200 text-sm mt-1">
                Full System Control - {user?.full_name || user?.username}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition border border-purple-500/30"
              >
                Marketing Tool
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition border border-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
              <div className="text-blue-300 text-xs mb-1">Total Users</div>
              <div className="text-white text-2xl font-bold">{stats.total_users}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
              <div className="text-green-300 text-xs mb-1">Active</div>
              <div className="text-white text-2xl font-bold">{stats.active_users}</div>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-4 border border-red-500/30">
              <div className="text-red-300 text-xs mb-1">Superadmins</div>
              <div className="text-white text-2xl font-bold">{stats.superadmins}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
              <div className="text-yellow-300 text-xs mb-1">Admins</div>
              <div className="text-white text-2xl font-bold">{stats.admins}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
              <div className="text-purple-300 text-xs mb-1">Users</div>
              <div className="text-white text-2xl font-bold">{stats.regular_users}</div>
            </div>
            <div className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-lg rounded-xl p-4 border border-gray-500/30">
              <div className="text-gray-300 text-xs mb-1">Inactive</div>
              <div className="text-white text-2xl font-bold">{stats.inactive_users}</div>
            </div>
          </div>
        )}

        {/* Dashboard Message */}
        {dashboardData && (
          <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30 mb-8">
            <p className="text-white text-lg">{dashboardData.message}</p>
          </div>
        )}

        {/* Users Management */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">Complete User Management</h2>
            <p className="text-red-200 text-sm mt-1">Full control over all user accounts and roles</p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-white">Loading users...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-300">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        #{u.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-white font-medium">{u.username}</div>
                        <div className="text-purple-300 text-sm">{u.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-purple-200">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === UserRole.SUPERADMIN
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : u.role === UserRole.ADMIN
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.is_active
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        {u.id !== user?.id ? (
                          <div className="flex flex-col gap-1">
                            {u.role === UserRole.USER && (
                              <>
                                <button
                                  onClick={() => handlePromoteToAdmin(u.id)}
                                  className="text-yellow-300 hover:text-yellow-200 transition text-left"
                                >
                                  → Promote to Admin
                                </button>
                                <button
                                  onClick={() => handlePromoteToSuperadmin(u.id)}
                                  className="text-red-300 hover:text-red-200 transition text-left"
                                >
                                  → Promote to Superadmin
                                </button>
                              </>
                            )}
                            {u.role === UserRole.ADMIN && (
                              <>
                                <button
                                  onClick={() => handlePromoteToSuperadmin(u.id)}
                                  className="text-red-300 hover:text-red-200 transition text-left"
                                >
                                  → Promote to Superadmin
                                </button>
                                <button
                                  onClick={() => handleDemoteToUser(u.id)}
                                  className="text-blue-300 hover:text-blue-200 transition text-left"
                                >
                                  ↓ Demote to User
                                </button>
                              </>
                            )}
                            {u.role === UserRole.SUPERADMIN && (
                              <button
                                onClick={() => handleDemoteToUser(u.id)}
                                className="text-blue-300 hover:text-blue-200 transition text-left"
                              >
                                ↓ Demote to User
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleActive(u.id)}
                              className="text-purple-300 hover:text-purple-200 transition text-left"
                            >
                              {u.is_active ? '⊗ Deactivate' : '✓ Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-400 hover:text-red-300 transition text-left font-semibold"
                            >
                              ✕ Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">You</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Superadmin Powers Info */}
        <div className="mt-6 bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span>⚡</span> Superadmin Capabilities
          </h3>
          <ul className="text-red-200 text-sm space-y-2">
            <li>• <strong>Full system control</strong> - Complete access to all features</li>
            <li>• <strong>Role management</strong> - Promote/demote users to any role</li>
            <li>• <strong>User management</strong> - Create, update, delete any user</li>
            <li>• <strong>System monitoring</strong> - View comprehensive system statistics</li>
            <li>• <strong>Account control</strong> - Activate/deactivate any account</li>
            <li>• <strong>Data access</strong> - Access to all user data and campaigns</li>
          </ul>
        </div>

        {/* Warning */}
        <div className="mt-4 bg-yellow-500/10 backdrop-blur-lg rounded-2xl p-4 border border-yellow-500/30">
          <p className="text-yellow-200 text-sm">
            ⚠️ <strong>Warning:</strong> Superadmin actions cannot be undone. Use with caution.
          </p>
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
