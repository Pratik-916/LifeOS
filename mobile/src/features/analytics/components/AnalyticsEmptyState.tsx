import React from 'react';
import { EmptyState } from '../../../components/ui/EmptyState';
import { BarChart2 } from 'lucide-react-native';

interface AnalyticsEmptyStateProps {
  onAction?: () => void;
}

export const AnalyticsEmptyState = ({ onAction }: AnalyticsEmptyStateProps) => {
  return (
    <EmptyState
      icon={<BarChart2 size={48} color="#9CA3AF" />}
      title="No data available"
      description="Start completing tasks, habits, and goals to see your analytics grow."
      actionTitle={onAction ? "Refresh" : undefined}
      onAction={onAction}
    />
  );
};
