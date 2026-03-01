'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F14] px-4">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#22C55E]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img src="/Logo.png" alt="Serendib AI" className="h-12 w-auto mb-4" />
          <p className="text-[#CBD5E1] text-sm">Smart Assistant Platform</p>
        </div>

        {/* Card */}
        <div className="bg-[#1F2933] rounded-2xl border border-[#CBD5E1]/10 shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-[#F9FAFB] mb-1">Welcome back</h2>
          <p className="text-[#CBD5E1] text-sm mb-7">Sign in to your account to continue</p>

          {error && (
            <div className="mb-5 flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="text-red-400 mt-0.5">&#9888;</span>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#CBD5E1] mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-[#0B0F14] border border-[#CBD5E1]/20 rounded-lg text-[#F9FAFB] placeholder-[#CBD5E1]/30 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/60 focus:border-[#22C55E] transition text-sm"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#CBD5E1] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 bg-[#0B0F14] border border-[#CBD5E1]/20 rounded-lg text-[#F9FAFB] placeholder-[#CBD5E1]/30 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/60 focus:border-[#22C55E] transition text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CBD5E1]/50 hover:text-[#CBD5E1] transition text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F14] font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-[#22C55E]/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#CBD5E1]/10 text-center">
            <p className="text-[#CBD5E1] text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-[#22C55E] hover:text-[#16A34A] font-medium transition"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-[#CBD5E1]/50 hover:text-[#CBD5E1] text-xs transition"
          >
            ← Back to Marketing Tool
          </Link>
        </div>
      </div>
    </div>
  );
}
