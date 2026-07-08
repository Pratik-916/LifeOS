import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalsKeys } from '../api/goals.keys';

export function useRestoreGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsApi.restoreGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalsKeys.statistics() });
    },
  });
}
