/**
 * Componente de Tabla de Periodos
 */

import { Badge, Button } from '@/components/ui';
import { useUIStore } from '@/stores';
import { usePeriodos } from '@/hooks';
import { formatDate, formatLibras } from '@/utils/format';
import { Edit, Lock } from 'lucide-react';
import { ConfirmModal } from '../ConfirmModal';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { PeriodoLibras } from '@/types';

interface PeriodoTableProps {
  periodos: PeriodoLibras[];
}

export const PeriodoTable = ({ periodos }: PeriodoTableProps) => {
  const { openPeriodoModal } = useUIStore();
  const { closePeriodo, isClosing } = usePeriodos();
  const [closeId, setCloseId] = useState<number | null>(null);

  const handleClose = (periodoId: number) => {
    closePeriodo(periodoId, {
      onSuccess: () => {
        toast.success('Periodo cerrado correctamente');
        setCloseId(null);
      },
      onError: () => {
  toast.error('Error al cerrar periodo');
},
    });
  };

  return (
  <>
    <div className="overflow-x-auto">
      <table className="w-full min-w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              ID
            </th>
            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Fechas
            </th>
            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Libras
            </th>
            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Estado
            </th>
            <th className="px-2 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {periodos.map((periodo) => (
            <tr key={periodo.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-medium">
                #{periodo.id}
              </td>
              <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                <div className="text-xs sm:text-sm">
                  <p className="font-medium text-gray-900">
                    {formatDate(periodo.fechaEnvio)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Fecha de envío
                  </p>
                </div>
              </td>
              <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  {formatLibras(periodo.librasTotales)}
                </span>
              </td>
              <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                {periodo.isActive ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    Activo
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                    Cerrado
                  </Badge>
                )}
              </td>
              <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                <div className="flex items-center justify-end gap-1 sm:gap-2">
                  {periodo.isActive && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openPeriodoModal('edit', periodo.id)}
                        title="Editar periodo"
                        className="p-1 sm:p-2"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCloseId(periodo.id)}
                        title="Cerrar periodo"
                        className="p-1 sm:p-2"
                      >
                        <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
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

    {/* Modal de confirmación */}
    <ConfirmModal
      isOpen={closeId !== null}
      onClose={() => setCloseId(null)}
      onConfirm={() => closeId && handleClose(closeId)}
      title="Cerrar Periodo"
      message="¿Estás seguro de cerrar este periodo? Se archivarán todas las reservas y no se podrán hacer más cambios. Esta acción no se puede deshacer."
      confirmText="Cerrar Periodo"
      isLoading={isClosing}
    />
  </>
);
};