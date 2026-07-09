import { useQuery } from '@tanstack/react-query';
import { JourneyAPI } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import type { TimelineFilters } from '../api/journey.types';

export const useJourneyTimeline = (filters: TimelineFilters = {}) => {
  return useQuery({
    queryKey: journeyKeys.timeline(filters),
    queryFn: () => JourneyAPI.getJourneyTimeline(filters),
    staleTime: 15 * 1000,
  });
};
