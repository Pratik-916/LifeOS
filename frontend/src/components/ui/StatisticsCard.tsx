import React from 'react';
import { Card } from '../Card';
import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export interface StatItem {
  id: string;
  title: string;
  value: string | number;
  icon: LucideIcon | any;
  color: string;
}

interface StatisticsCardProps {
  stats: StatItem[];
  columns?: '2' | '3' | '4' | 'auto';
}

import type { Variants } from 'framer-motion';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ stats, columns = 'auto' }) => {
  const getGridCols = () => {
    switch (columns) {
      case '2': return 'grid-cols-2';
      case '3': return 'grid-cols-2 md:grid-cols-3';
      case '4': return 'grid-cols-2 md:grid-cols-4';
      default: return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-auto-fit min-[200px]';
    }
  };

  return (
    <div className={`grid ${getGridCols()} gap-4`}>
      {stats.map((stat) => (
        <motion.div key={stat.id} variants={itemVariants} className="h-full">
          <Card className="p-4 flex flex-col justify-between group bg-surfaceHighlight hover:bg-surfaceHighlight border-border/20 h-full min-h-[100px]">
            <div className="flex justify-between items-start mb-3">
              <span className="text-secondary font-medium text-[10px] uppercase tracking-wider">{stat.title}</span>
              <stat.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", stat.color)} />
            </div>
            <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
