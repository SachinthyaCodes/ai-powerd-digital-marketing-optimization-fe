'use client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route protection wrapper.
 * Currently a pass-through because the backend has no auth endpoints.
 * Re-enable auth checks here once auth is implemented on the backend.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}

/**
 * Higher-order component version — also a pass-through for now.
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    return <Component {...props} />;
  };
}