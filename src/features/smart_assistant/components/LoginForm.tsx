'use client';

import { useState } from 'react';
import { login, saveAuth } from '../api';
import type { AuthUser } from '../types';

interface Props {
  onSuccess: (user: AuthUser) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      saveAuth(data);
      onSuccess(data.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sa-auth-form">
      <h2 className="sa-auth-title">Sign in to Smart Assistant</h2>
      <p className="sa-auth-subtitle">Enter your credentials to continue</p>

      {error && <div className="sa-auth-error">{error}</div>}

      <label className="sa-auth-label">
        Email
        <input
          type="email"
          className="sa-auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
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
          autoComplete="current-password"
          placeholder="••••••••"
          minLength={6}
        />
      </label>

      <button type="submit" className="sa-auth-btn" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <p className="sa-auth-switch">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitchToRegister} className="sa-auth-link">
          Create one
        </button>
      </p>
    </form>
  );
}
