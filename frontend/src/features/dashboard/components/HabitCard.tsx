import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardWidget } from './DashboardWidget';
import { useHabits } from '../../habits/hooks';
import { Flame, ArrowRight, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';

export const HabitCard = () => {
  const { data: habitsResponse, isLoading, isError, refetch } = useHabits({});
  const navigate = useNavigate();
  
  const activeHabits = habitsResponse?.results?.filter(h => h.status === 'active') || [];
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const habitsToComplete = activeHabits.filter(h => {
    // Basic logic to check if a habit is due today and not completed.
    // In a real implementation, we'd use the habit schedule and logs.
    // For this dashboard, we just check if today's date exists in logs.
    const isCompletedToday = h.logs?.some(c => c.completionDate === todayStr);
    return !isCompletedToday;
  }).slice(0, 4);

  return (
    <DashboardWidget
      id="habits"
      title="Today's Habits"
      isLoading={isLoading}
      isError={isError}
      error={habitsResponse instanceof Error ? habitsResponse : null}
      isEmpty={activeHabits.length === 0}
      onRefresh={refetch}
      headerAction={
        <button 
          onClick={() => navigate('/habits')}
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View Habits <ArrowRight className="w-3 h-3" />
        </button>
      }
      emptyState={
        <div className="text-center text-secondary py-4">
          <Flame className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No active habits.</p>
        </div>
      }
    >
      <div className="space-y-4">
        {habitsToComplete.length === 0 && activeHabits.length > 0 ? (
          <div className="text-center text-success py-4">
            <Check className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">All habits completed for today!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {habitsToComplete.map(habit => (
              <div 
                key={habit.id} 
                onClick={() => navigate('/habits')}
                className="bg-surfaceHighlight hover:bg-surfaceHighlight/80 p-3 rounded-xl cursor-pointer border border-border/5 transition-colors flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{habit.icon || '🔥'}</span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">
                    <Flame className="w-3 h-3" />
                    {habit.currentStreak}
                  </div>
                </div>
                <h4 className="font-semibold text-primary text-sm truncate">{habit.title}</h4>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
};
