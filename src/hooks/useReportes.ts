/**
 * Hook de Reportes
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/endpoints';
import type { ReportesFilters } from '@/types';

export const useReportes = (filters?: ReportesFilters) => {
  const {
    data: reportesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['reportes', filters],
    queryFn: async () => {
      const response = await dashboardApi.getReportes(filters);
      return response.data.data;
    },
  });

  return {
    reportes: reportesResponse,
    isLoading,
    error,
    refetch,
  };
};