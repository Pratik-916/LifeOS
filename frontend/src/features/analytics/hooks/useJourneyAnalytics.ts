import { useQuery } from '@tanstack/react-query';
import { AnalyticsAPI } from '../api/analytics';
import { analyticsKeys } from '../api/analytics.keys';

export const useJourneyAnalytics = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: analyticsKeys.journey(filters),
    queryFn: () => AnalyticsAPI.getJourneyAnalytics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
