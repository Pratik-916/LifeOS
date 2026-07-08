import React from 'react';
import { BarChart3 } from 'lucide-react';

interface AnalyticsEmptyStateProps {
  message?: string;
}

export const AnalyticsEmptyState: React.FC<AnalyticsEmptyStateProps> = ({ 
  message = "Not enough data for this time period." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-8 text-center bg-surfaceHighlight rounded-xl border border-dashed border-border/50">
      <div className="w-12 h-12 rounded-full bg-surfaceHighlight flex items-center justify-center mb-3">
        <BarChart3 className="w-6 h-6 text-secondary/50" />
      </div>
      <p className="text-secondary text-sm px-4">{message}</p>
    </div>
  );
};
