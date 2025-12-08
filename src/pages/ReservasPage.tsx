/**
 * Página de Reservas
 */

import { useState } from 'react';
import { useReservas } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useUIStore } from '@/stores';
import { Card, Button, Spinner } from '@/components/ui';
import { Plus, Package, Search, Filter } from 'lucide-react';
import { ReservaTable } from '@/components/features/reservas/ReservaTable';
import { ReservaFilters } from '@/components/features/reservas/ReservaFilters';
import { ReservaModal } from '@/components/features/reservas/ReservaModal';
import { ROLES } from '@/constants';
import type { ReservaFilters as ReservaFiltersType } from '@/types';

export const ReservasPage = () => {
  const { user } = useAuthStore();
  const { openReservaModal } = useUIStore();
  const queryClient = useQueryClient();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ReservaFiltersType>({
    page: 1,
    limit: 20,
  });

  const { reservas, pagination, isLoading, error, refetch } = useReservas(filters);

  // Ambos roles pueden gestionar estados, pero con diferentes permisos
const canManageStatus = user?.role === ROLES.ADMIN_PRINCIPAL || user?.role === ROLES.USUARIO;

  const handleFilterChange = (newFilters: Partial<ReservaFiltersType>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset a página 1 cuando cambian filtros
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };  

const handleReservaSuccess = () => {
  queryClient.invalidateQueries({ queryKey: ['reservas'] });
  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
};

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Error al cargar reservas</p>
          <Button onClick={() => refetch()} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reservas</h1>
    <p className="text-sm sm:text-base text-gray-600 mt-1">
      Gestiona las reservas de libras del periodo activo
    </p>
  </div>
  <Button
  onClick={() => openReservaModal('create')}
  className="flex items-center gap-2 self-start"
>
  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
  <span>Nueva Reserva</span>
</Button>
</div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reservas</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination?.total || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {canManageStatus && (
          <>
            <Card padding="sm">
              <div>
                <p className="text-sm text-gray-600">Filtros activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(filters).filter(
                    (k) => k !== 'page' && k !== 'limit' && filters[k as keyof typeof filters]
                  ).length}
                </p>
              </div>
            </Card>
            <Card padding="sm">
              <div>
                <p className="text-sm text-gray-600">Página actual</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filters.page} / {pagination?.totalPages || 1}
                </p>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex items-center justify-between mb-4 gap-2">
  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
    <span className="hidden xs:inline">Buscar y Filtrar</span>
    <span className="xs:hidden">Filtros</span>
  </h3>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setShowFilters(!showFilters)}
    className="text-xs sm:text-sm"
  >
    <Filter className="w-4 h-4 mr-1 sm:mr-2" />
    <span className="hidden sm:inline">{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
    <span className="sm:hidden">{showFilters ? 'Ocultar' : 'Mostrar'}</span>
  </Button>
</div>

        {showFilters && (
          <ReservaFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            isAdmin={canManageStatus}
          />
        )}
      </Card>

      {/* Tabla */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : reservas.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
  <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
    No hay reservas
  </h3>
  <p className="text-sm sm:text-base text-gray-600 mb-4">
    Comienza creando tu primera reserva
  </p>
  <Button onClick={() => openReservaModal('create')} className="w-full sm:w-auto">
    <Plus className="w-4 h-4 mr-2" />
    Nueva Reserva
  </Button>
</div>
        ) : (
          <ReservaTable
  reservas={reservas}
  pagination={pagination}
  onPageChange={handlePageChange}
  isAdmin={canManageStatus}
  currentUserId={user?.id}
/>
        )}
      </Card>

      {/* Modal */}
      <ReservaModal onSuccess={handleReservaSuccess} />
    </div>
  );
};