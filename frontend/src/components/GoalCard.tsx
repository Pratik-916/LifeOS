import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, Edit2, Trash2, Heart, Undo } from 'lucide-react';
import type { Goal } from '../types';
import { cn } from '../lib/utils';
import { Card } from './Card';
import { MilestoneList } from './MilestoneList';
import { format, parseISO } from 'date-fns';
import { useUpdateGoal, useFavoriteGoal, useRestoreGoal } from '../features/goals/hooks';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const updateGoal = useUpdateGoal();
  const favoriteGoal = useFavoriteGoal();
  const restoreGoal = useRestoreGoal();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    favoriteGoal.mutate({ id: goal.id, isFavorite: !goal.favorite });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(goal.id);
    window.dispatchEvent(new CustomEvent('toast:undoable-delete', { detail: { taskId: goal.id, module: 'goals' } }));
  };

  const getMilestonesDTO = (milestones: Goal['milestones']) => {
    return milestones.map((m, index) => ({
      title: m.title,
      is_completed: m.completed,
      due_date: m.dueDate,
      order: index,
    }));
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const updated = goal.milestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    updateGoal.mutate({ id: goal.id, payload: { milestones: getMilestonesDTO(updated) } });
  };

  const handleAddMilestone = (goalId: string, milestone: any) => {
    const updated = [...goal.milestones, milestone];
    updateGoal.mutate({ id: goal.id, payload: { milestones: getMilestonesDTO(updated) } });
  };

  const handleDeleteMilestone = (goalId: string, milestoneId: string) => {
    const updated = goal.milestones.filter(m => m.id !== milestoneId);
    updateGoal.mutate({ id: goal.id, payload: { milestones: getMilestonesDTO(updated) } });
  };

  const handleManualProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow manual progress if there are no milestones
    // However, backend auto-calculates progress based on milestones, so we just send progress if no milestones
    // Actually, backend progress field can be written to directly. 
    // We send it via updateGoal. Wait, UpdateGoalPayload doesn't explicitly expose progress if backend auto-updates it,
    // but the model has a `progress` field. I will pass it through payload if needed, or we might need to add it to types.
    // Let's add it to types and mutate.
    const val = parseInt(e.target.value, 10);
    updateGoal.mutate({ id: goal.id, payload: { progress: val } as any });
  };

  const displayDate = goal.targetDate || goal.deadline || new Date().toISOString();
  let formattedDate = displayDate;
  try {
    formattedDate = format(parseISO(displayDate), 'MMM do, yyyy');
  } catch(e) {}

  return (
    <Card className="p-0 overflow-hidden border border-border/20 bg-surfaceHighlight hover:bg-surfaceHighlight transition-colors">
      <div 
        className="p-6 cursor-pointer group relative"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleToggleFavorite}
            className={cn("p-1.5 rounded-md hover:bg-surfaceHighlight transition-colors", goal.favorite ? "text-red-500 opacity-100" : "text-secondary hover:text-red-400")}
          >
            <Heart className="w-4 h-4" fill={goal.favorite ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(goal); }}
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pr-24">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">{goal.title}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-surfaceHighlight border border-border/20 text-[10px] font-semibold text-secondary uppercase tracking-wider">
                {goal.category}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-secondary">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formattedDate}</span>
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                goal.status === 'Completed' ? 'bg-success/20 text-success' :
                goal.status === 'In Progress' ? 'bg-accent/20 text-accent' :
                goal.status === 'Archived' ? 'bg-secondary/20 text-secondary' :
                'bg-surfaceHighlight text-primary'
              )}>
                {goal.status}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:w-1/3 w-full mt-4 md:mt-0">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1 text-xs font-bold">
                <span className="text-secondary">Progress</span>
                <span className="text-primary sensitive-data">{goal.progress || 0}%</span>
              </div>
              <div className="h-2 w-full bg-surfaceHighlight rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress || 0}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={cn("h-full rounded-full bg-gradient-to-r", goal.color || "bg-accent")}
                />
              </div>
            </div>
            <motion.div 
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="w-8 h-8 flex-shrink-0 rounded-full bg-surfaceHighlight flex items-center justify-center text-secondary group-hover:text-primary transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-border/20 bg-surfaceHighlight">
              {goal.description && (
                <p className="text-sm text-secondary/90 leading-relaxed mb-6 font-serif italic">
                  "{goal.description}"
                </p>
              )}
              
              <MilestoneList 
                goalId={goal.id} 
                milestones={goal.milestones || []} 
                onToggle={handleToggleMilestone}
                onAdd={handleAddMilestone}
                onDelete={handleDeleteMilestone}
              />
              
              {(!goal.milestones || goal.milestones.length === 0) && (
                <div className="mt-6">
                  <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 block">Manual Progress ({goal.progress || 0}%)</label>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={goal.progress || 0} 
                    onChange={handleManualProgress}
                    className="w-full accent-accent bg-surfaceHighlight h-2 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

