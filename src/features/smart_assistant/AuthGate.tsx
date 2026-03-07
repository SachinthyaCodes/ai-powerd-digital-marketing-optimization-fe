'use client';

import { useState, useEffect, useCallback } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { getToken, getMe, clearAuth } from './api';
import type { AuthUser } from './types';

interface Props {
  children: (user: AuthUser, onLogout: () => void) => React.ReactNode;
}

/**
 * Self-contained auth gate for Smart Assistant.
 * Shows login/register if no valid token; otherwise renders children with user data.
 */
export default function AuthGate({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setChecking(false);
      return;
    }
    getMe()
      .then((u) => setUser(u))
      .catch(() => clearAuth())
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = useCallback(() => {
    clearAuth();
    setUser(null);
    setMode('login');
  }, []);

  if (checking) {
    return (
      <div className="sa-auth-loading">
        <div className="sa-spinner" />
        <span>Checking authentication…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="sa-auth-wrapper">
        <div className="sa-auth-card">
          <div className="sa-auth-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>Smart Assistant</span>
          </div>

          {mode === 'login' ? (
            <LoginForm
              onSuccess={(u) => setUser(u)}
              onSwitchToRegister={() => setMode('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={(u) => setUser(u)}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </div>
      </div>
    );
  }

  return <>{children(user, handleLogout)}</>;
}
