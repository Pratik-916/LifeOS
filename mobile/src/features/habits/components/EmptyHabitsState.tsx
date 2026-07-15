import React from 'react';
import { EmptyState,  } from '../../../design-system';

interface EmptyHabitsStateProps {
  onAdd?: () => void;
  isSearch?: boolean;
}

export const EmptyHabitsState: React.FC<EmptyHabitsStateProps> = ({ onAdd, isSearch }) => {
  return (
    <EmptyState
      icon="Target"
      title={isSearch ? "No habits found" : "Build your first habit"}
      description={isSearch ? "Try adjusting your search or filters." : "Small actions every day lead to big changes."}
      actionLabel={onAdd ? "Create Habit" : undefined}
      onAction={onAdd}
    />
  );
};
