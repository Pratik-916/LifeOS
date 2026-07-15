import React from 'react';
import { EmptyState } from '../../../design-system';

interface JourneyEmptyStateProps {
  onAction?: () => void;
  isSearch?: boolean;
}

export const JourneyEmptyState = ({ onAction, isSearch }: JourneyEmptyStateProps) => {
  return (
    <EmptyState
      icon="Book"
      title={isSearch ? "No results found" : "Your Journey begins here"}
      description={isSearch ? "Try adjusting your search or filters." : "Start documenting your memories, milestones, and important life events."}
      actionLabel={onAction ? "Create Memory" : undefined}
      onAction={onAction}
    />
  );
};
