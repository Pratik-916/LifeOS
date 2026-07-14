import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';
import type { AnalyticsFilters } from '../api/analytics.types';

export const useJournalAnalytics = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: analyticsKeys.journal(filters),
    queryFn: () => analyticsService.getJournalAnalytics(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};
