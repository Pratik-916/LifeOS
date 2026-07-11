import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from '../api/dashboard.keys';

export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: [...dashboardKeys.activity(), limit],
    queryFn: async () => {
      // Endpoint doesn't exist yet, return empty array to prevent 404
      return [] as any[];
    },
    staleTime: 5 * 60 * 1000,
  });
};
