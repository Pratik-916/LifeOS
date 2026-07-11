import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Edit3, Trash2, Calendar, Clock } from 'lucide-react';
import type { Task } from '../api/planner.types';
import { cn } from '../../../lib/utils';
import { format, parseISO } from 'date-fns';
import { useCompleteTask } from '../hooks/useCompleteTask';
import { useDeleteTask } from '../hooks/useDeleteTask';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  high: 'text-danger bg-danger/10 border-danger/20',
  medium: 'text-warning bg-warning/10 border-warning/20',
  low: 'text-accent bg-accent/10 border-accent/20'
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const completeTaskMutation = useCompleteTask();
  const deleteTaskMutation = useDeleteTask();

  const handleToggle = () => completeTaskMutation.mutate({ id: task.id, completed: task.status !== 'completed' });
  const handleDelete = () => deleteTaskMutation.mutate(task.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface rounded-2xl hover:bg-surfaceHighlight transition-all duration-200 hover:shadow-md hover:-translate-y-[1px] group border border-border/20 gap-4"
    >
      <div className="flex items-start sm:items-center gap-4 flex-1">
        <button 
          className={cn(
            "flex-shrink-0 mt-1 sm:mt-0 transition-colors duration-200",
            task.status === 'completed' ? "text-success" : "text-border hover:text-primary"
          )}
          onClick={handleToggle}
          disabled={completeTaskMutation.isPending}
          aria-label={task.status === 'completed' ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
        
        <div className="flex flex-col flex-1">
          <span className={cn(
            "font-medium text-lg mb-1 transition-colors duration-200",
            task.status === 'completed' ? "text-secondary line-through" : "text-text"
          )}>{task.title}
          </span>
          
          {task.description && (
            <span className="text-sm text-secondary/70 mt-1 line-clamp-2">
              {task.description}
            </span>
          )}
          
          <div className="flex items-center gap-2 mt-2 text-xs text-secondary/80 font-medium overflow-x-auto no-scrollbar">
            <span className="px-2 py-0.5 rounded bg-surfaceHighlight">{task.category}</span>
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{format(parseISO(task.dueDate), 'MMM do')}</span>
              </div>
            )}
            {task.dueTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.dueTime}</span>
              </div>
            )}
            {!!task.estimatedMinutes && (
              <div className="flex items-center gap-1 text-accent">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.estimatedMinutes}m</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:ml-4 w-full sm:w-auto">
        <div className={cn("px-2.5 py-1 rounded-md border text-xs font-semibold capitalize whitespace-nowrap", priorityColors[task.priority])}>
          {task.priority}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-end sm:self-auto mt-2 sm:mt-0">
          <button 
            className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-colors duration-200"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <Edit3 size={18} />
          </button>
          <button 
            className="p-2 text-secondary hover:text-danger hover:bg-danger/10 rounded-xl transition-colors duration-200"
            onClick={handleDelete}
            disabled={deleteTaskMutation.isPending}
            aria-label="Delete task"
          >  <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
