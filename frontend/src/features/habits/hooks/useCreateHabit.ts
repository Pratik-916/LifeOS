import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitsAPI } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';

export const useCreateHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: HabitsAPI.createHabit,
    onSuccess: () => {
      // Invalidate habit lists and statistics
      queryClient.invalidateQueries({ queryKey: habitsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: habitsKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: habitsKeys.dashboard() });
    },
  });
};
