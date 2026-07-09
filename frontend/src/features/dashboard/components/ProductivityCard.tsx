import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardWidget } from './DashboardWidget';
import { useDashboardSummary } from '../../analytics/hooks';
import { TrendingUp, ArrowRight } from 'lucide-react';

export const ProductivityCard = () => {
  const { data: summary, isLoading, isError, refetch } = useDashboardSummary();
  const navigate = useNavigate();

  return (
    <DashboardWidget
      id="productivity"
      title="Productivity"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!summary}
      onRefresh={refetch}
      headerAction={
        <button 
          onClick={() => navigate('/analytics')}
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View Full <ArrowRight className="w-3 h-3" />
        </button>
      }
    >
      {summary && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" className="text-border/20 stroke-current" strokeWidth="12" fill="none" />
              <circle 
                cx="64" cy="64" r="56" 
                className="text-accent stroke-current" 
                strokeWidth="12" fill="none" 
                strokeDasharray="351.8" 
                strokeDashoffset={351.8 - (351.8 * summary.productivityScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-primary">{summary.productivityScore}</span>
              <span className="text-xs text-secondary font-medium">Score</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-surfaceHighlight rounded-xl p-3 text-center">
              <span className="block text-xl font-bold text-success">{summary.completedTasks}</span>
              <span className="text-xs text-secondary uppercase tracking-wider">Completed</span>
            </div>
            <div className="bg-surfaceHighlight rounded-xl p-3 text-center">
              <span className="block text-xl font-bold text-warning">{summary.pendingTasks}</span>
              <span className="text-xs text-secondary uppercase tracking-wider">Pending</span>
            </div>
          </div>
        </div>
      )}
    </DashboardWidget>
  );
};
