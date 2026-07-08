import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalsKeys } from '../api/goals.keys';
import type { UpdateGoalPayload } from '../api/goals.types';

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalPayload }) => 
      goalsApi.updateGoal(id, payload),
    onSuccess: (updatedGoal) => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalsKeys.detail(updatedGoal.id) });
      queryClient.invalidateQueries({ queryKey: goalsKeys.statistics() });
    },
  });
}
