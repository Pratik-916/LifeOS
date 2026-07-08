import { useFavoriteGoal } from './useFavoriteGoal';

export function usePinGoal() {
  // Pinning a goal is equivalent to favoring it in the current API schema
  return useFavoriteGoal();
}
