/**
 * Tabla de Reservas Históricas
 */

import { useDashboard } from '@/hooks';
import { Spinner, Badge } from '@/components/ui';
import { AlertCircle, Package } from 'lucide-react';
import { formatDate, formatLibras } from '@/utils/format';
import { STATUS_LABELS, STATUS_COLORS } from '@/constants';
import type { HistoricoReserva } from '@/types';

interface HistoricoReservasTableProps {
  periodoHistoricoId: number;
}

export const HistoricoReservasTable = ({ periodoHistoricoId }: HistoricoReservasTableProps) => {
  const { useReservasHistoricas } = useDashboard();
  const { data: reservas, isLoading, error } = useReservasHistoricas(periodoHistoricoId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Error al cargar reservas</p>
      </div>
    );
  }

  const reservasData = (reservas as HistoricoReserva[]) || [];

  if (reservasData.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">No hay reservas archivadas</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              ID
            </th>
            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Usuario
            </th>
            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Libras
            </th>
            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Fecha
            </th>
            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Estado
            </th>
            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Status
            </th>
            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden md:table-cell">
              Observaciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservasData.map((reserva) => (
            <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                #{reserva.reservaOriginalId}
              </td>
              <td className="px-3 sm:px-4 py-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{reserva.userName}</p>
                  <p className="text-gray-500 text-xs">{reserva.userEmail}</p>
                </div>
              </td>
              <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                <span className="text-sm font-semibold text-gray-900">
                  {formatLibras(reserva.libras)}
                </span>
              </td>
              <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {formatDate(reserva.fecha)}
              </td>
              <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {reserva.estado}
              </td>
              <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                <Badge className={STATUS_COLORS[reserva.status as keyof typeof STATUS_COLORS]}>
                  {STATUS_LABELS[reserva.status as keyof typeof STATUS_LABELS]}
                </Badge>
              </td>
              <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 hidden md:table-cell max-w-xs truncate">
                {reserva.observaciones || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};