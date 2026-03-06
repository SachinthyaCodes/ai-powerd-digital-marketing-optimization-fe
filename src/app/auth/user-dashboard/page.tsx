'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { authService } from '@/services/authService';

function UserDashboardContent() {
  const { user, logout, token } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const initials = (user?.full_name || user?.username || 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F9FAFB]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0B0F14]/95 border-b border-[#CBD5E1]/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/Logo.png" alt="Logo" width={32} height={32} className="rounded" />
            <span className="font-semibold text-[#F9FAFB]">
              User Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#CBD5E1] text-sm hidden sm:block">{user?.full_name || user?.username}</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 uppercase">
              User
            </span>
            <button
              onClick={logout}
              className="ml-2 px-3 py-1.5 rounded text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl px-6 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] font-bold text-lg flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-[#F9FAFB]">Welcome back, {user?.full_name || user?.username}!</p>
            <p className="text-[#CBD5E1] text-sm">{user?.email}</p>
          </div>
          <span className={`ml-auto flex items-center gap-1.5 text-sm ${user?.is_active ? 'text-[#22C55E]' : 'text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full ${user?.is_active ? 'bg-[#22C55E]' : 'bg-red-400'}`} />
            {user?.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1F2933] rounded-xl border border-[#CBD5E1]/10 p-6">
          <h2 className="font-semibold text-[#F9FAFB] mb-4">Your Profile</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Email', value: user?.email },
              { label: 'Username', value: user?.username },
              { label: 'Full Name', value: user?.full_name || '—' },
              { label: 'Role', value: user?.role && user.role.charAt(0).toUpperCase() + user.role.slice(1) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[#CBD5E1] text-xs mb-1">{label}</p>
                <p className="text-[#F9FAFB] text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-semibold text-[#F9FAFB] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/" className="group bg-[#1F2933] hover:bg-[#1F2933]/80 border border-[#CBD5E1]/10 hover:border-[#22C55E]/40 rounded-xl p-5 transition">
              <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-[#F9FAFB] font-semibold text-sm mb-1 group-hover:text-[#22C55E] transition">Marketing Strategy</h3>
              <p className="text-[#CBD5E1] text-xs">Generate AI-powered marketing recommendations</p>
            </Link>

            <Link href="/dashboard/campaigns" className="group bg-[#1F2933] hover:bg-[#1F2933]/80 border border-[#CBD5E1]/10 hover:border-[#22C55E]/40 rounded-xl p-5 transition">
              <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-[#F9FAFB] font-semibold text-sm mb-1 group-hover:text-[#22C55E] transition">Campaigns</h3>
              <p className="text-[#CBD5E1] text-xs">Manage your marketing campaigns</p>
            </Link>

            <Link href="/dashboard/chat" className="group bg-[#1F2933] hover:bg-[#1F2933]/80 border border-[#CBD5E1]/10 hover:border-[#22C55E]/40 rounded-xl p-5 transition">
              <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-[#F9FAFB] font-semibold text-sm mb-1 group-hover:text-[#22C55E] transition">AI Chat</h3>
              <p className="text-[#CBD5E1] text-xs">Chat with AI marketing assistant</p>
            </Link>
          </div>
        </div>

        {/* Dashboard message */}
        {loading ? (
          <div className="bg-[#1F2933] border border-[#CBD5E1]/10 rounded-xl p-6 text-center text-[#CBD5E1] text-sm">
            Loading dashboard data...
          </div>
        ) : dashboardData?.message ? (
          <div className="bg-[#1F2933] border border-[#CBD5E1]/10 rounded-xl p-6 text-[#F9FAFB] text-sm">
            {dashboardData.message}
          </div>
        ) : null}

        {/* Capabilities */}
        <div className="bg-[#1F2933] border border-[#CBD5E1]/10 rounded-xl p-6">
          <h3 className="font-semibold text-[#F9FAFB] text-sm mb-3">Your Capabilities</h3>
          <ul className="space-y-2 text-[#CBD5E1] text-sm">
            {[
              'Access to marketing strategy generation tools',
              'Create and manage campaigns',
              'AI-powered content suggestions',
              'Chat with AI marketing assistant',
              'View your profile and settings',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] flex-shrink-0" />
                {item}
              </li>
            ))}
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
