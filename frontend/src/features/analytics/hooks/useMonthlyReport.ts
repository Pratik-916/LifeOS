import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useMonthlyReport = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.monthly(filters),
    queryFn: () => AnalyticsAPI.getMonthlyReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
