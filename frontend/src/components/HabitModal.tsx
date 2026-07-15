import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Palette, Hash } from 'lucide-react';
import type { HabitModel, CreateHabitPayload } from '../features/habits/api/habits.types';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Partial<CreateHabitPayload>) => void;
  initialData?: HabitModel;
}

const CATEGORIES = ['Health', 'Learning', 'Work', 'Personal', 'Finance', 'Other'];
const FREQUENCIES = ['daily', 'weekly'];
const COLORS = [
  { label: 'Blue', value: 'blue', className: 'bg-blue-500' },
  { label: 'Green', value: 'green', className: 'bg-green-500' },
  { label: 'Red', value: 'red', className: 'bg-red-500' },
  { label: 'Purple', value: 'purple', className: 'bg-purple-500' },
  { label: 'Pink', value: 'pink', className: 'bg-pink-500' },
  { label: 'Orange', value: 'orange', className: 'bg-orange-500' },
];

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<CreateHabitPayload>>({
    title: '',
    category: 'Health',
    frequency: 'daily',
    target_count: 1,
    color: COLORS[0].value,
    start_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        category: initialData.category,
        frequency: initialData.frequency,
        target_count: initialData.targetCount,
        color: initialData.color,
      });
    } else {
      setFormData({
        title: '',
        category: 'Health',
        frequency: 'daily',
        target_count: 1,
        color: COLORS[0].value,
        start_date: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;
    onSave(formData);
    onClose();
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
          role="dialog"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-surface rounded-3xl border border-border/20 shadow-xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-border/20 bg-surfaceHighlight">
            <h2 className="text-xl font-bold">{initialData ? 'Edit Habit' : 'Create Habit'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-surfaceHighlight rounded-full transition-colors text-secondary hover:text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <form id="habit-form" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary">Habit Name</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Drink 2L Water"
                  className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all placeholder:text-secondary/50 text-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    <Target className="w-4 h-4" /> Category
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
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value as any })}
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none"
                  >
                    {FREQUENCIES.map(freq => <option key={freq} value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    <Hash className="w-4 h-4" /> Target Completions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.target_count}
                    onChange={e => setFormData({ ...formData, target_count: parseInt(e.target.value) || 1 })}
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-primary"
                  />
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
                        className={`w-6 h-6 rounded-full ${color.className} transition-transform ${formData.color === color.value ? 'scale-125 ring-2 ring-border ring-offset-2 ring-offset-background' : 'hover:scale-110'}`}
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
              className="px-5 py-2.5 text-sm font-medium rounded-xl hover:bg-surfaceHighlight transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="habit-form"
              className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-xl shadow-lg shadow-accent/20 transition-all"
            >
              {initialData ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
