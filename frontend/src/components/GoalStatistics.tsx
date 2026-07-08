import React from 'react';
import { Target, Flag, Zap, Trophy } from 'lucide-react';
import { Card } from './Card';
import { useGoalStatistics } from '../features/goals/hooks';

export const GoalStatistics: React.FC = () => {
  const { data: stats, isLoading } = useGoalStatistics();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-surfaceHighlight h-[90px] rounded-2xl border border-border/20" />
        ))}
      </div>
    );
  }

  const total = stats?.total_goals || 0;
  const completed = stats?.completed || 0;
  const inProgress = stats?.active || 0;
  const overallProgress = stats?.average_progress ? Math.round(stats.average_progress) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-4 bg-surfaceHighlight border-border/20 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-secondary mb-1">
          <Target className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Total Goals</span>
        </div>
        <span className="text-3xl font-bold">{total}</span>
      </Card>
      
      <Card className="p-4 bg-surfaceHighlight border-border/20 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-accent mb-1">
          <Flag className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Active</span>
        </div>
        <span className="text-3xl font-bold">{inProgress}</span>
      </Card>

      <Card className="p-4 bg-surfaceHighlight border-border/20 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-success mb-1">
          <Trophy className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider text-success">Completed</span>
        </div>
        <span className="text-3xl font-bold">{completed}</span>
      </Card>

      <Card className="p-4 bg-surfaceHighlight border-border/20 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-purple-500/5 pointer-events-none" />
        <div className="flex items-center gap-2 text-secondary mb-1 relative z-10">
          <Zap className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Avg Progress</span>
        </div>
        <span className="text-3xl font-bold relative z-10">{overallProgress}%</span>
      </Card>
    </div>
  );
};

