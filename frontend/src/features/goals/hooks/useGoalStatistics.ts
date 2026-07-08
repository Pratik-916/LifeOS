import { useQuery } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalsKeys } from '../api/goals.keys';

export function useGoalStatistics() {
  return useQuery({
    queryKey: goalsKeys.statistics(),
    queryFn: () => goalsApi.getGoalStatistics(),
    staleTime: 10 * 1000,
  });
}
