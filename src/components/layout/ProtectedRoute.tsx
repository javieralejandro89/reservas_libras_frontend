/**
 * Componente ProtectedRoute
 * Solo permite acceso si el usuario está autenticado
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/constants';
import { Spinner } from '@/components/ui';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};