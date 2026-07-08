import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, Hash, Palette, Loader2 } from 'lucide-react';
import type { Goal } from '../types';
import { format } from 'date-fns';
import { useCreateGoal, useUpdateGoal } from '../features/goals/hooks';
import type { CreateGoalPayload } from '../features/goals/api/goals.types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Goal;
}

const CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Finance', 'Project', 'Career'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Not Started', 'In Progress', 'Completed', 'Archived'];
const COLORS = [
  { label: 'Blue', value: 'from-blue-500 to-cyan-500' },
  { label: 'Green', value: 'from-green-500 to-emerald-500' },
  { label: 'Red', value: 'from-orange-500 to-red-500' },
  { label: 'Purple', value: 'from-purple-500 to-fuchsia-500' },
  { label: 'Pink', value: 'from-pink-500 to-rose-500' },
  { label: 'Yellow', value: 'from-yellow-400 to-orange-500' },
];

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, initialData }) => {
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const isPending = createGoal.isPending || updateGoal.isPending;

  const [formData, setFormData] = useState<Partial<Goal>>({
    title: '',
    description: '',
    category: 'Personal',
    priority: 'Medium',
    status: 'Not Started',
    targetDate: format(new Date(), 'yyyy-MM-dd'),
    progress: 0,
    favorite: false,
    color: COLORS[0].value,
    tags: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Personal',
        priority: 'Medium',
        status: 'Not Started',
        targetDate: format(new Date(), 'yyyy-MM-dd'),
        progress: 0,
        favorite: false,
        color: COLORS[0].value,
        tags: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || isPending) return;

    try {
      const payload: CreateGoalPayload = {
        title: formData.title,
        description: formData.description || '',
        category: formData.category || 'Personal',
        priority: formData.priority as any || 'Medium',
        target_date: formData.targetDate || format(new Date(), 'yyyy-MM-dd'),
        color: formData.color,
      };

      if (initialData) {
        await updateGoal.mutateAsync({
          id: initialData.id,
          payload: {
            ...payload,
            status: formData.status as any,
          }
        });
      } else {
        await createGoal.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save goal', error);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-surface rounded-3xl border border-border/20 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-border/20 bg-surfaceHighlight">
            <h2 className="text-xl font-bold">{initialData ? 'Edit Goal' : 'Create Goal'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-surfaceHighlight rounded-full transition-colors text-secondary hover:text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 no-scrollbar flex-1">
            <form id="goal-form" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary">Goal Title</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Run a Half Marathon"
                  className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all placeholder:text-secondary/50 text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is the context or motivation behind this goal?"
                  rows={3}
                  className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all placeholder:text-secondary/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    <Flag className="w-4 h-4" /> Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    <Hash className="w-4 h-4" /> Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none"
                  >
                    {PRIORITIES.map(pri => <option key={pri} value={pri}>{pri}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Target Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.targetDate ? formData.targetDate.split('T')[0] : ''}
                    onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-primary dark:[color-scheme:dark] [color-scheme:light]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none"
                  >
                    {STATUSES.map(stat => <option key={stat} value={stat}>{stat}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Color Theme
                  </label>
                  <div className="flex gap-2 items-center h-[42px]">
                    {COLORS.map(color => (
                      <button
                        key={color.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`w-6 h-6 rounded-full bg-gradient-to-r ${color.value} transition-transform ${formData.color === color.value ? 'scale-125 ring-2 ring-border ring-offset-2 ring-offset-background' : 'hover:scale-110'}`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </form>
          </div>

          <div className="p-6 border-t border-border/20 bg-surfaceHighlight flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-medium rounded-xl hover:bg-surfaceHighlight transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="goal-form"
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-xl shadow-lg shadow-accent/20 transition-all disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

