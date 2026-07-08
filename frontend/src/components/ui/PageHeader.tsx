import React from 'react';
import { Plus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  actionLabel, 
  actionIcon: ActionIcon = Plus, 
  onAction 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-secondary text-sm">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
        >
          <ActionIcon className="w-4 h-4" /> {actionLabel}
        </button>
      )}
    </div>
  );
};
