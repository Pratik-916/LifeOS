import React from 'react';
import { Card } from './Card';
import { cn } from '../lib/utils';
import { Activity, Target, Flame, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useHabitStatistics } from '../features/habits/hooks';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const HabitStatistics: React.FC = () => {
  const { data: stats, isLoading } = useHabitStatistics();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-surfaceHighlight h-[90px] rounded-2xl border border-border/20" />
        ))}
      </div>
    );
  }

  const cards = [
    { id: 'total', title: 'Active Habits', value: stats.totalHabits, icon: Target, color: 'text-blue-400' },
    { id: 'completed', title: 'Completed Today', value: stats.completedToday, icon: CheckCircle2, color: 'text-success' },
    { id: 'rate', title: 'Completion Rate', value: `${stats.completionRate}%`, icon: Activity, color: 'text-accent' },
    { id: 'streak', title: 'Best Active Streak', value: `${stats.longestActiveStreak}d`, icon: Flame, color: 'text-orange-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((stat) => (
        <motion.div key={stat.id} variants={itemVariants}>
          <Card className="p-4 flex flex-col justify-between group bg-surfaceHighlight hover:bg-surfaceHighlight border-border/20 h-full">
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
