import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Edit3, Trash2, Calendar, Clock } from 'lucide-react';
import type { Task } from '../types';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  high: 'text-danger bg-danger/10 border-danger/20',
  medium: 'text-warning bg-warning/10 border-warning/20',
  low: 'text-accent bg-accent/10 border-accent/20'
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface rounded-2xl hover:bg-surfaceHighlight transition-all duration-200 hover:shadow-md hover:-translate-y-[1px] group border border-border/20 gap-4"
    >
      <div className="flex items-start sm:items-center gap-4 flex-1">
        <button onClick={() => onToggle(task.id)} className="focus:outline-none flex-shrink-0 mt-1 sm:mt-0">
          {(task.status === 'done' || (task as any).completed) ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <CheckCircle2 className="w-6 h-6 text-success" />
            </motion.div>
          ) : (
            <Circle className="w-6 h-6 text-secondary group-hover:text-accent transition-colors" />
          )}
        </button>
        
        <div className="flex flex-col flex-1">
          <span className={cn("font-medium transition-colors text-base", (task.status === 'done' || (task as any).completed) ? "text-secondary line-through" : "text-primary")}>
            {task.title}
          </span>
          
          {task.description && (
            <span className="text-sm text-secondary/70 mt-1 line-clamp-2">
              {task.description}
            </span>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium text-secondary">
            <span className="px-2 py-0.5 rounded bg-surfaceHighlight">{task.category}</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(parseISO(task.dueDate || (task as any).date || new Date().toISOString()), 'MMM do')}</span>
            </div>
            {(task.dueTime || (task as any).time) && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.dueTime || (task as any).time}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:ml-4 w-full sm:w-auto">
        <div className={cn("px-2.5 py-1 rounded-md border text-xs font-semibold capitalize whitespace-nowrap", priorityColors[task.priority])}>
          {task.priority}
        </div>
        
        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-2 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-lg transition-colors"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-2 text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
