import React from 'react';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Target } from 'lucide-react-native';

interface EmptyHabitsStateProps {
  onAdd?: () => void;
  isSearch?: boolean;
}

export const EmptyHabitsState: React.FC<EmptyHabitsStateProps> = ({ onAdd, isSearch }) => {
  return (
    <EmptyState
      icon={<Target size={48} color="#9CA3AF" />}
      title={isSearch ? "No habits found" : "Build your first habit"}
      description={isSearch ? "Try adjusting your search or filters." : "Small actions every day lead to big changes."}
      actionTitle={onAdd ? "Create Habit" : undefined}
      onAction={onAdd}
    />
  );
};
