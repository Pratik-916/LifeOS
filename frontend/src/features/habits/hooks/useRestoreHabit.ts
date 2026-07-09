import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitsAPI } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';

export const useRestoreHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: HabitsAPI.restoreHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: habitsKeys.statistics() });
    },
  });
};
