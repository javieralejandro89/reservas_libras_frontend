/**
 * Página de Periodos (Solo Admin Principal)
 */

import { useState } from 'react';
import { usePeriodos } from '@/hooks';
import { useAuthStore, useUIStore } from '@/stores';
import { Card, Button, Spinner } from '@/components/ui';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { PeriodoTable } from '@/components/features/periodos/PeriodoTable';
import { PeriodoModal } from '@/components/features/periodos/PeriodoModal';
import { PeriodoActivo } from '@/components/features/periodos/PeriodoActivo';
import { ConfirmModalWrapper } from '@/components/features/ConfirmModalWrapper';
import { ROLES } from '@/constants';
import { Navigate } from 'react-router-dom';
import type { PeriodoFilters } from '@/types';

export const PeriodosPage = () => {
  const { user } = useAuthStore();
  const { openPeriodoModal } = useUIStore();
  const [filters] = useState<PeriodoFilters>({
    page: 1,
    limit: 20,
  });

  const { periodos, periodoActivo, isLoading, error } = usePeriodos(filters);

  // Solo admin principal puede acceder
  if (user?.role !== ROLES.ADMIN_PRINCIPAL) {
    return <Navigate to="/dashboard" replace />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Error al cargar periodos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
  <div>
    <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Periodos</h1>
    <p className="text-xs sm:text-base text-gray-600 mt-0.5 sm:mt-1">
      Gestiona periodos y libras disponibles
    </p>
  </div>
  <Button
    onClick={() => openPeriodoModal('create')}
    className="flex items-center gap-1.5 self-start text-sm sm:text-base py-1.5 sm:py-2"
  >
    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
    <span>Nuevo Periodo</span>
  </Button>
</div>

      {/* Periodo Activo */}
      {periodoActivo && <PeriodoActivo periodo={periodoActivo} />}

      {/* Alerta si no hay periodo activo */}
      {!periodoActivo && !isLoading && (
        <Card className="bg-yellow-50 border-yellow-200" padding="sm">
  <div className="flex items-start gap-2">
    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
    <div>
      <h3 className="text-sm sm:text-base font-semibold text-yellow-900">
        No hay periodo activo
      </h3>
      <p className="text-xs sm:text-sm text-yellow-700 mt-0.5 sm:mt-1">
        Los usuarios no podrán crear reservas hasta activar un periodo.
      </p>
    </div>
  </div>
</Card>
      )}

      {/* Stats rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
  <Card padding="sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm text-gray-600">Total Periodos</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">
          {periodos.length}
        </p>
      </div>
      <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
      </div>
    </div>
  </Card>

  <Card padding="sm">
    <div>
      <p className="text-xs sm:text-sm text-gray-600">Periodo Activo</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-900">
        {periodoActivo ? 'Sí' : 'No'}
      </p>
    </div>
  </Card>

  {periodoActivo && (
    <Card padding="sm">
      <div>
        <p className="text-xs sm:text-sm text-gray-600">Libras Disponibles</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">
          {parseFloat(periodoActivo.librasDisponibles).toLocaleString()}
        </p>
      </div>
    </Card>
  )}
</div>

      {/* Tabla de periodos */}
      <Card padding="none">
        <div className="px-2 sm:px-6 py-2 sm:py-4 border-b border-gray-200">
  <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
    Historial de Periodos
  </h3>
</div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : periodos.length === 0 ? (
          <div className="text-center py-6 sm:py-12 px-3 sm:px-4">
  <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
  <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1.5 sm:mb-2">
    No hay periodos
  </h3>
  <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-4">
    Crea el primer periodo para comenzar
  </p>
  <Button onClick={() => openPeriodoModal('create')} className="w-full sm:w-auto text-sm sm:text-base py-1.5 sm:py-2">
    <Plus className="w-4 h-4 mr-2" />
    Nuevo Periodo
  </Button>
</div>
        ) : (
          <PeriodoTable periodos={periodos} />
        )}
      </Card>

      {/* Modal */}
      <PeriodoModal />
      <ConfirmModalWrapper />
    </div>
  );
};