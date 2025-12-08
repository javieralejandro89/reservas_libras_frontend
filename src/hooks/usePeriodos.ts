/**
 * Hook de Periodos
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { periodosApi } from '@/api/endpoints';
import { CreatePeriodoDTO, UpdatePeriodoDTO, PeriodoFilters } from '@/types';
import { AxiosError } from 'axios';

export const usePeriodos = (filters?: PeriodoFilters) => {
  const queryClient = useQueryClient();

  /**
   * Query: Listar periodos
   */
  const {
    data: periodosData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['periodos', filters],
    queryFn: async () => {
      const response = await periodosApi.list(filters);
      return response.data;
    },
  });

  /**
   * Query: Obtener periodo activo
   */
  const {
    data: periodoActivo,
    isLoading: isLoadingActive,
    error: errorActive,
    refetch: refetchActive,
  } = useQuery({
    queryKey: ['periodos', 'active'],
    queryFn: async () => {
      const response = await periodosApi.getActive();
      return response.data.data;
    },
  });

  /**
   * Query: Obtener periodo por ID
   */
  const usePeriodoById = (periodoId: number | null) => {
    return useQuery({
      queryKey: ['periodos', periodoId],
      queryFn: async () => {
        if (!periodoId) return null;
        const response = await periodosApi.getById(periodoId);
        return response.data.data;
      },
      enabled: !!periodoId,
    });
  };

  /**
   * Mutation: Crear periodo
   */
  const createMutation = useMutation({
    mutationFn: (data: CreatePeriodoDTO) => periodosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al crear periodo:', error.response?.data?.message);
    },
  });

  /**
   * Mutation: Actualizar periodo
   */
  const updateMutation = useMutation({
    mutationFn: ({ periodoId, data }: { periodoId: number; data: UpdatePeriodoDTO }) =>
      periodosApi.update(periodoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al actualizar periodo:', error.response?.data?.message);
    },
  });

  /**
   * Mutation: Cerrar periodo
   */
  const closeMutation = useMutation({
    mutationFn: (periodoId: number) => periodosApi.close(periodoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al cerrar periodo:', error.response?.data?.message);
    },
  });

  return {
    // List
    periodos: periodosData?.data || [],
    pagination: periodosData?.pagination,
    isLoading,
    error,
    refetch,

    // Active
    periodoActivo,
    isLoadingActive,
    errorActive,
    refetchActive,

    // Get by ID
    usePeriodoById,

    // Create
    createPeriodo: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Update
    updatePeriodo: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    // Close
    closePeriodo: closeMutation.mutate,
    isClosing: closeMutation.isPending,
    closeError: closeMutation.error,
  };
};

// Hook separado para obtener un periodo por ID
export const usePeriodoById = (periodoId?: number | null) => {
  return useQuery({
    queryKey: ['periodos', periodoId],
    queryFn: () => periodosApi.getById(periodoId!),
    enabled: !!periodoId,
  });
};