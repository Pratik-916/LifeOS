import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useAnalyticsDashboard = () => {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: () => analyticsService.getDashboardSummary(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};
