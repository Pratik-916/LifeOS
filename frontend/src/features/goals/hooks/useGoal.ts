import { useQuery } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalsKeys } from '../api/goals.keys';

export function useGoal(id: string) {
  return useQuery({
    queryKey: goalsKeys.detail(id),
    queryFn: () => goalsApi.getGoal(id),
    staleTime: 30 * 1000,
    enabled: !!id,
  });
}
