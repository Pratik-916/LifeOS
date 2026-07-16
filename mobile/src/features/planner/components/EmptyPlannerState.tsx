import React from 'react';
import { EmptyState } from '../../../design-system';


interface EmptyPlannerStateProps {
  onAdd?: () => void;
  isSearch?: boolean;
}

export const EmptyPlannerState: React.FC<EmptyPlannerStateProps> = ({ onAdd, isSearch }) => {
  return (
    <EmptyState
      icon={isSearch ? "Search" : "CheckCircle2"}
      title={isSearch ? "No tasks found" : "You're all caught up!"}
      description={isSearch ? "Try adjusting your filters or search query." : "Enjoy your free time, or add a new task to get started."}
      actionLabel={onAdd ? "Add Task" : undefined}
      onAction={onAdd}
    />
  );
};
