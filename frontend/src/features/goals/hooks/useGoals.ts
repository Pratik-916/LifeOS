import { useQuery } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalsKeys } from '../api/goals.keys';
import type { GetGoalsFilters } from '../api/goals.types';

export function useGoals(filters: GetGoalsFilters) {
  return useQuery({
    queryKey: goalsKeys.list(filters),
    queryFn: () => goalsApi.getGoals(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // keep old data while paginating
  });
}
