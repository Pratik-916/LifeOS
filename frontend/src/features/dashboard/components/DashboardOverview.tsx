import React from 'react';
import { useDashboardWidgets } from '../hooks/useDashboardWidgets';
import { ProductivityCard } from './ProductivityCard';
import { UpcomingTasksCard } from './UpcomingTasksCard';
import { HabitCard } from './HabitCard';
import { GoalCard } from './GoalCard';
import { JournalCard } from './JournalCard';
import { JourneyCard } from './JourneyCard';
import { BlogCard } from './BlogCard';
import { RecentActivity } from './RecentActivity';
import { motion } from 'framer-motion';

export const DashboardOverview = () => {
  const { data: widgets, isLoading } = useDashboardWidgets();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-64 bg-surfaceElevated rounded-2xl border border-border/10"></div>
        ))}
      </div>
    );
  }

  // Filter only visible widgets (stub for future personalization)
  const visibleWidgets = widgets?.filter(w => w.isVisible) || [];

  const renderWidget = (id: string) => {
    switch (id) {
      case 'productivity': return <ProductivityCard />;
      case 'upcoming_tasks': return <UpcomingTasksCard />;
      case 'habits': return <HabitCard />;
      case 'goals': return <GoalCard />;
      case 'journal': return <JournalCard />;
      case 'journey': return <JourneyCard />;
      case 'blog': return <BlogCard />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* 
        Layout:
        Activity Feed spans 1 col and 2 rows on Desktop.
        Other widgets fill the rest of the grid.
      */}
      <RecentActivity />
      
      {visibleWidgets.map((widget, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 24 }}
          key={widget.id}
          className={widget.size === 'large' ? 'col-span-1 md:col-span-2' : 'col-span-1'}
        >
          {renderWidget(widget.id)}
        </motion.div>
      ))}
    </div>
  );
};
