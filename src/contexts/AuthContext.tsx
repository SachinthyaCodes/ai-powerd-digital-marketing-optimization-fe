'use client';

/**
 * Authentication Context Provider
 * Manages authentication state across the application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  UserRole, 
  LoginCredentials, 
  RegisterData, 
  AuthContextType 
} from '@/types/auth';
import { authService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid
          try {
            const currentUser = await authService.getCurrentUser(storedToken);
            setUser(currentUser);
            localStorage.setItem('auth_user', JSON.stringify(currentUser));
          } catch (error) {
            // Token invalid, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      
      setToken(response.access_token);
      setUser(response.user);
      
      // Store in localStorage
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      // Redirect based on role
      redirectToRoleDashboard(response.user.role);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await authService.register(data);
      // After registration, auto-login
      await login({ email: data.email, password: data.password });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    if (token) {
      authService.logout(token).catch(console.error);
    }
    
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    router.push('/auth/login');
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;

    const roleHierarchy = {
      [UserRole.USER]: 1,
      [UserRole.ADMIN]: 2,
      [UserRole.SUPERADMIN]: 3,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const redirectToRoleDashboard = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPERADMIN:
        router.push('/auth/superadmin-dashboard');
        break;
      case UserRole.ADMIN:
        router.push('/auth/admin-dashboard');
        break;
      case UserRole.USER:
        router.push('/auth/user-dashboard');
        break;
      default:
        router.push('/');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
