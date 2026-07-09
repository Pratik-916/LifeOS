import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useOverview = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.overview(filters),
    queryFn: () => AnalyticsAPI.getOverview(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};
