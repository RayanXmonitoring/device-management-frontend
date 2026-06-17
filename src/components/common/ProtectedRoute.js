'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Loading from './Loading';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && isAuthenticated && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.includes(user?.role);
      if (!hasRequiredRole) {
        router.push('/dashboard');
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, router, requiredRoles]);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
