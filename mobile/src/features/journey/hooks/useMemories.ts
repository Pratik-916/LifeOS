import { useInfiniteQuery } from '@tanstack/react-query';
import { journeyApi, GetMemoriesFilters } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';

export const useMemories = (filters?: GetMemoriesFilters) => {
  return useInfiniteQuery({
    queryKey: journeyKeys.memoriesList(filters),
    queryFn: async ({ pageParam = 1 }) => {
      return journeyApi.getMemories({
        ...filters,
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return Number(url.searchParams.get('page')) || undefined;
      }
      return undefined;
    },
  });
};
