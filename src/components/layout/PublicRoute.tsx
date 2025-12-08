/**
 * Componente PublicRoute
 * Redirige al dashboard si el usuario ya está autenticado
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/constants';

export const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};