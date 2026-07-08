import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  className?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  message, 
  className,
  action
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border/50 rounded-2xl bg-surfaceHighlight", className)}>
      <div className="w-16 h-16 rounded-full bg-surfaceHighlight flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-secondary text-sm max-w-[280px] mb-4">
        {message}
      </p>
      {action}
    </div>
  );
};
