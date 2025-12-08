/**
 * Hook de Dashboard
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/endpoints';
import type { HistoricoFilters } from '@/types';

export const useDashboard = (filters?: HistoricoFilters) => {
  /**
   * Query: Obtener estadísticas
   */
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: errorStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await dashboardApi.getStats();
      return response.data.data;
    },
  });

  /**
   * Query: Obtener histórico de periodos
   */
  const {
    data: historyResponse,
    isLoading: isLoadingHistory,
    error: errorHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['dashboard', 'history', filters],
    queryFn: async () => {
      const response = await dashboardApi.getHistory(filters);
      return response.data;
    },
  });

  /**
   * Query: Obtener reservas históricas
   */
  const useReservasHistoricas = (periodoHistoricoId: number | null) => {
    return useQuery({
      queryKey: ['dashboard', 'history', periodoHistoricoId, 'reservas'],
      queryFn: async () => {
        if (!periodoHistoricoId) return null;
        const response = await dashboardApi.getReservasHistoricas(periodoHistoricoId);
        return response.data.data;
      },
      enabled: !!periodoHistoricoId,
    });
  };

  return {
    // Stats
    stats,
    isLoadingStats,
    errorStats,
    refetchStats,

    // History
    history: historyResponse?.data || [],
    pagination: historyResponse?.pagination,
    isLoadingHistory,
    errorHistory,
    refetchHistory,

    // Reservas históricas
    useReservasHistoricas,
  };
};