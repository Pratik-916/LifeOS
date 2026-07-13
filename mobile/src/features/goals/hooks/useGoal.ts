import { useQuery } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalKeys } from '../api/goals.keys';

export const useGoal = (id: string, enabled = true) => {
  return useQuery({
    queryKey: goalKeys.detail(id),
    queryFn: () => goalsApi.getGoal(id),
    enabled: !!id && enabled,
  });
};
