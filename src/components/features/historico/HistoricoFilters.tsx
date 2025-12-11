/**
 * Filtros de Histórico
 */

import { Input, Select, Button } from '@/components/ui';
import { X, Download } from 'lucide-react';
import type { HistoricoFilters } from '@/types';

interface HistoricoFiltersProps {
  filters: HistoricoFilters;
  onFilterChange: (filters: Partial<HistoricoFilters>) => void;
  onClearFilters: () => void;
  onExport: () => void;
  isExporting?: boolean;
}

export const HistoricoFiltersComponent = ({
  filters,
  onFilterChange,
  onClearFilters,
  onExport,
  isExporting = false,
}: HistoricoFiltersProps) => {
  const hasActiveFilters = !!(
    filters.startDate ||
    filters.endDate ||
    filters.orderBy !== 'fechaArchivado' ||
    filters.orderDirection !== 'desc'
  );

  return (
    <div className="space-y-4">
      {/* Fila 1: Filtros de fecha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="date"
          label="Desde"
          value={filters.startDate || ''}
          onChange={(e) => onFilterChange({ startDate: e.target.value })}
        />

        <Input
          type="date"
          label="Hasta"
          value={filters.endDate || ''}
          onChange={(e) => onFilterChange({ endDate: e.target.value })}
        />

        <Select
          label="Ordenar por"
          value={filters.orderBy || 'fechaArchivado'}
          onChange={(e) => onFilterChange({ orderBy: e.target.value as 'fechaArchivado' | 'fechaEnvio' | 'librasTotales' | 'totalReservas' })}
          options={[
            { value: 'fechaArchivado', label: 'Fecha de Archivo' },
            { value: 'fechaEnvio', label: 'Fecha de Envío' },
            { value: 'librasTotales', label: 'Libras Totales' },
            { value: 'totalReservas', label: 'Total Reservas' },
          ]}
        />

        <Select
          label="Dirección"
          value={filters.orderDirection || 'desc'}
          onChange={(e) => onFilterChange({ orderDirection: e.target.value as 'asc' | 'desc' })}
          options={[
            { value: 'desc', label: 'Descendente' },
            { value: 'asc', label: 'Ascendente' },
          ]}
        />
      </div>

      {/* Fila 2: Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3">
        {hasActiveFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Limpiar Filtros
          </Button>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={onExport}
          isLoading={isExporting}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar a Excel
        </Button>
      </div>
    </div>
  );
};