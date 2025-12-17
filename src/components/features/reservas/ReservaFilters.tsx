/**
 * Componente de Filtros de Reservas
 */

import { Select, Input, Button } from '@/components/ui';
import { STATUS_RESERVA, STATUS_LABELS } from '@/constants';
import type { ReservaFilters as ReservaFiltersType } from '@/types';
import { X } from 'lucide-react';
import type { StatusReserva } from '@/types';
import { useUsers } from '@/hooks';

interface ReservaFiltersComponentProps {
  filters: ReservaFiltersType;
  onFilterChange: (filters: Partial<ReservaFiltersType>) => void;
  isAdmin: boolean;
  currentUserId?: number;
}

export const ReservaFilters = ({ 
  filters, 
  onFilterChange, 
  isAdmin,
  currentUserId 
}: ReservaFiltersComponentProps) => {
  // Obtener lista de usuarios (solo si es admin)
  const { users } = useUsers(isAdmin ? {} : undefined);
  
  // Filtrar usuarios que tienen reservas
  const usersWithReservas = users.filter(user => user.id !== currentUserId);
  const hasActiveFilters = 
    filters.status || 
    filters.userId ||
    filters.startDate || 
    filters.endDate;

  const clearFilters = () => {
    onFilterChange({
      status: undefined,
      userId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };
  

  return (
  <div className="space-y-4 w-full overflow-hidden">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {/* Status */}
        <Select
          label="Estado de Reserva"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: (e.target.value || undefined) as StatusReserva | undefined })}
          options={[
            { value: '', label: 'Todos los estados' },
            ...Object.values(STATUS_RESERVA).map((status) => ({
              value: status,
              label: STATUS_LABELS[status],
            })),
          ]}
        />

        {/* Filtro de Usuario (solo para admin) */}
        {isAdmin && (
          <Select
            label="Usuario"
            value={filters.userId?.toString() || ''}
            onChange={(e) => onFilterChange({ 
              userId: e.target.value ? parseInt(e.target.value, 10) : undefined 
            })}
            options={[
              { value: '', label: 'Todos los usuarios' },
              ...usersWithReservas.map((user) => ({
                value: user.id.toString(),
                label: user.name,
              })),
            ]}
          />
        )}

        {/* Fecha inicio */}
        <Input
          type="date"
          label="Desde"
          value={filters.startDate || ''}
          onChange={(e) => onFilterChange({ startDate: e.target.value || undefined })}
        />

        {/* Fecha fin */}
        <Input
          type="date"
          label="Hasta"
          value={filters.endDate || ''}
          onChange={(e) => onFilterChange({ endDate: e.target.value || undefined })}
        />
      </div>

      {/* Limpiar filtros */}
      {hasActiveFilters && (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-2 border-t">
    <p className="text-xs sm:text-sm text-gray-600">
      Filtros activos aplicados
    </p>
    <Button
      variant="ghost"
      size="sm"
      onClick={clearFilters}
      className="self-start sm:self-auto"
    >
      <X className="w-4 h-4 mr-1 sm:mr-2" />
      <span className="text-xs sm:text-sm">Limpiar Filtros</span>
    </Button>
  </div>
)}
    </div>
  );
};