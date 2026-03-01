'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name || undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-[#0B0F14] border border-[#CBD5E1]/20 rounded-lg text-[#F9FAFB] placeholder-[#CBD5E1]/30 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/60 focus:border-[#22C55E] transition text-sm';
  const labelClass = 'block text-sm font-medium text-[#CBD5E1] mb-2';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F14] px-4 py-10">
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
          <h2 className="text-xl font-semibold text-[#F9FAFB] mb-1">Create your account</h2>
          <p className="text-[#CBD5E1] text-sm mb-7">Register as an admin to manage your store</p>

          {error && (
            <div className="mb-5 flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="text-red-400 mt-0.5">&#9888;</span>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="full_name" className={labelClass}>Full name</label>
                <input id="full_name" name="full_name" type="text" value={formData.full_name}
                  onChange={handleChange} className={inputClass} placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="username" className={labelClass}>Username <span className="text-red-400">*</span></label>
                <input id="username" name="username" type="text" value={formData.username}
                  onChange={handleChange} required className={inputClass} placeholder="johndoe" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email address <span className="text-red-400">*</span></label>
              <input id="email" name="email" type="email" value={formData.email}
                onChange={handleChange} required autoComplete="email" className={inputClass} placeholder="you@company.com" />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'}
                  value={formData.password} onChange={handleChange} required className={`${inputClass} pr-14`}
                  placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CBD5E1]/50 hover:text-[#CBD5E1] transition text-xs">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>Confirm password <span className="text-red-400">*</span></label>
              <input id="confirmPassword" name="confirmPassword"
                type={showPassword ? 'text' : 'password'} value={formData.confirmPassword}
                onChange={handleChange} required className={inputClass} placeholder="Repeat password" />
            </div>

            {/* Password strength bar */}
            {formData.password.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className={`h-1 flex-1 rounded-full transition-all ${
                      formData.password.length >= n * 3
                        ? n <= 2 ? 'bg-red-500' : n === 3 ? 'bg-yellow-500' : 'bg-[#22C55E]'
                        : 'bg-[#CBD5E1]/10'
                    }`} />
                  ))}
                </div>
                <p className="text-[#CBD5E1]/50 text-xs">
                  {formData.password.length < 6 ? 'Too short'
                    : formData.password.length < 9 ? 'Weak'
                    : formData.password.length < 12 ? 'Good'
                    : 'Strong'}
                </p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 px-4 bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F14] font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-[#22C55E]/20 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#CBD5E1]/10 text-center">
            <p className="text-[#CBD5E1] text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#22C55E] hover:text-[#16A34A] font-medium transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-[#CBD5E1]/50 hover:text-[#CBD5E1] text-xs transition">
            ← Back to Marketing Tool
          </Link>
        </div>
      </div>
    </div>
  );
}
