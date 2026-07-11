import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export const Toaster = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleAdd = (type: 'success' | 'error' | 'info') => (e: Event) => {
      const customEvent = e as CustomEvent;
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, type, ...customEvent.detail }]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    };

    const onSucc = handleAdd('success');
    const onErr = handleAdd('error');
    const onInf = handleAdd('info');

    window.addEventListener('toast:success', onSucc);
    window.addEventListener('toast:error', onErr);
    window.addEventListener('toast:info', onInf);

    return () => {
      window.removeEventListener('toast:success', onSucc);
      window.removeEventListener('toast:error', onErr);
      window.removeEventListener('toast:info', onInf);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md min-w-[300px] max-w-sm ${
              toast.type === 'error' ? 'bg-danger/10 border-danger/20 text-danger' :
              toast.type === 'success' ? 'bg-success/10 border-success/20 text-success' :
              'bg-surfaceHighlight border-border/20 text-primary'
            }`}
          >
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
            
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{toast.title}</h4>
              {toast.message && <p className="text-xs mt-1 opacity-80">{toast.message}</p>}
            </div>
            
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
