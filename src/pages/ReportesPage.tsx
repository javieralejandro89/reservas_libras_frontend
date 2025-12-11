/**
 * Página de Reportes Avanzados
 */

import { useState } from 'react';
import { useReportes } from '@/hooks';
import { Card, Spinner, Badge } from '@/components/ui';
import { AlertCircle, TrendingDown } from 'lucide-react';
import { formatLibras } from '@/utils/format';
import { ReportesFiltersComponent } from '@/components/features/reportes/ReportesFilters';
import { ResumenCards } from '@/components/features/reportes/ResumenCards';
import { GraficaBarras } from '@/components/features/reportes/GraficaBarras';
import type { ReportesFilters } from '@/types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

// Extender tipo de jsPDF para autoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export const ReportesPage = () => {
  const [filters, setFilters] = useState<ReportesFilters>({});
  const { reportes, isLoading, error } = useReportes(filters);
  const [isExporting, setIsExporting] = useState(false);

  const handleFilterChange = (newFilters: Partial<ReportesFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleExportExcel = () => {
    if (!reportes) return;

    try {
      setIsExporting(true);

      const wb = XLSX.utils.book_new();

      // Hoja 1: Resumen
      const resumenData = [
        ['RESUMEN GLOBAL'],
        [''],
        ['Total Libras', reportes.resumen.totalLibrasGlobal],
        ['Total Reservas', reportes.resumen.totalReservasGlobal],
        ['Usuarios Únicos', reportes.resumen.totalUsuariosUnicos],
        ['Total Periodos', reportes.resumen.totalPeriodos],
        ['Promedio por Usuario', reportes.resumen.promedioLibrasPorUsuario],
        ['Promedio por Periodo', reportes.resumen.promedioLibrasPorPeriodo],
      ];
      const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

      // Hoja 2: Por Usuario
      const usuariosData = reportes.porUsuario.map(u => ({
        'Usuario': u.userName,
        'Email': u.userEmail,
        'Total Libras': parseFloat(u.totalLibras),
        'Total Reservas': u.totalReservas,
        'Periodos': u.periodoCount,
        '% del Total': u.porcentajeDelTotal.toFixed(2) + '%',
      }));
      const wsUsuarios = XLSX.utils.json_to_sheet(usuariosData);
      XLSX.utils.book_append_sheet(wb, wsUsuarios, 'Por Usuario');

      // Hoja 3: Por Mes
      const mesesData = reportes.porMes.map(m => ({
        'Mes': m.mes,
        'Año': m.year,
        'Total Libras': parseFloat(m.totalLibras),
        'Total Reservas': m.totalReservas,
        'Usuarios': m.totalUsuarios,
        'Periodos': m.periodos,
      }));
      const wsMeses = XLSX.utils.json_to_sheet(mesesData);
      XLSX.utils.book_append_sheet(wb, wsMeses, 'Por Mes');

      // Hoja 4: Por Periodo
      const periodosData = reportes.porPeriodo.map(p => ({
        'ID': p.periodoId,
        'Fecha de Envío': p.fechaEnvio,
        'Libras Totales': p.librasTotales,
        'Libras Reservadas': parseFloat(p.librasReservadas),
        'Ocupación %': p.porcentajeOcupacion.toFixed(2),
        'Total Reservas': p.totalReservas,
        'Usuarios': p.totalUsuarios,
      }));
      const wsPeriodos = XLSX.utils.json_to_sheet(periodosData);
      XLSX.utils.book_append_sheet(wb, wsPeriodos, 'Por Periodo');

      // Hoja 5: Por Estado
      const estadosData = reportes.porEstado.map(e => ({
        'Estado': e.estado,
        'Total Libras': parseFloat(e.totalLibras),
        'Total Reservas': e.totalReservas,
        'Usuarios': e.totalUsuarios,
        '% del Total': e.porcentajeDelTotal.toFixed(2) + '%',
      }));
      const wsEstados = XLSX.utils.json_to_sheet(estadosData);
      XLSX.utils.book_append_sheet(wb, wsEstados, 'Por Estado');

      const fecha = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `reportes-completos-${fecha}.xlsx`);

      toast.success('Reporte Excel generado correctamente');
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      toast.error('Error al generar reporte Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = () => {
    if (!reportes) return;

    try {
      setIsExporting(true);

      const doc = new jsPDF();
      const fecha = new Date().toLocaleDateString('es-MX');

      // Título
      doc.setFontSize(18);
      doc.text('Reporte de Estadísticas', 14, 20);
      doc.setFontSize(11);
      doc.text(`Generado: ${fecha}`, 14, 28);

      let yPos = 40;

      // Resumen
      doc.setFontSize(14);
      doc.text('Resumen Global', 14, yPos);
      yPos += 10;

      autoTable(doc, {
        startY: yPos,
        head: [['Métrica', 'Valor']],
        body: [
          ['Total Libras', formatLibras(reportes.resumen.totalLibrasGlobal)],
          ['Total Reservas', reportes.resumen.totalReservasGlobal.toString()],
          ['Usuarios Únicos', reportes.resumen.totalUsuariosUnicos.toString()],
          ['Total Periodos', reportes.resumen.totalPeriodos.toString()],
          ['Promedio por Usuario', formatLibras(reportes.resumen.promedioLibrasPorUsuario)],
          ['Promedio por Periodo', formatLibras(reportes.resumen.promedioLibrasPorPeriodo)],
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      });

      yPos = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

      // Top 10 Usuarios
      doc.setFontSize(14);
      doc.text('Top 10 Usuarios', 14, yPos);
      yPos += 10;

      autoTable(doc, {
        startY: yPos,
        head: [['Usuario', 'Libras', 'Reservas', '% Total']],
        body: reportes.porUsuario.slice(0, 10).map(u => [
          u.userName,
          formatLibras(u.totalLibras),
          u.totalReservas.toString(),
          u.porcentajeDelTotal.toFixed(2) + '%',
        ]),
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Nueva página para más datos
      doc.addPage();
      yPos = 20;

      // Por Mes
      doc.setFontSize(14);
      doc.text('Resumen Mensual', 14, yPos);
      yPos += 10;

      autoTable(doc, {
        startY: yPos,
        head: [['Mes', 'Año', 'Libras', 'Reservas', 'Usuarios']],
        body: reportes.porMes.map(m => [
          m.mes,
          m.year.toString(),
          formatLibras(m.totalLibras),
          m.totalReservas.toString(),
          m.totalUsuarios.toString(),
        ]),
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      });

      const fechaArchivo = new Date().toISOString().split('T')[0];
      doc.save(`reporte-estadisticas-${fechaArchivo}.pdf`);

      toast.success('Reporte PDF generado correctamente');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      toast.error('Error al generar reporte PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !reportes) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Error al cargar reportes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
<div>
  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
    Reportes y Estadísticas
  </h1>
  <p className="text-xs sm:text-base text-gray-600 mt-0.5 sm:mt-1">
    Análisis detallado de reservas históricas
  </p>
</div>

      {/* Filtros */}
      <Card>
        <ReportesFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          isExporting={isExporting}
        />
      </Card>

      {/* Resumen Global */}
      <ResumenCards resumen={reportes.resumen} />

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        {/* Top 10 Usuarios */}
        <Card>
          <GraficaBarras
            title="Top 10 Usuarios (Más Libras)"
            data={reportes.porUsuario.slice(0, 10).map(u => ({
              label: u.userName,
              value: parseFloat(u.totalLibras),
              color: 'bg-blue-600',
            }))}
            maxValue={reportes.porUsuario.length > 0 ? parseFloat(reportes.porUsuario[0].totalLibras) : 0}
          />
        </Card>

        {/* Top Estados */}
        <Card>
          <GraficaBarras
            title="Top 10 Estados (Más Libras)"
            data={reportes.porEstado.slice(0, 10).map(e => ({
              label: e.estado,
              value: parseFloat(e.totalLibras),
              color: 'bg-green-600',
            }))}
            maxValue={reportes.porEstado.length > 0 ? parseFloat(reportes.porEstado[0].totalLibras) : 0}
          />
        </Card>
      </div>

      {/* Resumen Mensual */}
      <Card>
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
          Resumen Mensual
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Periodo
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Libras
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Reservas
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Usuarios
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Periodos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportes.porMes.map((mes, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-medium text-gray-900">
                    {mes.mes} {mes.year}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {formatLibras(mes.totalLibras)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {mes.totalReservas}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {mes.totalUsuarios}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {mes.periodos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tabla: Todos los Usuarios */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
            Ranking Completo de Usuarios ({reportes.porUsuario.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  #
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Usuario
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Libras
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Reservas
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Periodos
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  % Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportes.porUsuario.map((usuario, index) => (
                <tr key={usuario.userId} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      {index + 1}
                      {index === 0 && (
  <Badge className="bg-yellow-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 whitespace-nowrap">👑 Top 1</Badge>
)}
                      {index === reportes.porUsuario.length - 1 && (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{usuario.userName}</p>
                      <p className="text-gray-500 text-xs">{usuario.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-semibold text-blue-600">
                    {formatLibras(usuario.totalLibras)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {usuario.totalReservas}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {usuario.periodoCount}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {usuario.porcentajeDelTotal.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tabla: Por Periodo */}
      <Card>
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
          Análisis por Periodo
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  ID
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Fecha Envío
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Totales
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Reservadas
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Ocupación
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Reservas
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Usuarios
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportes.porPeriodo.map((periodo) => (
                <tr key={periodo.periodoId} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900">
                    #{periodo.periodoId}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    <p className="font-medium">Envío: {periodo.fechaEnvio}</p>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {periodo.librasTotales.toLocaleString()}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-semibold text-blue-600">
                    {formatLibras(periodo.librasReservadas)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${
                            periodo.porcentajeOcupacion >= 100
                              ? 'bg-red-600'
                              : periodo.porcentajeOcupacion >= 80
                              ? 'bg-yellow-600'
                              : 'bg-green-600'
                          }`}
                          style={{ width: `${Math.min(periodo.porcentajeOcupacion, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {periodo.porcentajeOcupacion.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {periodo.totalReservas}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {periodo.totalUsuarios}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tabla: Por Estado */}
      <Card>
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
          Distribución por Estado
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  #
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Estado
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Libras
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Reservas
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Usuarios
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  % Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportes.porEstado.map((estado, index) => (
                <tr key={estado.estado} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-medium text-gray-900">
                    {estado.estado}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-semibold text-green-600">
                    {formatLibras(estado.totalLibras)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {estado.totalReservas}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {estado.totalUsuarios}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                    {estado.porcentajeDelTotal.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};