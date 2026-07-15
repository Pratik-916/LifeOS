import React from 'react';
import { EmptyState,  } from '../../../design-system';

interface AnalyticsEmptyStateProps {
  onAction?: () => void;
  domain?: 'planner' | 'habits' | 'goals' | 'journal' | 'journey' | 'all';
}

export const AnalyticsEmptyState = ({ onAction, domain = 'all' }: AnalyticsEmptyStateProps) => {
  const getMessage = () => {
    switch (domain) {
      case 'planner': return 'Start adding tasks to your Planner to see your productivity trends.';
      case 'habits': return 'Track a habit for a few days to generate consistency heatmaps.';
      case 'goals': return 'Create your first Goal to track milestone velocity.';
      case 'journal': return 'Write a few Journal entries to see mood and word count analytics.';
      case 'journey': return 'Save some Journey memories to populate your timeline growth.';
      default: return 'Start completing tasks, habits, and goals across LifeOS to see your analytics grow.';
    }
  };

  return (
    <EmptyState
      icon="BarChart2"
      title="No data available"
      description={getMessage()}
      actionLabel={onAction ? "Refresh Analytics" : undefined}
      onAction={onAction}
    />
  );
};
