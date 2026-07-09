import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';
import { dashboardKeys } from '../api/dashboard.keys';

export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: [...dashboardKeys.activity(), limit],
    queryFn: () => dashboardApi.getRecentActivity(limit),
    staleTime: 15 * 1000, // 15 seconds as per requirements
  });
};
