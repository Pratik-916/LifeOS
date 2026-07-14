import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalKeys } from '../api/goals.keys';


export const useGoals = (filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: goalKeys.list(filters),
    queryFn: () => goalsApi.getGoals(filters),
    placeholderData: keepPreviousData,
  });
};
