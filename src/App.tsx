/**
 * App Principal con Router
 */

import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/constants';

// Layouts
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { MainLayout } from '@/components/layout/MainLayout';

// Pages 
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ReservasPage } from '@/pages/ReservasPage';
import { PeriodosPage } from '@/pages/PeriodosPage';
import { UsuariosPage } from '@/pages/UsuariosPage';
import { HistoricoPage } from '@/pages/HistoricoPage';
import { ReportesPage } from '@/pages/ReportesPage';
import { ProfilePage } from '@/pages/ProfilePage';

function App() {
  const { initAuth } = useAuthStore();

  // Inicializar autenticación al montar
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      {/* Rutas públicas (redirigen si ya estás autenticado) */}
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />        
      </Route>

      {/* Rutas protegidas (requieren autenticación) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.RESERVAS} element={<ReservasPage />} />
          <Route path={ROUTES.PERIODOS} element={<PeriodosPage />} />
          <Route path={ROUTES.REPORTES} element={<ReportesPage />} />
          <Route path={ROUTES.USUARIOS} element={<UsuariosPage />} />
          <Route path={ROUTES.HISTORICO} element={<HistoricoPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Ruta por defecto */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      
      {/* 404 */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}

export default App;