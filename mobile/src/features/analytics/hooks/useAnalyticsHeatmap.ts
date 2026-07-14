import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';
import type { AnalyticsFilters } from '../api/analytics.types';

export const useAnalyticsHeatmap = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: analyticsKeys.heatmap(filters),
    queryFn: () => analyticsService.getHeatmap(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};
