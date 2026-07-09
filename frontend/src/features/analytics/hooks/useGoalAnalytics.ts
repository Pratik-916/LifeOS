import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useGoalAnalytics = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.goals(filters),
    queryFn: () => AnalyticsAPI.getGoalAnalytics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
