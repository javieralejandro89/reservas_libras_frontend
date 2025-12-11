/**
 * Página de Histórico de Periodos Cerrados
 */

import { useState } from 'react';
import { useDashboard } from '@/hooks';
import { Card, Spinner, Badge, Button } from '@/components/ui';
import { Calendar, Package, AlertCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, formatLibras, formatPercentage } from '@/utils/format';
import { HistoricoReservasTable } from '@/components/features/historico/HistoricoReservasTable';
import { HistoricoFiltersComponent } from '@/components/features/historico/HistoricoFilters';
import type { HistoricoPeriodo, HistoricoFilters } from '@/types';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export const HistoricoPage = () => {
  const [filters, setFilters] = useState<HistoricoFilters>({
    page: 1,
    limit: 10,
    orderBy: 'fechaArchivado',
    orderDirection: 'desc',
  });

  const { history, pagination, isLoadingHistory, errorHistory, refetchHistory } = useDashboard(filters);
  const [expandedPeriodo, setExpandedPeriodo] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleFilterChange = (newFilters: Partial<HistoricoFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset a página 1 cuando cambian los filtros
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      orderBy: 'fechaArchivado',
      orderDirection: 'desc',
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleTogglePeriodo = (periodoId: number) => {
    setExpandedPeriodo(expandedPeriodo === periodoId ? null : periodoId);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Obtener TODOS los periodos sin paginación
      const response = await fetch('/api/dashboard/history?limit=1000', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();
      const allPeriodos = data.data || [];

      // Preparar datos para Excel
      const excelData = allPeriodos.map((periodo: HistoricoPeriodo) => ({
        'ID': periodo.id,
        'Fecha de Envío': formatDate(periodo.fechaEnvio),
        'Fecha Archivado': formatDate(periodo.fechaArchivado),
        'Libras Totales': periodo.librasTotales,
        'Libras Reservadas': parseFloat(periodo.librasReservadas),
        'Libras Disponibles': parseFloat(periodo.librasDisponibles),
        'Ocupación (%)': ((parseFloat(periodo.librasReservadas) / periodo.librasTotales) * 100).toFixed(2),
        'Total Reservas': periodo.totalReservas,
        'Total Usuarios': periodo.totalUsuarios,
      }));

      // Crear libro de Excel
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Histórico de Periodos');

      // Descargar archivo
      const fecha = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `historico-periodos-${fecha}.xlsx`);

      toast.success('Archivo exportado correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar archivo');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (errorHistory) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Error al cargar histórico</p>
          <Button onClick={() => refetchHistory()} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const periodos = (history as HistoricoPeriodo[]) || [];
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Histórico de Periodos
        </h1>
        <p className="text-gray-600 mt-1">
          Periodos cerrados y reservas archivadas
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <HistoricoFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </Card>

      {/* Información de resultados */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-600">
            Mostrando {((currentPage - 1) * (filters.limit || 10)) + 1} a {Math.min(currentPage * (filters.limit || 10), total)} de {total} periodos
          </p>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Por página:</label>
            <select
              value={filters.limit || 10}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      )}

      {/* Alerta si no hay histórico */}
      {periodos.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">
                No hay periodos cerrados
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Los periodos cerrados aparecerán aquí con todas sus reservas archivadas.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de periodos históricos */}
      <div className="space-y-4">
        {periodos.map((periodo) => {
          const isExpanded = expandedPeriodo === periodo.id;
          const porcentaje = (parseFloat(periodo.librasReservadas) / periodo.librasTotales) * 100;

          return (
            <Card key={periodo.id} className="bg-gray-50 border-gray-300">
              {/* Header del periodo */}
              <button
                onClick={() => handleTogglePeriodo(periodo.id)}
                className="w-full text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-200 rounded-lg">
                      <Calendar className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-gray-600 text-white">CERRADO</Badge>
                        <span className="text-sm text-gray-600">Periodo #{periodo.id}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Envío: {formatDate(periodo.fechaEnvio)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Archivado: {formatDate(periodo.fechaArchivado)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {periodo.librasTotales.toLocaleString()} lbs
                      </p>
                      <p className="text-xs text-gray-600">Capacidad total</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>

                {/* Estadísticas en resumen */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-gray-600">Reservadas</p>
                    </div>
                    <p className="text-sm font-bold text-blue-600">
                      {formatLibras(periodo.librasReservadas)}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-gray-600">Disponibles</p>
                    </div>
                    <p className="text-sm font-bold text-green-600">
                      {formatLibras(periodo.librasDisponibles)}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Reservas</p>
                    <p className="text-sm font-bold text-gray-900">
                      {periodo.totalReservas}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Usuarios</p>
                    <p className="text-sm font-bold text-gray-900">
                      {periodo.totalUsuarios}
                    </p>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Ocupación</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatPercentage(porcentaje)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-gray-700 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(porcentaje, 100)}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Tabla de reservas (expandible) */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Reservas Archivadas ({periodo.totalReservas})
                  </h4>
                  <HistoricoReservasTable periodoHistoricoId={periodo.id} />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <Card>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                Primera
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="px-4 py-2 text-sm font-medium">
                {currentPage}
              </span>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Última
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};