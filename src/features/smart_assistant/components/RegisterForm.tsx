'use client';

import { useState } from 'react';
import { register, login, saveAuth } from '../api';
import type { AuthUser } from '../types';

interface Props {
  onSuccess: (user: AuthUser) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: Props) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({ email, username, password, full_name: fullName });
      // auto-login after registration
      const authData = await login(email, password);
      saveAuth(authData);
      onSuccess(authData.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sa-auth-form">
      <h2 className="sa-auth-title">Create an Account</h2>
      <p className="sa-auth-subtitle">Sign up to start using Smart Assistant</p>

      {error && <div className="sa-auth-error">{error}</div>}

      <label className="sa-auth-label">
        Full Name
        <input
          type="text"
          className="sa-auth-input"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          autoComplete="name"
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
          autoComplete="new-password"
        />
      </label>

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

      <button type="submit" className="sa-auth-btn" disabled={loading}>
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="sa-auth-switch">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="sa-auth-link">
          Sign in
        </button>
      </p>
    </form>
  );
}
