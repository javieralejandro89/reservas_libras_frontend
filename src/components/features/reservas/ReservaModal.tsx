/**
 * Modal de Crear/Editar Reserva
 */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Input, Select, Textarea, Button } from '@/components/ui';
import { useUIStore } from '@/stores';
import { useReservas, useReservaById, usePeriodos } from '@/hooks';
import { VALIDATION_RULES, ESTADOS_MEXICO } from '@/constants';
import { toInputDate, formatDate, formatLibras } from '@/utils/format';
import toast from 'react-hot-toast';
import type { CreateReservaDTO, PeriodoLibras } from '@/types';
import { AxiosError } from 'axios';

const reservaSchema = z.object({
  libras: z
    .number()
    .min(VALIDATION_RULES.LIBRAS.MIN, `Mínimo ${VALIDATION_RULES.LIBRAS.MIN} libras`)
    .max(VALIDATION_RULES.LIBRAS.MAX, `Máximo ${VALIDATION_RULES.LIBRAS.MAX} libras`),
  fecha: z.string().min(1, 'La fecha de envío es requerida'),
  estado: z.string().min(1, 'El estado es requerido'),
  observaciones: z
    .string()
    .max(VALIDATION_RULES.OBSERVACIONES.MAX_LENGTH, `Máximo ${VALIDATION_RULES.OBSERVACIONES.MAX_LENGTH} caracteres`)
    .optional(),
});

type ReservaFormData = z.infer<typeof reservaSchema>;

interface ReservaModalProps {
  onSuccess: () => void;
}

export const ReservaModal = ({ onSuccess }: ReservaModalProps) => {
  const { isReservaModalOpen, reservaModalMode, reservaModalId, closeReservaModal } = useUIStore();
  const { createReserva, isCreating, updateReserva, isUpdating } = useReservas();
  const { data: reservaResponse } = useReservaById(reservaModalId);
  const { periodosDisponibles, isLoadingDisponibles } = usePeriodos();
  const periodos = periodosDisponibles;
  const isLoadingPeriodos = isLoadingDisponibles;
  const reservaData = reservaResponse?.data.data;

  const [selectedPeriodoId, setSelectedPeriodoId] = useState<number | null>(null);

  const [periodosDisponibilidad, setPeriodosDisponibilidad] = useState<Array<{
    id: number;
    fechaEnvio: string;
    disponibles: number;
  }>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ReservaFormData>({
    resolver: zodResolver(reservaSchema),
  });

  // Calcular disponibilidad de periodos
  useEffect(() => {
    console.log('🔍 Periodos recibidos:', periodos);
    console.log('🔍 isLoading:', isLoadingPeriodos);
    
    if (periodos && periodos.length > 0) {
      console.log('📦 Procesando', periodos.length, 'periodos');
      
      const periodosConDisp = periodos
        .map((periodo: PeriodoLibras) => {
          console.log('🔧 Periodo:', {
            id: periodo.id,
            fechaEnvio: periodo.fechaEnvio,
            librasTotales: periodo.librasTotales,
            tieneReservas: !!periodo.reservas,
            cantidadReservas: periodo.reservas?.length || 0
          });

          // Calcular libras reservadas (excluyendo canceladas)
          const librasReservadas = (periodo.reservas || []).reduce((sum: number, reserva: any) => {
            if (reserva.status !== 'CANCELADA') {
              return sum + parseFloat(reserva.libras.toString());
            }
            return sum;
          }, 0);

          const disponibles = periodo.librasTotales - librasReservadas;
          
          console.log('📊 Cálculo:', {
            librasReservadas,
            disponibles,
            pasaFiltro: disponibles > 0
          });

          return {
            id: periodo.id,
            fechaEnvio: periodo.fechaEnvio,
            disponibles: disponibles,
          };
        })
        .filter((p: { id: number; fechaEnvio: string; disponibles: number }) => p.disponibles > 0);

      console.log('✅ Periodos con disponibilidad:', periodosConDisp);
      setPeriodosDisponibilidad(periodosConDisp);
    } else {
      console.log('❌ No hay periodos o está vacío');
    }
  }, [periodos, isLoadingPeriodos]);

  // Cargar datos si es edición
  useEffect(() => {
    if (reservaModalMode === 'edit' && reservaData) {
      setValue('libras', parseFloat(reservaData.libras.toString()));
      setValue('fecha', toInputDate(reservaData.fecha));
      setValue('estado', reservaData.estado);
      setValue('observaciones', reservaData.observaciones || '');
    } else if (reservaModalMode === 'create') {
      reset();
    }
  }, [reservaModalMode, reservaData, setValue, reset]);

  const onSubmit = (data: ReservaFormData) => {
    const reservaData: CreateReservaDTO = {
      libras: data.libras,
      fecha: data.fecha,
      estado: data.estado,
      observaciones: data.observaciones,
      periodoId: selectedPeriodoId || undefined,
    };

    if (reservaModalMode === 'create') {
      createReserva(reservaData, {
        onSuccess: (response) => {
          const mensaje = response?.data?.message || 'Reserva creada correctamente';
          
          if (mensaje.includes('dividida')) {
            toast.success(mensaje, {
              duration: 8000,
              style: {
                background: '#fef3c7',
                color: '#92400e',
                border: '2px solid #f59e0b',
                fontSize: '14px',
                fontWeight: '600',
                maxWidth: '500px',
              },
            });
          } else {
            toast.success(mensaje);
          }
          
          closeReservaModal();
          reset();
          onSuccess();
        },
        onError: (error: AxiosError<{ message?: string }>) => {
          const mensaje = error.response?.data?.message || 'Error al crear reserva';
          toast.error(mensaje, {
            duration: 6000,
          });
        },
      });
    } else if (reservaModalMode === 'edit' && reservaModalId) {
      updateReserva(
        { reservaId: reservaModalId, data: reservaData },
        {
          onSuccess: () => {
            toast.success('Reserva actualizada correctamente');
            closeReservaModal();
            reset();
            onSuccess();
          },
          onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Error al actualizar reserva');
          },
        }
      );
    }
  };

  const handleClose = () => {
    closeReservaModal();
    reset();
  };

  return (
    <Modal
      isOpen={isReservaModalOpen}
      onClose={handleClose}
      title={reservaModalMode === 'create' ? 'Nueva Reserva' : 'Editar Reserva'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
        {/* Libras */}
        <Input
          {...register('libras', { valueAsNumber: true })}
          type="number"
          step="0.01"
          label="Libras"
          placeholder="50.00"
          error={errors.libras?.message}
          required
        />

        {/* Fecha de envío - Select en modo crear, Input disabled en modo editar */}
        {reservaModalMode === 'create' ? (
          <Select
            {...register('fecha')}
            label="Fecha de envío"
            error={errors.fecha?.message}
            disabled={isLoadingPeriodos}
            onChange={(e) => {
              // Encontrar el periodo seleccionado
              const fechaSeleccionada = e.target.value;
              const periodo = periodosDisponibilidad.find(
                p => toInputDate(p.fechaEnvio) === fechaSeleccionada
              );
              setSelectedPeriodoId(periodo?.id || null);
            }}
            options={[
              { value: '', label: isLoadingPeriodos ? 'Cargando...' : 'Selecciona una fecha de envío' },
              ...periodosDisponibilidad.map((p) => ({
                value: toInputDate(p.fechaEnvio),
                label: `${formatDate(p.fechaEnvio)} (${formatLibras(p.disponibles)} disponibles)`,
              })),
            ]}
            required
          />
        ) : (
          <Input
            {...register('fecha')}
            type="date"
            label="Fecha de envío"
            error={errors.fecha?.message}
            disabled
            required
          />
        )}

        {/* Estado */}
        <Select
          {...register('estado')}
          label="Estado (destino)"
          error={errors.estado?.message}
          options={[
            { value: '', label: 'Selecciona un estado' },
            ...ESTADOS_MEXICO.map((estado) => ({
              value: estado,
              label: estado,
            })),
          ]}
          required
        />

        {/* Observaciones */}
        <Textarea
          {...register('observaciones')}
          label="Observaciones"
          placeholder="Notas adicionales sobre la reserva..."
          rows={3}
          error={errors.observaciones?.message}
        />

        {/* Mensaje si no hay periodos disponibles */}
        {reservaModalMode === 'create' && !isLoadingPeriodos && periodosDisponibilidad.length === 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              No hay periodos activos con libras disponibles. Contacta al administrador.
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isCreating || isUpdating}
            disabled={reservaModalMode === 'create' && periodosDisponibilidad.length === 0}
            className="w-full sm:w-auto"
          >
            {reservaModalMode === 'create' ? 'Crear' : 'Guardar'} Reserva
          </Button>
        </div>
      </form>
    </Modal>
  );
};