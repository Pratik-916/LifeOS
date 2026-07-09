import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitsAPI } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';
import type { HabitModel } from '../api/habits.types';

export const useFavoriteHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) => 
      HabitsAPI.favoriteHabit(id, isFavorite),
    onMutate: async ({ id, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: habitsKeys.all });

      const previousHabits = queryClient.getQueriesData<any>({ queryKey: habitsKeys.lists() });

      queryClient.setQueriesData({ queryKey: habitsKeys.lists() }, (oldData: any) => {
        if (!oldData || !oldData.results) return oldData;
        return {
          ...oldData,
          results: oldData.results.map((habit: HabitModel) => 
            habit.id === id ? { ...habit, isFavorite } : habit
          )
        };
      });

      return { previousHabits };
    },
    onError: (err, variables, context) => {
      if (context?.previousHabits) {
        context.previousHabits.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: habitsKeys.lists() });
    },
  });
};
