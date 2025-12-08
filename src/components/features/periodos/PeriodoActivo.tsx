/**
 * Componente de Periodo Activo
 */

import { Card, Badge } from '@/components/ui';
import { Calendar, TrendingUp, Package } from 'lucide-react';
import { formatDate, formatLibras, formatPercentage } from '@/utils/format';
import type { PeriodoLibras } from '@/types';

interface PeriodoActivoProps {
  periodo: PeriodoLibras & {
    librasReservadas: string;
    librasDisponibles: string;
    porcentajeOcupacion: number;
  };
}

export const PeriodoActivo = ({ periodo }: PeriodoActivoProps) => {
  return (
  <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200" padding="sm">
    <div className="flex items-start justify-between mb-2 sm:mb-4">
      <div>
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
          <Badge className="bg-green-500 text-white border-green-600 text-xs">
            ACTIVO
          </Badge>
          <h2 className="text-sm sm:text-xl font-bold text-gray-900">
            Periodo Actual
          </h2>
        </div>
        <p className="text-xs sm:text-base text-gray-600">
          {formatDate(periodo.fechaInicio)} - {formatDate(periodo.fechaFin)}
        </p>
      </div>
      <div className="p-1.5 sm:p-3 bg-primary-600 rounded-lg">
        <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
      {/* Libras Totales */}
      <div className="bg-white rounded-lg p-2 sm:p-4">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <p className="text-xs sm:text-sm font-medium text-gray-600">Libras Totales</p>
        </div>
        <p className="text-lg sm:text-2xl font-bold text-gray-900">
          {formatLibras(periodo.librasTotales)}
        </p>
      </div>

      {/* Libras Reservadas */}
      <div className="bg-white rounded-lg p-2 sm:p-4">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <p className="text-xs sm:text-sm font-medium text-gray-600">Reservadas</p>
        </div>
        <p className="text-lg sm:text-2xl font-bold text-blue-600">
          {formatLibras(periodo.librasReservadas)}
        </p>
      </div>

      {/* Libras Disponibles */}
      <div className="bg-white rounded-lg p-2 sm:p-4">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          <p className="text-xs sm:text-sm font-medium text-gray-600">Disponibles</p>
        </div>
        <p className="text-lg sm:text-2xl font-bold text-green-600">
          {formatLibras(periodo.librasDisponibles)}
        </p>
      </div>
    </div>

    {/* Barra de progreso */}
    <div className="mt-2 sm:mt-4">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <span className="text-xs sm:text-sm font-medium text-gray-700">Ocupación</span>
        <span className="text-xs sm:text-sm font-bold text-gray-900">
          {formatPercentage(periodo.porcentajeOcupacion)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
        <div
          className="bg-primary-600 h-2 sm:h-3 rounded-full transition-all"
          style={{ width: `${periodo.porcentajeOcupacion}%` }}
        />
      </div>
    </div>
  </Card>
);
};