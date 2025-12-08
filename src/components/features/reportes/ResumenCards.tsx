/**
 * Cards de Resumen de Reportes
 */

import { Card } from '@/components/ui';
import { Package, Users, Calendar, TrendingUp } from 'lucide-react';
import { formatLibras } from '@/utils/format';

interface ResumenCardsProps {
  resumen: {
    totalLibrasGlobal: string;
    totalReservasGlobal: number;
    totalUsuariosUnicos: number;
    totalPeriodos: number;
    promedioLibrasPorUsuario: string;
    promedioLibrasPorPeriodo: string;
  };
}

export const ResumenCards = ({ resumen }: ResumenCardsProps) => {
  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
    <Card padding="sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-600">Total Libras</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">
            {formatLibras(resumen.totalLibrasGlobal)}
          </p>
        </div>
        <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>
      </div>
    </Card>

    <Card padding="sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-600">Total Reservas</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">
            {resumen.totalReservasGlobal.toLocaleString()}
          </p>
        </div>
        <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
        </div>
      </div>
    </Card>

    <Card padding="sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-600">Usuarios Únicos</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">
            {resumen.totalUsuariosUnicos}
          </p>
        </div>
        <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
        </div>
      </div>
    </Card>

    <Card padding="sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-600">Total Periodos</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">
            {resumen.totalPeriodos}
          </p>
        </div>
        <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
        </div>
      </div>
    </Card>

    <Card padding="sm">
      <div>
        <p className="text-xs sm:text-sm text-gray-600">Promedio por Usuario</p>
        <p className="text-base sm:text-xl font-bold text-gray-900">
          {formatLibras(resumen.promedioLibrasPorUsuario)}
        </p>
      </div>
    </Card>

    <Card padding="sm">
      <div>
        <p className="text-xs sm:text-sm text-gray-600">Promedio por Periodo</p>
        <p className="text-base sm:text-xl font-bold text-gray-900">
          {formatLibras(resumen.promedioLibrasPorPeriodo)}
        </p>
      </div>
    </Card>
  </div>
);
};