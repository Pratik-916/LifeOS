import React from 'react';
import { Card } from '../Card';
import { cn } from '../../lib/utils';
import { Zap, Target, BookOpen, CheckCircle, TrendingUp, Activity, Flame, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatisticsGridProps {
  overview: {
    productivityScore: number;
    currentStreak: number;
    longestStreak: number;
    totalTasks: number;
    completedTasks: number;
    activeGoals: number;
    completedGoals: number;
    journalEntries: number;
    totalActivities: number;
  };
}

import type { Variants } from 'framer-motion';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({ overview }) => {
  const stats = [
    { id: 'prod', title: 'Productivity', value: `${overview.productivityScore}`, icon: Zap, color: 'text-yellow-600 dark:text-yellow-500' },
    { id: 'tasks', title: 'Tasks Done', value: overview.completedTasks, icon: CheckCircle, color: 'text-success' },
    { id: 'goals', title: 'Active Goals', value: overview.activeGoals, icon: Target, color: 'text-accent' },
    { id: 'journal', title: 'Journal Entries', value: overview.journalEntries, icon: BookOpen, color: 'text-purple-600 dark:text-purple-500' },
    { id: 'streak', title: 'Current Streak', value: `${overview.currentStreak}d`, icon: Flame, color: 'text-orange-600 dark:text-orange-500' },
    { id: 'longest', title: 'Best Streak', value: `${overview.longestStreak}d`, icon: Trophy, color: 'text-amber-600 dark:text-amber-400' },
    { id: 'activity', title: 'Total Activities', value: overview.totalActivities, icon: Activity, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'goals_done', title: 'Goals Completed', value: overview.completedGoals, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {stats.map((stat) => (
        <motion.div key={stat.id} variants={itemVariants}>
          <Card className="p-4 flex flex-col justify-between group bg-surfaceHighlight hover:bg-surfaceHighlight border-border/20 h-full">
            <div className="flex justify-between items-start mb-3">
              <span className="text-secondary font-medium text-[10px] uppercase tracking-wider">{stat.title}</span>
              <stat.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", stat.color)} />
            </div>
            <h3 className="text-2xl font-bold text-primary sensitive-data">{stat.value}</h3>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2Z" />
    </svg>
  );
}
