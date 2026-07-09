import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const usePlannerAnalytics = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.planner(filters),
    queryFn: () => AnalyticsAPI.getPlannerAnalytics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
