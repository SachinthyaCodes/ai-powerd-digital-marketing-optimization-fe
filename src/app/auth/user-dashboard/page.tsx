'use client';

/**
 * User Dashboard - For regular users
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { authService } from '@/services/authService';

function UserDashboardContent() {
  const { user, logout, token } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadDashboard = async () => {
      if (token) {
        try {
          const data = await authService.getUserDashboard(token);
          setDashboardData(data);
        } catch (error) {
          console.error('Failed to load dashboard:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDashboard();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">User Dashboard</h1>
              <p className="text-purple-200 text-sm mt-1">
                Welcome, {user?.full_name || user?.username}!
              </p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition border border-red-500/30"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-purple-300 text-sm">Email</p>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm">Username</p>
              <p className="text-white font-medium">{user?.username}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm">Role</p>
              <p className="text-white font-medium capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                user?.is_active 
                  ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-200 border border-red-500/30'
              }`}>
                {user?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Link 
            href="/"
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400 transition group"
          >
            <div className="text-purple-300 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition">
              Marketing Strategy
            </h3>
            <p className="text-purple-200 text-sm">
              Generate AI-powered marketing recommendations
            </p>
          </Link>

          <Link 
            href="/dashboard/campaigns"
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400 transition group"
          >
            <div className="text-blue-300 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition">
              Campaigns
            </h3>
            <p className="text-blue-200 text-sm">
              Manage your marketing campaigns
            </p>
          </Link>

          <Link 
            href="/dashboard/chat"
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 hover:border-green-400 transition group"
          >
            <div className="text-green-300 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2 group-hover:text-green-300 transition">
              AI Chat
            </h3>
            <p className="text-green-200 text-sm">
              Chat with AI marketing assistant
            </p>
          </Link>
        </div>

        {/* Dashboard Message */}
        {loading ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <p className="text-white text-center">Loading dashboard...</p>
          </div>
        ) : dashboardData ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <p className="text-white text-lg">{dashboardData.message}</p>
          </div>
        ) : null}

        {/* Info Section */}
        <div className="mt-6 bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white font-semibold mb-2">ℹ️ User Features</h3>
          <ul className="text-blue-200 text-sm space-y-2">
            <li>• Access to marketing strategy generation tools</li>
            <li>• Create and manage campaigns</li>
            <li>• AI-powered content suggestions</li>
            <li>• Chat with AI marketing assistant</li>
            <li>• View your profile and settings</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.USER}>
      <UserDashboardContent />
    </ProtectedRoute>
  );
}
