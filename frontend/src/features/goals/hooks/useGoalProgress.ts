import { useQuery } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalsKeys } from '../api/goals.keys';

export function useGoalProgress(id: string) {
  return useQuery({
    queryKey: goalsKeys.progress(id),
    queryFn: () => goalsApi.getGoalProgress(id),
    staleTime: 30 * 1000,
    enabled: !!id,
  });
}
