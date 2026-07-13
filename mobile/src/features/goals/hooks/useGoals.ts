import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalKeys } from '../api/goals.keys';
import type { GetGoalsFilters } from '../api/goals.types';

export const useGoals = (filters: GetGoalsFilters = {}) => {
  return useQuery({
    queryKey: goalKeys.list(filters),
    queryFn: () => goalsApi.getGoals(filters),
    placeholderData: keepPreviousData,
  });
};
