import React from 'react';
import { Card } from '../Card';
import type { JourneyStatsModel } from '../../features/journey/api/journey.types';
import { Trophy, Target, CheckCircle2, BookOpen, Flame, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

interface JourneyStatisticsProps {
  stats: JourneyStatsModel;
}

export const JourneyStatistics: React.FC<JourneyStatisticsProps> = ({ stats }) => {
  const statCards = [
    { label: 'Active Years', value: stats.activeYears, icon: Trophy, color: 'text-yellow-500' },
    { label: 'Achievements', value: stats.totalAchievements, icon: AwardIcon, color: 'text-purple-500' },
    { label: 'Goals', value: stats.goalsCompleted, icon: Target, color: 'text-blue-500' },
    { label: 'Tasks', value: stats.tasksCompleted, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Journal', value: stats.journalEntries, icon: BookOpen, color: 'text-pink-500' },
    { label: 'Best Streak', value: stats.longestHabitStreak, icon: Flame, color: 'text-orange-500' },
    { label: 'Memories', value: stats.totalMemories, icon: ImageIcon, color: 'text-indigo-400' },
  ];

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
      {statCards.map((stat, i) => (
        <Card key={i} className="p-4 flex flex-col justify-between group hover:bg-surfaceHighlight transition-colors border-border/20">
          <div className="flex justify-between items-start mb-3">
            <span className="text-secondary font-medium text-xs uppercase tracking-wider">{stat.label}</span>
            <stat.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", stat.color)} />
          </div>
          <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
        </Card>
      ))}
    </motion.div>
  );
};

// Re-defining Award icon since we didn't import it above
function AwardIcon(props: any) {
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
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
