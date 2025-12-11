/**
 * Página de Dashboard
 */

import { useDashboard } from '@/hooks';
import { Card, Spinner, Badge } from '@/components/ui';
import { 
  Package, 
  Users, 
  TrendingUp, 
  Calendar,
  AlertCircle 
} from 'lucide-react';
import { formatLibras, formatPercentage, formatDate } from '@/utils/format';
import { STATUS_LABELS, STATUS_COLORS } from '@/constants';
import type { PeriodoStats } from '@/types';

export const DashboardPage = () => {
  const { stats, isLoadingStats, errorStats } = useDashboard();

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (errorStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Error al cargar estadísticas</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const periodos = stats.periodos || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Resumen general del sistema de reservas
        </p>
      </div>

      {/* Alerta si no hay periodos */}
      {periodos.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">
                No hay periodos activos
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Los usuarios no podrán crear reservas hasta que se active un periodo.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Resumen Global */}
      {periodos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reservado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatLibras(stats.totalLibrasReservadas || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Disponible</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatLibras(stats.totalLibrasDisponibles || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reservas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalReservas || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsuariosConReservas || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Periodos Activos Individuales */}
      {periodos.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Periodos Activos ({periodos.length})
          </h2>
          <div className="space-y-6">
            {periodos.map((periodoStats: PeriodoStats) => {
              const isLleno = parseFloat(periodoStats.librasDisponibles) === 0;
              
              return (
                <Card key={periodoStats.periodo.id} className={`${isLleno ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
                  {/* Header del Periodo */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={isLleno ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}>
                            {isLleno ? 'LLENO' : 'DISPONIBLE'}
                          </Badge>
                          <span className="text-sm text-gray-600">Periodo #{periodoStats.periodo.id}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          Envío: {formatDate(periodoStats.periodo.fechaEnvio)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {periodoStats.periodo.librasTotales.toLocaleString()} lbs
                      </p>
                      <p className="text-xs text-gray-600">Capacidad total</p>
                    </div>
                  </div>

                  {/* Estadísticas del Periodo */}
<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 mb-4">
  {/* Total Reservadas */}
  <div className="bg-white rounded-lg p-3 border-l-4 border-blue-500">
    <div className="flex items-center gap-2 mb-1">
      <Package className="w-4 h-4 text-blue-600" />
      <p className="text-xs text-gray-600 font-medium">Total Reservadas</p>
    </div>
    <p className="text-lg font-bold text-blue-600">
      {formatLibras(periodoStats.librasReservadas)}
    </p>
  </div>

  {/* Disponibles */}
  <div className="bg-white rounded-lg p-3 border-l-4 border-teal-500">
    <div className="flex items-center gap-2 mb-1">
      <TrendingUp className="w-4 h-4 text-teal-600" />
      <p className="text-xs text-gray-600 font-medium">Disponibles ✅</p>
    </div>
    <p className="text-lg font-bold text-teal-600">
      {formatLibras(periodoStats.librasDisponibles)}
    </p>
    <p className="text-[10px] text-gray-500">Sin reservar</p>
  </div>

  {/* En Central (Entregadas) */}
  <div className="bg-white rounded-lg p-3 border-l-4 border-green-500">
    <div className="flex items-center gap-2 mb-1">
      <Package className="w-4 h-4 text-green-600" />
      <p className="text-xs text-gray-600 font-medium">En Central 🏢</p>
    </div>
    <p className="text-lg font-bold text-green-600">
      {formatLibras(periodoStats.librasEnCentral)}
    </p>
    <p className="text-[10px] text-gray-500">Entregadas</p>
  </div>

  {/* En Tránsito */}
  <div className="bg-white rounded-lg p-3 border-l-4 border-purple-500">
    <div className="flex items-center gap-2 mb-1">
      <TrendingUp className="w-4 h-4 text-purple-600" />
      <p className="text-xs text-gray-600 font-medium">En Tránsito 🚚</p>
    </div>
    <p className="text-lg font-bold text-purple-600">
      {formatLibras(periodoStats.librasEnTransito)}
    </p>
    <p className="text-[10px] text-gray-500">Confirmadas/Enviadas</p>
  </div>

  {/* Pendientes */}
  <div className="bg-white rounded-lg p-3 border-l-4 border-yellow-500">
    <div className="flex items-center gap-2 mb-1">
      <AlertCircle className="w-4 h-4 text-yellow-600" />
      <p className="text-xs text-gray-600 font-medium">Pendientes ⏳</p>
    </div>
    <p className="text-lg font-bold text-yellow-600">
      {formatLibras(periodoStats.librasPendientes)}
    </p>
    <p className="text-[10px] text-gray-500">Sin confirmar</p>
  </div>  

  {/* Usuarios */}
  <div className="bg-white rounded-lg p-3 border-l-4 border-indigo-500">
    <div className="flex items-center gap-2 mb-1">
      <Users className="w-4 h-4 text-indigo-600" />
      <p className="text-xs text-gray-600 font-medium">Usuarios 👥</p>
    </div>
    <p className="text-lg font-bold text-indigo-600">
      {periodoStats.totalUsuariosConReservas}
    </p>
    <p className="text-[10px] text-gray-500">Con reservas</p>
  </div>
</div>

                  {/* Barra de progreso */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Ocupación</span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatPercentage(periodoStats.porcentajeOcupacion)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          periodoStats.porcentajeOcupacion >= 100 
                            ? 'bg-red-600' 
                            : periodoStats.porcentajeOcupacion >= 80 
                            ? 'bg-yellow-600' 
                            : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(periodoStats.porcentajeOcupacion, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Distribución por Status */}
                  {periodoStats.reservasPorStatus.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Distribución por Estado
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {periodoStats.reservasPorStatus.map((item) => (
                          <Badge key={item.status} className={STATUS_COLORS[item.status as keyof typeof STATUS_COLORS]}>
                            {STATUS_LABELS[item.status as keyof typeof STATUS_LABELS]}: {item.count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Usuarios Global */}
      {stats.usuariosConReservas && stats.usuariosConReservas.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Usuarios (Periodos Activos)
          </h3>
          <div className="space-y-3">
            {stats.usuariosConReservas.slice(0, 5).map((usuario) => (
              <div
                key={usuario.userId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{usuario.userName}</p>
                  <p className="text-sm text-gray-600">{usuario.userEmail}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatLibras(usuario.totalLibras)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {usuario.totalReservas} {usuario.totalReservas === 1 ? 'reserva' : 'reservas'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};