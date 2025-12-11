/**
 * Modal de Crear/Editar Periodo
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Input, Button } from '@/components/ui';
import { useUIStore } from '@/stores';
import { usePeriodos, usePeriodoById } from '@/hooks';
import { APP_CONFIG } from '@/constants';
import { toInputDate } from '@/utils/format';
import toast from 'react-hot-toast';
import type { CreatePeriodoDTO } from '@/types';

const periodoSchema = z.object({
  librasTotales: z
    .number()
    .min(1, 'Mínimo 1 libra')
    .max(100000, 'Máximo 100,000 libras'),
  fechaEnvio: z.string().min(1, 'La fecha de envío es requerida'),
});

type PeriodoFormData = z.infer<typeof periodoSchema>;

export const PeriodoModal = () => {
  const { isPeriodoModalOpen, periodoModalMode, periodoModalId, closePeriodoModal } = useUIStore();
  const { createPeriodo, isCreating, updatePeriodo, isUpdating } = usePeriodos();
  const { data: periodoResponse } = usePeriodoById(periodoModalId);

  const periodoData = periodoResponse?.data.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PeriodoFormData>({
    resolver: zodResolver(periodoSchema),
    defaultValues: {
      librasTotales: APP_CONFIG.DEFAULT_LIBRAS_TOTALES,
    },
  });

  // Cargar datos si es edición
  // Cargar datos si es edición
  useEffect(() => {
    if (periodoModalMode === 'edit' && periodoData) {
      setValue('librasTotales', periodoData.librasTotales);
      setValue('fechaEnvio', toInputDate(periodoData.fechaEnvio));
    } else if (periodoModalMode === 'create') {
      reset({
        librasTotales: APP_CONFIG.DEFAULT_LIBRAS_TOTALES,
      });
    }
  }, [periodoModalMode, periodoData, setValue, reset]);

  const onSubmit = (data: PeriodoFormData) => {
    const periodoPayload: CreatePeriodoDTO = {
      librasTotales: data.librasTotales,
      fechaEnvio: data.fechaEnvio,
    };

    if (periodoModalMode === 'create') {
      createPeriodo(periodoPayload, {
        onSuccess: () => {
          toast.success('Periodo creado correctamente');
          closePeriodoModal();
          reset();
        },
        onError: () => {
  toast.error('Error al crear periodo');
},
      });
    } else if (periodoModalMode === 'edit' && periodoModalId) {
      updatePeriodo(
        { periodoId: periodoModalId, data: periodoPayload },
        {
          onSuccess: () => {
            toast.success('Periodo actualizado correctamente');
            closePeriodoModal();
            reset();
          },
          onError: () => {
            toast.error('Error al actualizar periodo');
          },
        }
      );
    }
  };

  const handleClose = () => {
    closePeriodoModal();
    reset();
  };

  return (
    <Modal
      isOpen={isPeriodoModalOpen}
      onClose={handleClose}
      title={periodoModalMode === 'create' ? 'Nuevo Periodo' : 'Editar Periodo'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Libras Totales */}
        <Input
          {...register('librasTotales', { valueAsNumber: true })}
          type="number"
          step="1"
          label="Libras Totales"
          placeholder="2000"
          error={errors.librasTotales?.message}
          helperText="Cantidad total de libras disponibles para este periodo"
          required
        />

        {/* Fecha de Envío */}
        <Input
          {...register('fechaEnvio')}
          type="date"
          label="Fecha de Envío"
          error={errors.fechaEnvio?.message}
          helperText="Fecha en que sale el envío de paquetería"
          required
        />

        {/* Botones */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
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
            className="w-full sm:w-auto"
          >
            {periodoModalMode === 'create' ? 'Crear' : 'Guardar'} Periodo
          </Button>
        </div>
      </form>
    </Modal>
  );
};