'use client';

/**
 * Admin Dashboard - For admin users
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  useEffect(() => {
    const loadDashboard = async () => {
      if (token) {
        try {
          const [dashboard, usersList] = await Promise.all([
            authService.getAdminDashboard(token),
            authService.getAllUsers(token, 0, 10)
          ]);
          setDashboardData(dashboard);
          setUsers(usersList);
        } catch (error: any) {
          console.error('Failed to load dashboard:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDashboard();
  }, [token]);

  const handleDeleteUser = async (userId: string) => {
    if (!token) return;
    
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await authService.deleteUser(token, userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error: any) {
      alert(`Failed to delete user: ${error.message}`);
    }
  };

  const handleToggleActive = async (userId: string) => {
    if (!token) return;

    try {
      const updatedUser = await authService.updateUser(token, userId, {
        is_active: !users.find(u => u.id === userId)?.is_active
      });
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    } catch (error: any) {
      alert(`Failed to update user: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-yellow-400">⚡</span>
                Admin Dashboard
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Welcome, {user?.full_name || user?.username}!
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition border border-blue-500/30"
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <div className="text-blue-300 text-sm mb-1">Total Users</div>
            <div className="text-white text-3xl font-bold">{users.length}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
            <div className="text-green-300 text-sm mb-1">Active Users</div>
            <div className="text-white text-3xl font-bold">
              {users.filter(u => u.is_active).length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="text-purple-300 text-sm mb-1">Admins</div>
            <div className="text-white text-3xl font-bold">
              {users.filter(u => u.role === UserRole.ADMIN).length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30">
            <div className="text-orange-300 text-sm mb-1">Regular Users</div>
            <div className="text-white text-3xl font-bold">
              {users.filter(u => u.role === UserRole.USER).length}
            </div>
          </div>
        </div>

        {/* Dashboard Message */}
        {dashboardData && (
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30 mb-8">
            <p className="text-white text-lg">{dashboardData.message}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">User Management</h2>
            <p className="text-blue-200 text-sm mt-1">Manage all users in the system</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-white font-medium">{u.username}</div>
                        <div className="text-blue-300 text-sm">{u.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-200">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === UserRole.SUPERADMIN
                            ? 'bg-red-500/20 text-red-300'
                            : u.role === UserRole.ADMIN
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-blue-500/20 text-blue-300'
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {u.role !== UserRole.SUPERADMIN && u.id !== user?.id && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleActive(u.id)}
                              className="text-blue-300 hover:text-blue-200 transition"
                            >
                              Toggle
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-300 hover:text-red-200 transition"
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

        {/* Admin Features Info */}
        <div className="mt-6 bg-yellow-500/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
          <h3 className="text-white font-semibold mb-2">🛡️ Admin Capabilities</h3>
          <ul className="text-yellow-200 text-sm space-y-2">
            <li>• View and manage all users</li>
            <li>• Activate/deactivate user accounts</li>
            <li>• Delete users (except superadmins)</li>
            <li>• Access to all user features</li>
            <li>• Monitor system activity</li>
          </ul>
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
