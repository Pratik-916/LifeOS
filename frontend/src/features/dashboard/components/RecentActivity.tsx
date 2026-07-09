import React from 'react';
import { useRecentActivity } from '../hooks/useRecentActivity';
import { DashboardWidget } from './DashboardWidget';
import { Activity, Circle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

export const RecentActivity = () => {
  const { data: activities, isLoading, isError, refetch } = useRecentActivity(10);
  
  return (
    <DashboardWidget
      id="recent_activity"
      title="Recent Activity"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!activities || activities.length === 0}
      onRefresh={refetch}
      className="col-span-1 md:col-span-2 lg:col-span-1 lg:row-span-2"
      contentClassName="overflow-y-auto"
      emptyState={
        <div className="text-center text-secondary py-8">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity.</p>
          <p className="text-xs opacity-75 mt-1">Start using LifeOS to see activity here.</p>
        </div>
      }
    >
      <div className="relative pl-4 border-l-2 border-border/10 space-y-6 pb-2">
        {activities?.map((activity, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            key={activity.id} 
            className="relative"
          >
            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-surfaceElevated"></div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
                {activity.contentType}
              </span>
              <p className="text-sm text-primary mb-1">
                {activity.action}
              </p>
              <time className="text-xs text-secondary">
                {format(parseISO(activity.createdAt), 'MMM d, h:mm a')}
              </time>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardWidget>
  );
};
