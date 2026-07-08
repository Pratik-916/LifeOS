import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", isDestructive = false, onConfirm, onCancel
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-surface rounded-3xl border border-border/20 shadow-xl overflow-hidden flex flex-col p-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-full flex-shrink-0 ${isDestructive ? 'bg-danger/20 text-danger' : 'bg-accent/20 text-accent'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary mb-1">{title}</h3>
              <p className="text-sm text-secondary leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-auto">
            <button 
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-surfaceHighlight transition-colors text-secondary hover:shadow-sm hover:-translate-y-[1px] duration-200"
            >
              {cancelLabel}
            </button>
            <button 
              onClick={() => { onConfirm(); onCancel(); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-all hover:shadow-md hover:-translate-y-[1px] duration-200 ${isDestructive ? 'bg-danger hover:bg-danger/90' : 'bg-accent hover:bg-accent/90'}`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
