import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { journeyApi } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import type { TimelineFilters } from '../api/journey.types';

export const useJourneyTimeline = (filters: TimelineFilters = {}) => {
  return useQuery({
    queryKey: journeyKeys.timelineList(filters),
    queryFn: () => journeyApi.getJourneyTimeline(filters),
    placeholderData: keepPreviousData,
  });
};
