import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useHabitAnalytics = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.habits(filters),
    queryFn: () => AnalyticsAPI.getHabitAnalytics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
