import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardWidget } from './DashboardWidget';
import { useGoals } from '../../goals/hooks';
import { Target, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const GoalCard = () => {
  const { data: goalsResponse, isLoading, isError, refetch } = useGoals({});
  const navigate = useNavigate();

  const activeGoals = goalsResponse?.results?.filter(g => g.status === 'In Progress' || g.status === 'Not Started') || [];
  
  // Sort by closest target date
  const sortedGoals = [...activeGoals].sort((a, b) => {
    if (!a.targetDate) return 1;
    if (!b.targetDate) return -1;
    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
  }).slice(0, 3);

  return (
    <DashboardWidget
      id="goals"
      title="Active Goals"
      isLoading={isLoading}
      isError={isError}
      error={goalsResponse instanceof Error ? goalsResponse : null}
      isEmpty={activeGoals.length === 0}
      onRefresh={refetch}
      headerAction={
        <button 
          onClick={() => navigate('/goals')}
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View Goals <ArrowRight className="w-3 h-3" />
        </button>
      }
      emptyState={
        <div className="text-center text-secondary py-4">
          <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No active goals.</p>
        </div>
      }
    >
      <div className="space-y-4">
        {sortedGoals.map(goal => (
          <div key={goal.id} onClick={() => navigate('/goals')} className="group cursor-pointer">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-primary text-sm truncate group-hover:text-accent transition-colors">
                {goal.title}
              </span>
              <span className="text-xs font-medium text-secondary">
                {goal.progress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-surfaceHighlight rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-accent transition-all duration-500 ease-out"
                style={{ width: `${Math.min(Math.max(goal.progress, 0), 100)}%` }}
              />
            </div>
            {goal.targetDate && (
              <p className="text-[10px] text-secondary">
                Target: {format(parseISO(goal.targetDate), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
};
