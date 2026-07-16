import { useInfiniteQuery } from '@tanstack/react-query';
import { journeyApi, GetTimelineFilters } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';

export const useJourneyTimeline = (filters?: GetTimelineFilters) => {
  return useInfiniteQuery({
    queryKey: journeyKeys.timeline(filters),
    queryFn: async ({ pageParam = 0 }) => {
      return journeyApi.getTimeline({
        ...filters,
        offset: pageParam,
        limit: 10,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const match = lastPage.next.match(/[\?&]offset=(\d+)/);
        return match ? Number(match[1]) : undefined;
      }
      return undefined;
    },
  });
};
