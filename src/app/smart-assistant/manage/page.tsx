'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, register, saveAuth, getToken, getMe, clearAuth } from '@/features/smart_assistant/api';

type AuthMode = 'login' | 'register';

export default function ManageAssistantPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [checking, setChecking] = useState(true);

  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirm, setConfirm] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function redirectByRole(role: string) {
    if (role === 'superadmin') router.replace('/smart-assistant/manage/superadmin');
    else if (role === 'admin') router.replace('/smart-assistant/manage/admin');
    else router.replace('/smart-assistant');
  }

  // On mount: if already logged in, skip straight to dashboard
  useEffect(() => {
    const token = getToken();
    if (!token) { setChecking(false); return; }
    getMe()
      .then((u) => redirectByRole(u.role))
      .catch(() => { clearAuth(); setChecking(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        await register({ email, username, password, full_name: fullName });
        const authData = await login(email, password);
        saveAuth(authData);
        redirectByRole(authData.user.role);
      } else {
        const authData = await login(email, password);
        saveAuth(authData);
        redirectByRole(authData.user.role);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="sa-manage-loading">
        <div className="sa-spinner" />
        <span>Checking session…</span>
      </div>
    );
  }

  return (
    <div className="sa-manage-page">
      <div className="sa-manage-card">
        {/* Header */}
        <div className="sa-manage-header">
          <div className="sa-manage-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="sa-manage-title">Smart Assistant</h1>
          <p className="sa-manage-subtitle">
            {mode === 'login' ? 'Sign in to manage your assistant' : 'Create an admin account'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="sa-manage-tabs">
          <button
            className={`sa-manage-tab ${mode === 'login' ? 'sa-manage-tab--active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`sa-manage-tab ${mode === 'register' ? 'sa-manage-tab--active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="sa-manage-form">
          {error && <div className="sa-auth-error">{error}</div>}

          {mode === 'register' && (
            <>
              <label className="sa-auth-label">
                Full Name
                <input
                  type="text"
                  className="sa-auth-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                />
              </label>
              <label className="sa-auth-label">
                Username
                <input
                  type="text"
                  className="sa-auth-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="johndoe"
                  autoComplete="username"
                />
              </label>
            </>
          )}

          <label className="sa-auth-label">
            Email
            <input
              type="email"
              className="sa-auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="sa-auth-label">
            Password
            <input
              type="password"
              className="sa-auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              autoComplete="current-password"
            />
          </label>

          {mode === 'register' && (
            <label className="sa-auth-label">
              Confirm Password
              <input
                type="password"
                className="sa-auth-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                autoComplete="new-password"
              />
            </label>
          )}

          <button type="submit" className="sa-auth-btn" disabled={loading}>
            {loading
              ? mode === 'login' ? 'Signing in…' : 'Creating account…'
              : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
