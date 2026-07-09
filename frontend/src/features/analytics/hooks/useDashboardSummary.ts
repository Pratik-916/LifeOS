import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useDashboardSummary = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.dashboard(filters),
    queryFn: () => AnalyticsAPI.getDashboard(filters),
    staleTime: 15 * 1000, // 15 seconds
  });
};
