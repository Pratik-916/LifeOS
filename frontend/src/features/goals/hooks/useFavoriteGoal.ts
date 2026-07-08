import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalsKeys } from '../api/goals.keys';

export function useFavoriteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) => 
      goalsApi.favoriteGoal(id, isFavorite),
    onSuccess: (updatedGoal) => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalsKeys.detail(updatedGoal.id) });
      queryClient.invalidateQueries({ queryKey: goalsKeys.statistics() });
    },
  });
}
