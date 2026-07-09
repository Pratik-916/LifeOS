import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAppStore } from '../../../store/useAppStore';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DashboardOverview } from '../components/DashboardOverview';
import { QuickActions } from '../components/QuickActions';

export const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { profile } = useAppStore();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-10 max-w-[1600px] mx-auto h-full overflow-y-auto no-scrollbar"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-accent text-sm font-medium tracking-wider mb-2 uppercase"
          >
            {format(currentTime, 'EEEE, MMMM do, yyyy')} • {format(currentTime, 'h:mm a')}
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-secondary">
            {getGreeting()}, <br className="md:hidden" />
            Welcome back, {profile.name}
          </h1>
        </div>
      </div>

      <QuickActions />
      <DashboardOverview />
      
    </motion.div>
  );
};

export default Dashboard;
