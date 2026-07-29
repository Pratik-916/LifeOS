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
      title={isSearch ? "No habits found" : "Small steps matter."}
      description={isSearch ? "Try adjusting your search or filters." : "Start with one."}
      actionLabel={onAdd ? "Create Habit" : undefined}
      onAction={onAdd}
    />
  );
};
