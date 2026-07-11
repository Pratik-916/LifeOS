import React, { useState, Suspense, lazy } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { DateRangeSelector } from '../components/analytics/DateRangeSelector';
import { FeatureErrorBoundary } from '../components/ui/FeatureErrorBoundary';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const OverviewWidget = lazy(() => import('../features/analytics/components/OverviewWidget'));
const PlannerAnalyticsWidget = lazy(() => import('../features/analytics/components/PlannerAnalyticsWidget'));
const GoalAnalyticsWidget = lazy(() => import('../features/analytics/components/GoalAnalyticsWidget'));
const HabitAnalyticsWidget = lazy(() => import('../features/analytics/components/HabitAnalyticsWidget'));
const JournalAnalyticsWidget = lazy(() => import('../features/analytics/components/JournalAnalyticsWidget'));
const JourneyAnalyticsWidget = lazy(() => import('../features/analytics/components/JourneyAnalyticsWidget'));
const ProductivityAnalyticsWidget = lazy(() => import('../features/analytics/components/ProductivityAnalyticsWidget'));

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<string>('30D');
  const isFetching = useIsFetching();
  const filters = { range: timeRange };

  return (
    <motion.div 
      className="space-y-8 pb-10 max-w-[1200px] mx-auto min-h-[calc(100vh-4rem)]"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Analytics</h1>
          <p className="text-secondary text-sm">Visualize your progress and discover patterns.</p>
        </div>
        <DateRangeSelector timeRange={timeRange as any} setTimeRange={setTimeRange as any} isLoading={isFetching > 0} />
      </div>

      <motion.div variants={itemVariants} className="w-full space-y-12">
        
        {/* 1. Overview */}
        <FeatureErrorBoundary featureName="Overview Widget">
          <Suspense fallback={<div className="h-[120px] flex justify-center"><LoadingSpinner /></div>}>
            <OverviewWidget filters={filters} />
          </Suspense>
        </FeatureErrorBoundary>

        {/* 2. Task Analytics */}
        <FeatureErrorBoundary featureName="Planner Analytics Widget">
          <Suspense fallback={<div className="h-[300px] flex justify-center"><LoadingSpinner /></div>}>
            <PlannerAnalyticsWidget filters={filters} />
          </Suspense>
        </FeatureErrorBoundary>

        {/* 3. Goal Analytics */}
        <FeatureErrorBoundary featureName="Goal Analytics Widget">
          <Suspense fallback={<div className="h-[300px] flex justify-center"><LoadingSpinner /></div>}>
            <GoalAnalyticsWidget filters={filters} />
          </Suspense>
        </FeatureErrorBoundary>

        {/* 4. Habit Analytics */}
        <FeatureErrorBoundary featureName="Habit Analytics Widget">
          <Suspense fallback={<div className="h-[300px] flex justify-center"><LoadingSpinner /></div>}>
            <HabitAnalyticsWidget filters={filters} />
          </Suspense>
        </FeatureErrorBoundary>

        {/* 5. Journal Analytics */}
        <FeatureErrorBoundary featureName="Journal Analytics Widget">
          <Suspense fallback={<div className="h-[300px] flex justify-center"><LoadingSpinner /></div>}>
            <JournalAnalyticsWidget filters={filters} />
          </Suspense>
        </FeatureErrorBoundary>

        {/* 6. Journey Analytics */}
        <FeatureErrorBoundary featureName="Journey Analytics Widget">
          <Suspense fallback={<div className="h-[300px] flex justify-center"><LoadingSpinner /></div>}>
            <JourneyAnalyticsWidget filters={filters} />
          </Suspense>
        </FeatureErrorBoundary>

        {/* 7. Productivity Analytics */}
        <FeatureErrorBoundary featureName="Productivity Analytics Widget">
          <Suspense fallback={<div className="h-[300px] flex justify-center"><LoadingSpinner /></div>}>
            <ProductivityAnalyticsWidget filters={filters} />
          </Suspense>
        </FeatureErrorBoundary>

      </motion.div>

    </motion.div>
  );
}
