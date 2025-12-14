/**
 * Timeline de tracking de reserva
 */

import { Check, Clock, Truck, Home, X } from 'lucide-react';
import { formatDate } from '@/utils/format';
import type { Reserva } from '@/types';

interface ReservaTimelineProps {
  reserva: Reserva;
}

export const ReservaTimeline = ({ reserva }: ReservaTimelineProps) => {
  const steps = [
    {
      status: 'PENDIENTE',
      label: 'Creada',
      icon: Clock,
      date: reserva.createdAt,
      color: 'yellow',
    },
    {
      status: 'CONFIRMADA',
      label: 'Confirmada',
      icon: Check,
      date: reserva.fechaConfirmacion,
      color: 'blue',
    },
    {
      status: 'ENVIADA',
      label: 'Enviada',
      icon: Truck,
      date: reserva.fechaEnvio,
      color: 'purple',
    },
    {
      status: 'ENTREGADA',
      label: 'Entregada',
      icon: Home,
      date: reserva.fechaEntrega,
      color: 'green',
    },
  ];

  const currentIndex = steps.findIndex(s => s.status === reserva.status);
  const isCancelled = reserva.status === 'CANCELADA';

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <X className="w-5 h-5 text-red-600" />
        <div>
          <p className="text-sm font-semibold text-red-900">Reserva Cancelada</p>
          <p className="text-xs text-red-700">Fecha: {formatDate(reserva.updatedAt)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.status} className="flex items-start gap-3">
            {/* Icono */}
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${isCompleted 
                ? `bg-${step.color}-100 border-2 border-${step.color}-500` 
                : 'bg-gray-100 border-2 border-gray-300'}
            `}>
              <Icon className={`w-4 h-4 ${isCompleted ? `text-${step.color}-600` : 'text-gray-400'}`} />
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                {step.label}
                {isCurrent && <span className="ml-2 text-xs text-blue-600">(Actual)</span>}
              </p>
              {step.date && (
                <p className="text-xs text-gray-600 mt-0.5">
                  {formatDate(step.date)}
                </p>
              )}
              {!step.date && isCompleted && (
                <p className="text-xs text-gray-500 italic mt-0.5">
                  Sin registrar
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};