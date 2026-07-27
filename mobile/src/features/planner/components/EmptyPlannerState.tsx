import React from 'react';
import { EmptyState } from '../../../design-system';

interface EmptyPlannerStateProps {
  onAdd?: () => void;
  type?: 'search' | 'today' | 'all-done' | 'empty';
}

export const EmptyPlannerState: React.FC<EmptyPlannerStateProps> = ({ onAdd, type = 'empty' }) => {
  let icon: "Search" | "CheckCircle2" | "Sun" | "Inbox" = "Inbox";
  let title = "No tasks yet";
  let description = "Add a task to get started.";

  if (type === 'search') {
    icon = "Search";
    title = "No tasks found";
    description = "Try adjusting your search query.";
  } else if (type === 'today') {
    icon = "Sun";
    title = "A clear day ahead";
    description = "You have nothing scheduled for today. Enjoy the calm.";
  } else if (type === 'all-done') {
    icon = "CheckCircle2";
    title = "Everything is completed";
    description = "You've crushed your list. Time to rest.";
  }

  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      actionLabel={onAdd && type !== 'search' ? "Quick Add" : undefined}
      onAction={onAdd}
    />
  );
};
