import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useWeeklyReport = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.weekly(filters),
    queryFn: () => AnalyticsAPI.getWeeklyReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
