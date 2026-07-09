import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useHeatmap = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.heatmap(filters),
    queryFn: () => AnalyticsAPI.getHeatmap(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
