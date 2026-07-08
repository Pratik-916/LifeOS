import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X, Calendar, Clock, Tag, AlignLeft, Flag } from 'lucide-react';
import type { Task } from '../types';
import { Button } from './Button';
import { Card } from './Card';
import { format } from 'date-fns';
import { useAppStore } from '../store/useAppStore';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Task;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }
};

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueTime, setDueTime] = useState('');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [notes, setNotes] = useState('');

  // Add useAppStore
  const settings = useAppStore(state => state.settings);

  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setCategory(initialData.category);
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate);
      setDueTime(initialData.dueTime || '');
      setStatus(initialData.status);
      setNotes(initialData.notes || '');
    } else if (isOpen) {
      // Reset form for new task, and use default settings
      setTitle('');
      setDescription('');
      setCategory('Personal');
      setPriority('medium');
      setDueDate(format(new Date(), 'yyyy-MM-dd'));
      setDueTime(settings?.defaultReminderTime || '');
      setStatus('todo');
      setNotes('');
    }
  }, [initialData, isOpen, settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return; // Validation

    onSave({
      title,
      description,
      category,
      priority,
      dueDate,
      dueTime,
      status,
      notes,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col z-10"
          >
            <Card className="flex flex-col h-full bg-surface border-border/20 shadow-xl overflow-hidden rounded-3xl">
              <div className="flex justify-between items-center p-6 border-b border-border/20">
                <h2 className="text-xl font-bold">{initialData ? 'Edit Task' : 'Create Task'}</h2>
                <button onClick={onClose} className="p-2 hover:bg-surfaceHighlight rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto no-scrollbar flex-1">
                <form id="task-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary">Task Title <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What needs to be done?"
                      required
                      autoFocus
                      className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-3 text-lg font-medium focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary flex items-center gap-2">
                      <AlignLeft className="w-4 h-4" /> Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add more details about this task..."
                      className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date & Time */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Due Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          required
                          className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors dark:[color-scheme:dark] [color-scheme:light]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Due Time
                        </label>
                        <input
                          type="time"
                          value={dueTime}
                          onChange={(e) => setDueTime(e.target.value)}
                          className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors dark:[color-scheme:dark] [color-scheme:light]"
                        />
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary flex items-center gap-2">
                          <Flag className="w-4 h-4" /> Priority
                        </label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as any)}
                          className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary flex items-center gap-2">
                          <Tag className="w-4 h-4" /> Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
                        >
                          <option value="Work">Work</option>
                          <option value="Personal">Personal</option>
                          <option value="Health">Health</option>
                          <option value="Learning">Learning</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-border/20 flex justify-end gap-3 bg-surfaceHighlight">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button variant="primary" type="submit" form="task-form">
                  {initialData ? 'Save Changes' : 'Create Task'}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
