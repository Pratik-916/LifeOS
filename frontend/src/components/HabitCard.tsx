import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Edit2, Trash2, Heart, CheckCircle2 } from 'lucide-react';
import { format, subDays } from 'date-fns';
import type { HabitModel } from '../features/habits/api/habits.types';
import { cn } from '../lib/utils';
import { Card } from './Card';
import { useFavoriteHabit, useLogHabit } from '../features/habits/hooks';

interface HabitCardProps {
  habit: HabitModel;
  onEdit: (habit: HabitModel) => void;
  onDelete: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete }) => {
  const favoriteHabit = useFavoriteHabit();
  const logHabit = useLogHabit();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    favoriteHabit.mutate({ id: habit.id, isFavorite: !habit.isFavorite });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(habit.id);
    window.dispatchEvent(new CustomEvent('toast:undoable-delete', { detail: { taskId: habit.id, module: 'habits' } }));
  };

  const handleLogHabit = (e: React.MouseEvent) => {
    e.stopPropagation();
    logHabit.mutate({ id: habit.id, payload: { count: 1 } });
  };

  const isCompletedToday = habit.currentCount >= habit.targetCount;
  const progressPct = Math.round((habit.currentCount / habit.targetCount) * 100);
  const displayTitle = habit.title;

  return (
    <Card className="p-0 overflow-hidden border border-border/20 bg-surfaceHighlight hover:bg-surfaceHighlight transition-colors">
      <div className="p-5 relative group">
        <div className="absolute top-4 right-4 flex items-center gap-2 transition-opacity">
          <button 
            onClick={handleToggleFavorite}
            className={cn("p-1.5 rounded-md hover:bg-surfaceHighlight transition-colors", habit.isFavorite ? "text-red-500 opacity-100" : "text-secondary hover:text-red-400")}
          >
            <Heart className="w-4 h-4" fill={habit.isFavorite ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => onEdit(habit)}
            className="p-1.5 text-secondary hover:text-accent hover:bg-surfaceHighlight rounded-md transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-secondary hover:text-danger hover:bg-surfaceHighlight rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogHabit}
            className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-full bg-surfaceHighlight border border-border/20 group/btn focus:outline-none"
          >
            {/* SVG Progress Circle */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="transparent" stroke="var(--chart-grid)" strokeWidth="8" />
              <motion.circle 
                cx="50" cy="50" r="46" 
                fill="transparent" 
                stroke="currentColor" 
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 46}
                initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - Math.min(progressPct, 100) / 100) }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn("text-accent", habit.color && habit.color.includes('green') ? 'text-green-500' : habit.color && habit.color.includes('purple') ? 'text-purple-500' : habit.color && habit.color.includes('orange') ? 'text-orange-500' : 'text-blue-500')}
              />
            </svg>
            {isCompletedToday ? (
              <CheckCircle2 className="w-8 h-8 text-success absolute" />
            ) : (
              <span className="text-xl font-bold absolute group-hover/btn:scale-110 transition-transform text-primary">{habit.currentCount}</span>
            )}
          </button>

          <div className="flex-1 pr-16">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-primary">{displayTitle}</h3>
              <span className="px-2 py-0.5 rounded-full bg-surfaceHighlight border border-border/20 text-[10px] font-semibold text-secondary uppercase tracking-wider">
                {habit.category}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-medium text-secondary mt-2">
              <span className="flex items-center gap-1.5 px-2 py-1 bg-surfaceHighlight rounded-md sensitive-data">
                <Flame className={cn("w-3.5 h-3.5", habit.currentStreak > 0 ? "text-orange-500" : "text-secondary/50")} fill={habit.currentStreak > 0 ? "currentColor" : "none"} />
                {habit.currentStreak} Day Streak
              </span>
              <span>Target: {habit.targetCount} / {habit.frequency}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/10 flex items-center justify-between">
          <span className="text-xs font-medium text-secondary">Last 7 Days</span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => {
              const dateStr = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
              const completed = habit.logs?.some(log => log.completionDate === dateStr) || false;
              
              return (
                <button
                  key={dateStr}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!completed) {
                      logHabit.mutate({ id: habit.id, payload: { completion_date: dateStr, count: 1 } });
                    }
                  }}
                  disabled={completed}
                  title={dateStr}
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                    completed 
                      ? "bg-success text-white" 
                      : "bg-surfaceHighlight border border-border/20 text-secondary hover:border-accent hover:text-accent cursor-pointer"
                  )}
                >
                  {format(new Date(dateStr + 'T12:00:00'), 'EE').charAt(0)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
