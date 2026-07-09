import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useYearlyReport = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.yearly(filters),
    queryFn: () => AnalyticsAPI.getYearlyReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
