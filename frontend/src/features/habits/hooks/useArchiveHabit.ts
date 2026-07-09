import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitsAPI } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';
import type { HabitModel } from '../api/habits.types';

export const useArchiveHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: HabitsAPI.archiveHabit,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: habitsKeys.all });

      const previousHabits = queryClient.getQueriesData<any>({ queryKey: habitsKeys.lists() });

      queryClient.setQueriesData({ queryKey: habitsKeys.lists() }, (oldData: any) => {
        if (!oldData || !oldData.results) return oldData;
        return {
          ...oldData,
          results: oldData.results.map((habit: HabitModel) => 
            habit.id === id ? { ...habit, isArchived: true, status: 'archived' } : habit
          )
        };
      });

      return { previousHabits };
    },
    onError: (err, id, context) => {
      if (context?.previousHabits) {
        context.previousHabits.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: habitsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: habitsKeys.statistics() });
    },
  });
};
