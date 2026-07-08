import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, X } from 'lucide-react';
import type { Milestone } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MilestoneListProps {
  goalId: string;
  milestones: Milestone[];
  onToggle: (goalId: string, milestoneId: string) => void;
  onAdd: (goalId: string, milestone: Omit<Milestone, 'id'>) => void;
  onDelete: (goalId: string, milestoneId: string) => void;
}

export const MilestoneList: React.FC<MilestoneListProps> = ({ 
  goalId, milestones, onToggle, onAdd, onDelete 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    onAdd(goalId, {
      title: newTitle.trim(),
      completed: false
    });
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider">Milestones</h4>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsAdding(true); }}
          className="text-xs flex items-center gap-1 text-accent hover:text-accent/80 transition-colors focus:outline-none"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <AnimatePresence>
        {milestones.map((milestone) => (
          <motion.div 
            key={milestone.id} 
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-surfaceHighlight border border-border/20 group hover:border-border/20 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => onToggle(goalId, milestone.id)}
              className="flex-shrink-0 focus:outline-none"
            >
              {milestone.completed ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <Circle className="w-5 h-5 text-secondary hover:text-accent transition-colors" />
              )}
            </button>
            
            <span className={cn(
              "text-sm font-medium flex-1 transition-colors", 
              milestone.completed ? "text-secondary line-through" : "text-primary"
            )}>
              {milestone.title}
            </span>

            <button 
              onClick={() => onDelete(goalId, milestone.id)}
              className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 text-danger hover:bg-danger/10 rounded-full transition-all focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}

        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleAdd}
            className="flex items-center gap-3 p-2 rounded-xl bg-surfaceHighlight border border-accent/30"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Milestone title..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-primary placeholder:text-secondary px-2"
            />
            <button type="submit" className="p-1 text-accent hover:bg-accent/10 rounded-md transition-colors">
              <Plus className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="p-1 text-secondary hover:bg-surfaceHighlight rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      
      {milestones.length === 0 && !isAdding && (
        <div className="text-center py-4 border border-dashed border-border/50 rounded-xl bg-surfaceHighlight">
          <p className="text-xs text-secondary mb-2">No milestones yet.</p>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsAdding(true); }}
            className="text-xs text-accent hover:underline focus:outline-none"
          >
            Add your first milestone
          </button>
        </div>
      )}
    </div>
  );
};
