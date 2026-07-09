import React from 'react';
import { FeatureErrorBoundary } from '../../../components/ui/FeatureErrorBoundary';
import { Card } from '../../../components/Card';
import { cn } from '../../../lib/utils';
import { RefreshCw } from 'lucide-react';

interface DashboardWidgetProps {
  id: string;
  title: string;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  id,
  title,
  isLoading,
  isError,
  error,
  isEmpty,
  onRefresh,
  children,
  emptyState,
  headerAction,
  className,
  contentClassName,
}) => {
  return (
    <FeatureErrorBoundary featureName={`Widget: ${title}`}>
      <Card className={cn("flex flex-col h-full", className)}>
        <div className="flex items-center justify-between p-4 border-b border-border/5">
          <h3 className="font-bold text-primary text-lg">{title}</h3>
          <div className="flex items-center gap-2">
            {headerAction}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surfaceHighlight transition-colors"
                title="Refresh Widget"
              >
                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              </button>
            )}
          </div>
        </div>

        <div className={cn("flex-1 p-4 overflow-hidden relative", contentClassName)}>
          {isLoading ? (
            <div className="absolute inset-0 p-4 bg-surface/50 backdrop-blur-[2px] z-10 flex flex-col gap-3 animate-pulse">
              <div className="h-4 bg-surfaceHighlight rounded w-3/4"></div>
              <div className="h-4 bg-surfaceHighlight rounded w-1/2"></div>
              <div className="h-8 bg-surfaceHighlight rounded w-full mt-auto"></div>
            </div>
          ) : isError ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <p className="text-danger text-sm mb-2">Failed to load data.</p>
              {error && (
                <p className="text-xs text-secondary mb-2">
                  {(error as any)?.response?.data?.message || (error as any)?.response?.data?.error?.message || error.message || 'Unknown error'}
                </p>
              )}
              {onRefresh && (
                <button onClick={onRefresh} className="text-xs text-accent hover:underline">
                  Try again
                </button>
              )}
            </div>
          ) : isEmpty ? (
            <div className="h-full flex items-center justify-center">
              {emptyState || <p className="text-secondary text-sm">No data available.</p>}
            </div>
          ) : (
            children
          )}
        </div>
      </Card>
    </FeatureErrorBoundary>
  );
};
