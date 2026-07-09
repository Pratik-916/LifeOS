import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuickActions } from '../hooks/useQuickActions';
import { CheckSquare, Target, Repeat, PenTool, Image as ImageIcon, Edit3, Plus } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';

const iconMap: Record<string, any> = {
  CheckSquare, Target, Repeat, PenTool, Image: ImageIcon, Edit3
};

export const QuickActions = () => {
  const { data: actions, isLoading } = useQuickActions();
  const navigate = useNavigate();

  if (isLoading || !actions) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="min-w-[120px] h-12 bg-surfaceElevated rounded-xl border border-border/10"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold text-primary">Quick Actions</h2>
        <div className="h-px flex-1 bg-border/10 ml-4"></div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x">
        {actions.map((action, index) => {
          const Icon = iconMap[action.icon] || Plus;
          return (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={action.id}
              onClick={() => navigate(action.path)}
              className="snap-start flex-shrink-0 flex items-center gap-3 bg-surfaceElevated hover:bg-surfaceHighlight border border-border/10 hover:border-border/30 rounded-xl px-4 py-3 transition-all group"
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", action.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm text-primary whitespace-nowrap">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
