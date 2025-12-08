/**
 * Filtros de Reportes
 */

import { Input, Button } from '@/components/ui';
import { X, Download, FileText } from 'lucide-react';
import type { ReportesFilters } from '@/types';

interface ReportesFiltersProps {
  filters: ReportesFilters;
  onFilterChange: (filters: Partial<ReportesFilters>) => void;
  onClearFilters: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  isExporting?: boolean;
}

export const ReportesFiltersComponent = ({
  filters,
  onFilterChange,
  onClearFilters,
  onExportExcel,
  onExportPDF,
  isExporting = false,
}: ReportesFiltersProps) => {
  const hasActiveFilters = !!(filters.startDate || filters.endDate);

  return (
  <div className="space-y-3 sm:space-y-4">
    {/* Filtros de fecha */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <Input
        type="date"
        label="Fecha Desde"
        value={filters.startDate || ''}
        onChange={(e) => onFilterChange({ startDate: e.target.value })}
      />

      <Input
        type="date"
        label="Fecha Hasta"
        value={filters.endDate || ''}
        onChange={(e) => onFilterChange({ endDate: e.target.value })}
      />
    </div>

    {/* Botones de acción */}
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      {hasActiveFilters && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center justify-center gap-2 text-xs sm:text-sm py-1.5 sm:py-2"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Limpiar Filtros</span>
        </Button>
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={onExportExcel}
        isLoading={isExporting}
        className="flex items-center justify-center gap-2 text-xs sm:text-sm py-1.5 sm:py-2"
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>Exportar Excel</span>
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={onExportPDF}
        isLoading={isExporting}
        className="flex items-center justify-center gap-2 text-xs sm:text-sm py-1.5 sm:py-2"
      >
        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>Exportar PDF</span>
      </Button>
    </div>
  </div>
);
};