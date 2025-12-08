/**
 * Página de Usuarios (Solo Admin Principal)
 */

import { useState } from 'react';
import { useUsers } from '@/hooks';
import { useAuthStore, useUIStore } from '@/stores';
import { Card, Button, Spinner } from '@/components/ui';
import { Plus, Users, UserCheck, UserX, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { UsuarioTable } from '@/components/features/usuarios/UsuarioTable';
import { UsuarioModal } from '@/components/features/usuarios/UsuarioModal';
import { UsuariosFilters } from '@/components/features/usuarios/UsuariosFilters';
import { ConfirmModalWrapper } from '@/components/features/ConfirmModalWrapper';
import { ROLES } from '@/constants';
import { Navigate } from 'react-router-dom';
import type { UserFilters } from '@/types';

export const UsuariosPage = () => {
  const { user } = useAuthStore();
  const { openUserModal } = useUIStore();
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 20,
  });

  const { users, pagination, isLoading, error } = useUsers(filters);

  // Solo admin principal puede acceder
  if (user?.role !== ROLES.ADMIN_PRINCIPAL) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Calcular estadísticas
  const totalActivos = users.filter((u) => u.isActive).length;
  const totalInactivos = users.filter((u) => !u.isActive).length;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Error al cargar usuarios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
  <div>
    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
      Gestión de Usuarios
    </h1>
    <p className="text-xs sm:text-base text-gray-600 mt-0.5 sm:mt-1">
      Administra usuarios y permisos del sistema
    </p>
  </div>
  <Button
    onClick={() => openUserModal('create')}
    className="flex items-center justify-center gap-2 self-start shadow-lg hover:shadow-xl transition-shadow duration-200 text-sm sm:text-base py-1.5 sm:py-2"
  >
    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
    <span>Nuevo Usuario</span>
  </Button>
</div>

      {/* Cards de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
        {/* Total Usuarios */}
        <Card padding="sm" className="hover:shadow-lg transition-shadow duration-200">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs sm:text-sm text-gray-600">Total Usuarios</p>
      <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
        {pagination?.total || 0}
      </p>
    </div>
    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
      <Users className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
    </div>
  </div>
</Card>

        {/* Usuarios Activos */}
        <Card padding="sm" className="hover:shadow-lg transition-shadow duration-200">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs sm:text-sm text-gray-600">Activos</p>
      <p className="text-xl sm:text-3xl font-bold text-green-600 mt-0.5 sm:mt-1">
        {totalActivos}
      </p>
    </div>
    <div className="p-2 sm:p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
      <UserCheck className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" />
    </div>
  </div>
</Card>

        {/* Usuarios Inactivos */}
        <Card padding="sm" className="hover:shadow-lg transition-shadow duration-200">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs sm:text-sm text-gray-600">Inactivos</p>
      <p className="text-xl sm:text-3xl font-bold text-red-600 mt-0.5 sm:mt-1">
        {totalInactivos}
      </p>
    </div>
    <div className="p-2 sm:p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-lg">
      <UserX className="w-5 h-5 sm:w-7 sm:h-7 text-red-600" />
    </div>
  </div>
</Card>
      </div>

      {/* Filtros */}
      <UsuariosFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Tabla de Usuarios */}
      <Card padding="none">
        <div className="px-3 sm:px-6 py-2 sm:py-4 border-b border-gray-200">
  <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
    Lista de Usuarios
  </h3>
  {pagination && (
    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
      Mostrando {users.length} de {pagination.total} usuarios
    </p>
  )}
</div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
  <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
  <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1.5 sm:mb-2">
    No hay usuarios
  </h3>
  <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-4">
    {filters.search || filters.role || filters.isActive !== undefined
      ? 'No se encontraron usuarios con los filtros aplicados'
      : 'Crea el primer usuario para comenzar'}
  </p>
  {!filters.search && !filters.role && filters.isActive === undefined && (
    <Button onClick={() => openUserModal('create')} className="w-full sm:w-auto text-sm sm:text-base py-1.5 sm:py-2">
      <Plus className="w-4 h-4 mr-2" />
      Nuevo Usuario
    </Button>
  )}
</div>
        ) : (
          <>
            <UsuarioTable usuarios={users} />

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-3 sm:px-6 py-2 sm:py-4 border-t border-gray-200 flex items-center justify-between">
  <div className="text-xs sm:text-sm text-gray-700">
    Página <span className="font-medium">{pagination.page}</span> de{' '}
    <span className="font-medium">{pagination.totalPages}</span>
  </div>
  <div className="flex gap-1 sm:gap-2">
    <Button
      variant="secondary"
      size="sm"
      onClick={() => handlePageChange(pagination.page - 1)}
      disabled={pagination.page === 1}
      className="hover:scale-105 transition-transform p-1 sm:p-2"
    >
      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </Button>
    <Button
      variant="secondary"
      size="sm"
      onClick={() => handlePageChange(pagination.page + 1)}
      disabled={pagination.page === pagination.totalPages}
      className="hover:scale-105 transition-transform p-1 sm:p-2"
    >
      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </Button>
  </div>
</div>
            )}
          </>
        )}
      </Card>

      {/* Modal */}
      <UsuarioModal />
      <ConfirmModalWrapper />
    </div>
  );
};