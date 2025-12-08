/**
 * Componente de Filtros de Reservas
 */

import { Select, Input, Button } from '@/components/ui';
import { STATUS_RESERVA, STATUS_LABELS, ESTADOS_MEXICO } from '@/constants';
import type { ReservaFilters as ReservaFiltersType } from '@/types';
import { X } from 'lucide-react';
import type { StatusReserva } from '@/types';

interface ReservaFiltersComponentProps {
  filters: ReservaFiltersType;
  onFilterChange: (filters: Partial<ReservaFiltersType>) => void;
  isAdmin: boolean;
}

export const ReservaFilters = ({ filters, onFilterChange }: ReservaFiltersComponentProps) => {
  const hasActiveFilters = 
    filters.status || 
    filters.estado || 
    filters.startDate || 
    filters.endDate;

  const clearFilters = () => {
    onFilterChange({
      status: undefined,
      estado: undefined,
      startDate: undefined,
      endDate: undefined,
      userId: undefined,
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

        {/* Estado (ubicación) */}
        <Select
          label="Estado (ubicación)"
          value={filters.estado || ''}
          onChange={(e) => onFilterChange({ estado: e.target.value || undefined })}
          options={[
            { value: '', label: 'Todos los estados' },
            ...ESTADOS_MEXICO.map((estado) => ({
              value: estado,
              label: estado,
            })),
          ]}
        />

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