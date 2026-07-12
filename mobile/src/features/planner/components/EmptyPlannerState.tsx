import React from 'react';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ListTodo } from 'lucide-react-native';

interface EmptyPlannerStateProps {
  onAdd?: () => void;
  isSearch?: boolean;
}

export const EmptyPlannerState: React.FC<EmptyPlannerStateProps> = ({ onAdd, isSearch }) => {
  return (
    <EmptyState
      icon={<ListTodo size={48} color="#9CA3AF" />}
      title={isSearch ? "No tasks found" : "You're all caught up!"}
      description={isSearch ? "Try adjusting your filters or search query." : "Enjoy your free time, or add a new task to get started."}
      actionTitle={onAdd ? "Add Task" : undefined}
      onAction={onAdd}
    />
  );
};
