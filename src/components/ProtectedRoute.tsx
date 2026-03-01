'use client';

/**
 * Protected Route Component
 * Restricts access based on authentication and role
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (requiredRole && !hasRole(requiredRole)) {
        // Redirect to appropriate dashboard based on user's role
        if (user?.role === UserRole.USER) {
          router.push('/auth/user-dashboard');
        } else if (user?.role === UserRole.ADMIN) {
          router.push('/auth/admin-dashboard');
        } else {
          router.push('/');
        }
      }
    }
  }, [isAuthenticated, hasRole, loading, requiredRole, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (requiredRole && !hasRole(requiredRole))) {
    return null;
  }

  return <>{children}</>;
}
