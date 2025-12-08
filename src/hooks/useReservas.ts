/**
 * Hook de Reservas
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reservasApi } from '@/api/endpoints';
import { CreateReservaDTO, UpdateReservaDTO, ReservaFilters, StatusReserva } from '@/types';
import { AxiosError } from 'axios';

export const useReservas = (filters?: ReservaFilters) => {
  const queryClient = useQueryClient();

  /**
   * Query: Listar reservas
   */
  const {
    data: reservasData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['reservas', filters],
    queryFn: async () => {
      const response = await reservasApi.list(filters);
      return response.data;
    },
  });
  

  /**
   * Mutation: Crear reserva
   */
  const createMutation = useMutation({
    mutationFn: (data: CreateReservaDTO) => reservasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['periodos', 'active'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al crear reserva:', error.response?.data?.message);
    },
  });

  /**
   * Mutation: Actualizar reserva
   */
  const updateMutation = useMutation({
    mutationFn: ({ reservaId, data }: { reservaId: number; data: UpdateReservaDTO }) =>
      reservasApi.update(reservaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['periodos', 'active'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al actualizar reserva:', error.response?.data?.message);
    },
  });

  /**
   * Mutation: Actualizar status
   */
  const updateStatusMutation = useMutation({
    mutationFn: ({ reservaId, status }: { reservaId: number; status: StatusReserva }) =>
      reservasApi.updateStatus(reservaId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al actualizar status:', error.response?.data?.message);
    },
  });

  /**
   * Mutation: Eliminar reserva
   */
  const deleteMutation = useMutation({
    mutationFn: (reservaId: number) => reservasApi.delete(reservaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['periodos', 'active'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al eliminar reserva:', error.response?.data?.message);
    },
  });

  return {
  // List
  reservas: reservasData?.data || [],
  pagination: reservasData?.pagination,
  isLoading,
  error,
  refetch,

  // Get by ID
  useReservaById,

  // Create
  createReserva: createMutation.mutate,
  isCreating: createMutation.isPending,
  createError: createMutation.error,

  // Update
  updateReserva: updateMutation.mutate,
  isUpdating: updateMutation.isPending,
  updateError: updateMutation.error,

  // Update status
  updateStatus: (variables: { reservaId: number; status: StatusReserva }, options?: {
    onSuccess?: () => void;
    onError?: (error: AxiosError<{ message?: string }>) => void;
  }) => {
    updateStatusMutation.mutate(variables, options);
  },
  isUpdatingStatus: updateStatusMutation.isPending,

  // Delete
  deleteReserva: deleteMutation.mutate,
  isDeleting: deleteMutation.isPending,
  deleteError: deleteMutation.error,
};
};

/**
   * Query: Obtener reserva por ID
   */
  // Hook separado para obtener una reserva por ID
export const useReservaById = (reservaId?: number | null) => {
  return useQuery({
    queryKey: ['reservas', reservaId],
    queryFn: () => reservasApi.getById(reservaId!),
    enabled: !!reservaId,
  });
};