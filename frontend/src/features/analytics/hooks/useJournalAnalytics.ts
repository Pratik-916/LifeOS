import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useJournalAnalytics = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.journal(filters),
    queryFn: () => AnalyticsAPI.getJournalAnalytics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
