'use client';

/**
 * Auth Navigation Component
 * Add this to any page to provide quick access to login/register
 */

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function AuthNav() {
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <Link
          href={
            user.role === 'superadmin'
              ? '/auth/superadmin-dashboard'
              : user.role === 'admin'
              ? '/auth/admin-dashboard'
              : '/auth/user-dashboard'
          }
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-lg text-white rounded-lg transition border border-purple-500/50 text-sm"
        >
          Dashboard
        </Link>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-lg text-white rounded-lg transition border border-red-500/50 text-sm"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
      <Link
        href="/auth/login"
        className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg transition border border-white/20 text-sm"
      >
        Login
      </Link>
      <Link
        href="/auth/register"
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition text-sm font-semibold"
      >
        Sign Up
      </Link>
    </div>
  );
}
