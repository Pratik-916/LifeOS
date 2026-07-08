import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalsKeys } from '../api/goals.keys';
import type { CreateGoalPayload } from '../api/goals.types';

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGoalPayload) => goalsApi.createGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalsKeys.statistics() });
    },
  });
}
