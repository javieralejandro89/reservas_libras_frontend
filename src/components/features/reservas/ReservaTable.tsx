/**
 * Componente de Tabla de Reservas
 */

import { Badge, Button } from '@/components/ui';
import { useUIStore, useAuthStore } from '@/stores';
import { useReservas } from '@/hooks';
import { formatLibras, formatDate } from '@/utils/format';
import { STATUS_LABELS, STATUS_COLORS, STATUS_RESERVA, getAvailableStatuses, ROLES } from '@/constants';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Reserva, StatusReserva } from '@/types';
import { ConfirmModal } from '../ConfirmModal';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface ReservaTableProps {
  reservas: Reserva[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  isAdmin: boolean; // Ahora significa "puede gestionar estados" (ADMIN_PRINCIPAL o USUARIO)
  currentUserId?: number;
}

export const ReservaTable = ({
  reservas,
  pagination,
  onPageChange,
  isAdmin,
  currentUserId,
}: ReservaTableProps) => {
  const { openReservaModal } = useUIStore();
  const { user } = useAuthStore();
  const { deleteReserva, isDeleting, updateStatus, isUpdatingStatus } = useReservas();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const canEdit = (reserva: Reserva) => {
    return isAdmin || reserva.userId === currentUserId;
  };

  const handleDelete = (reservaId: number) => {
    deleteReserva(reservaId, {
      onSuccess: () => {
        toast.success('Reserva eliminada correctamente');
        setDeleteId(null);
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        toast.error(error.response?.data?.message || 'Error al eliminar reserva');
      },
    });
  };

  const handleStatusChange = (reservaId: number, newStatus: StatusReserva) => {
    updateStatus(
      { reservaId, status: newStatus },
      {
        onSuccess: () => {
          toast.success('Estado actualizado correctamente');
        },
        onError: (error: AxiosError<{ message?: string }>) => {
          toast.error(error.response?.data?.message || 'Error al actualizar estado');
        },
      }
    );
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Libras
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observaciones
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservas.map((reserva) => (
              <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{reserva.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {reserva.user?.name}
                    </p>
                    <p className="text-sm text-gray-500">{reserva.user?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatLibras(reserva.libras)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(reserva.fecha)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reserva.estado}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
  {isAdmin && user ? (
    (() => {
      const availableStatuses = getAvailableStatuses(reserva.status, user.role);
      const isReadonly = availableStatuses.length === 1;
      const isFinalStatus = reserva.status === STATUS_RESERVA.ENTREGADA || 
                           reserva.status === STATUS_RESERVA.CANCELADA;

      return (
        <div className="min-w-[140px]">
          <select
            value={reserva.status}
            onChange={(e) => handleStatusChange(reserva.id, e.target.value as StatusReserva)}
            disabled={isUpdatingStatus || isReadonly}
            title={
              isFinalStatus 
                ? 'Estado final - no se puede modificar' 
                : isReadonly && user.role === ROLES.USUARIO
                ? 'Solo puedes cambiar reservas confirmadas a enviadas'
                : ''
            }
            className={`
              w-full px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-1
              ${isReadonly ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:scale-[1.02] hover:shadow-md'}
              disabled:opacity-50 disabled:cursor-not-allowed
              ${reserva.status === STATUS_RESERVA.PENDIENTE ? 'bg-yellow-50 border-yellow-300 text-yellow-800 focus:ring-yellow-500' : ''}
              ${reserva.status === STATUS_RESERVA.CONFIRMADA ? 'bg-blue-50 border-blue-300 text-blue-800 focus:ring-blue-500' : ''}
              ${reserva.status === STATUS_RESERVA.ENVIADA ? 'bg-purple-50 border-purple-300 text-purple-800 focus:ring-purple-500' : ''}
              ${reserva.status === STATUS_RESERVA.ENTREGADA ? 'bg-green-50 border-green-300 text-green-800 focus:ring-green-500' : ''}
              ${reserva.status === STATUS_RESERVA.CANCELADA ? 'bg-red-50 border-red-300 text-red-800 focus:ring-red-500' : ''}
            `}
          >
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
                {status === reserva.status && isFinalStatus ? ' 🔒' : ''}
              </option>
            ))}
          </select>
          
          {/* Indicador visual para usuarios no admin principal */}
          {isReadonly && !isFinalStatus && user.role === ROLES.USUARIO && (
            <p className="text-xs text-gray-500 mt-1">
              Solo lectura
            </p>
          )}
        </div>
      );
    })()
  ) : (
    <Badge className={STATUS_COLORS[reserva.status]}>
      {STATUS_LABELS[reserva.status]}
    </Badge>
  )}
</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {reserva.observaciones || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {canEdit(reserva) && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openReservaModal('edit', reserva.id)}
                          title="Editar reserva"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(reserva.id)}
                          title="Eliminar reserva"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Mostrando{' '}
            <span className="font-medium">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{' '}
            a{' '}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            de <span className="font-medium">{pagination.total}</span> resultados
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Eliminar Reserva"
        message="¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </>
  );
};