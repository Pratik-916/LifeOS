import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitsAPI } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';
import type { HabitModel, LogHabitPayload } from '../api/habits.types';

export const useLogHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: LogHabitPayload }) => 
      HabitsAPI.logHabit(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: habitsKeys.all });

      const previousHabits = queryClient.getQueriesData<any>({ queryKey: habitsKeys.lists() });
      const previousDetails = queryClient.getQueryData<HabitModel>(habitsKeys.detail(id));

      // Optimistically update the list
      queryClient.setQueriesData({ queryKey: habitsKeys.lists() }, (oldData: any) => {
        if (!oldData || !oldData.results) return oldData;
        return {
          ...oldData,
          results: oldData.results.map((habit: HabitModel) => {
            if (habit.id === id) {
              const newCount = habit.currentCount + (payload.count || 1);
              return { 
                ...habit, 
                currentCount: newCount,
              };
            }
            return habit;
          })
        };
      });

      // Optimistically update details
      if (previousDetails) {
        queryClient.setQueryData(habitsKeys.detail(id), {
          ...previousDetails,
          currentCount: previousDetails.currentCount + (payload.count || 1)
        });
      }

      return { previousHabits, previousDetails };
    },
    onError: (err, variables, context) => {
      if (context?.previousHabits) {
        context.previousHabits.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetails) {
        queryClient.setQueryData(habitsKeys.detail(variables.id), context.previousDetails);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: habitsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: habitsKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: habitsKeys.dashboard() });
    },
  });
};
