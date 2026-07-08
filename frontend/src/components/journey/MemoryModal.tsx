import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, AlignLeft, Tag, Image as ImageIcon } from 'lucide-react';
import type { Memory } from '../../types';
import { Button } from '../Button';
import { Card } from '../Card';
import { format } from 'date-fns';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  memory?: Memory | null;
}

import type { Variants } from 'framer-motion';

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }
};

export const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose, onSave, memory }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tags, setTags] = useState('');
  
  useEffect(() => {
    if (memory && isOpen) {
      setTitle(memory.title);
      setDescription(memory.description);
      setDate(memory.date.split('T')[0]);
      setTags(memory.tags.join(', '));
    } else if (isOpen) {
      setTitle('');
      setDescription('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setTags('');
    }
  }, [memory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date) return;

    onSave({
      title,
      description,
      date: new Date(date).toISOString(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      photos: memory?.photos || [],
      favorite: memory?.favorite || false
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
                <h2 className="text-xl font-bold">{memory ? 'Edit Memory' : 'Add Memory'}</h2>
                <button onClick={onClose} className="p-2 hover:bg-surfaceHighlight rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto no-scrollbar flex-1">
                <form id="memory-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary">Memory Title <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="A moment to remember..."
                      required
                      autoFocus
                      className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-3 text-lg font-medium focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary flex items-center gap-2">
                      <AlignLeft className="w-4 h-4" /> Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What happened? How did it feel?"
                      required
                      className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors dark:[color-scheme:dark] [color-scheme:light]"
                      />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary flex items-center gap-2">
                        <Tag className="w-4 h-4" /> Tags
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Family, Travel, Milestone..."
                        className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>

                  {/* Photos Placeholder */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Photos
                    </label>
                    <div className="w-full border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center justify-center text-secondary hover:border-border/20 transition-colors cursor-pointer bg-surfaceHighlight">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm font-medium">Click to add photos</p>
                      <p className="text-xs opacity-60">Photos feature coming soon</p>
                    </div>
                  </div>

                </form>
              </div>

              <div className="p-6 border-t border-border/20 flex justify-end gap-3 bg-surfaceHighlight">
                <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                <Button variant="primary" type="submit" form="memory-form">
                  {memory ? 'Save Changes' : 'Add Memory'}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
