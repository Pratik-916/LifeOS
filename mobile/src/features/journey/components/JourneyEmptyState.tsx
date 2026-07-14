import React from 'react';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Book } from 'lucide-react-native';

interface JourneyEmptyStateProps {
  onAction?: () => void;
  isSearch?: boolean;
}

export const JourneyEmptyState = ({ onAction, isSearch }: JourneyEmptyStateProps) => {
  return (
    <EmptyState
      icon={<Book size={48} color="#9CA3AF" />}
      title={isSearch ? "No results found" : "Your Journey begins here"}
      description={isSearch ? "Try adjusting your search or filters." : "Start documenting your memories, milestones, and important life events."}
      actionTitle={onAction ? "Create Memory" : undefined}
      onAction={onAction}
    />
  );
};
