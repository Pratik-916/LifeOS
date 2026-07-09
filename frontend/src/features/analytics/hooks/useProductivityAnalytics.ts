import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useProductivityAnalytics = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.productivity(filters),
    queryFn: () => AnalyticsAPI.getProductivityAnalytics(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};
