import React, { useState } from 'react';
import {  motion, AnimatePresence  } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ComposedChart, Legend
} from 'recharts';
import { cn } from '../lib/utils';
import { Card } from '../components/Card';
import { useAnalyticsStats, type TimeRange } from '../hooks/useAnalyticsStats';
import { AnalyticsCard } from '../components/analytics/AnalyticsCard';
import { StatisticsGrid } from '../components/analytics/StatisticsGrid';
import { DateRangeSelector } from '../components/analytics/DateRangeSelector';
import { AnalyticsEmptyState } from '../components/analytics/AnalyticsEmptyState';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  
  const { 
    overview, 
    taskAnalytics, 
    goalAnalytics, 
    journalAnalytics, 
    productivityAnalytics 
  } = useAnalyticsStats(timeRange);

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
        <DateRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

      {/* 1. Overview */}
      <motion.div variants={itemVariants} className="w-full">
        <StatisticsGrid overview={overview} />
      </motion.div>

      {/* 2. Task Analytics */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mt-12 mb-6">Task Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnalyticsCard title="Task Completion" subtitle="Completed vs Pending" className="lg:col-span-2">
            {taskAnalytics.dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskAnalytics.dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <RechartsTooltip cursor={{fill: 'var(--chart-cursor)'}} contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="completed" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} barSize={20} />
                  <Bar dataKey="pending" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            ) : <AnalyticsEmptyState />}
          </AnalyticsCard>

          <AnalyticsCard title="Task Categories" subtitle="Distribution of tasks">
            {taskAnalytics.categoryDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskAnalytics.categoryDist}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskAnalytics.categoryDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <AnalyticsEmptyState />}
          </AnalyticsCard>
        </div>
      </motion.div>

      {/* 3. Goal Analytics */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mt-12 mb-6">Goal Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnalyticsCard title="Goal Status" subtitle="Active vs Completed">
            {goalAnalytics.statusDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalAnalytics.statusDist}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                    <Cell fill="#6b7280" />
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <AnalyticsEmptyState />}
          </AnalyticsCard>
          
          <div className="flex flex-col gap-6">
            <Card className="p-6 bg-surfaceHighlight border-border/20 flex-1 flex flex-col justify-center items-center text-center">
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Goal Completion Rate</h3>
              <span className="text-5xl font-bold text-accent sensitive-data">{goalAnalytics.completionRate}%</span>
              <p className="text-xs text-secondary mt-2">of goals fully achieved</p>
            </Card>
            <Card className="p-6 bg-surfaceHighlight border-border/20 flex-1 flex flex-col justify-center items-center text-center">
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Milestone Completion</h3>
              <span className="text-5xl font-bold text-success sensitive-data">{goalAnalytics.milestoneRate}%</span>
              <p className="text-xs text-secondary mt-2">{goalAnalytics.completedMilestones} / {goalAnalytics.totalMilestones} milestones</p>
            </Card>
          </div>
          
          <AnalyticsCard title="Goal Categories" subtitle="Distribution of goals">
            {goalAnalytics.categoryDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalAnalytics.categoryDist}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {goalAnalytics.categoryDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <AnalyticsEmptyState />}
          </AnalyticsCard>
        </div>
      </motion.div>

      {/* 4. Journal Analytics */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mt-12 mb-6">Journal Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            <Card className="p-6 bg-surfaceHighlight border-border/20 flex flex-col justify-center items-center text-center min-h-[160px]">
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Words Written</h3>
              <span className="text-4xl font-bold text-primary sensitive-data">{journalAnalytics.totalWords}</span>
            </Card>
            <Card className="p-6 bg-surfaceHighlight border-border/20 flex flex-col justify-center items-center text-center min-h-[160px]">
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Total Reading Time</h3>
              <span className="text-4xl font-bold text-primary sensitive-data">{journalAnalytics.totalReadingTime} <span className="text-lg text-secondary">min</span></span>
            </Card>
            <Card className="p-6 bg-surfaceHighlight border-border/20 flex flex-col justify-center items-center text-center min-h-[160px] col-span-2">
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Avg Words Per Entry</h3>
              <span className="text-4xl font-bold text-primary sensitive-data">{journalAnalytics.avgWords}</span>
            </Card>
          </div>
          
          <AnalyticsCard title="Mood Distribution" subtitle="How you've been feeling">
            {journalAnalytics.moodDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={journalAnalytics.moodDist}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {journalAnalytics.moodDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <AnalyticsEmptyState message="No moods logged in this period." />}
          </AnalyticsCard>
        </div>
      </motion.div>

      {/* 5. Productivity Analytics */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mt-12 mb-6">Productivity Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsCard title="Deep Work Focus" subtitle="Coding vs Study Hours">
            {(productivityAnalytics.codingHours > 0 || productivityAnalytics.studyHours > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Coding', hours: productivityAnalytics.codingHours },
                  { name: 'Study', hours: productivityAnalytics.studyHours }
                ]} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <RechartsTooltip cursor={{fill: 'var(--chart-cursor)'}} contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }} />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                    <Cell fill="#a855f7" />
                    <Cell fill="#3b82f6" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <AnalyticsEmptyState message="No work or learning tasks completed." />}
          </AnalyticsCard>

          <Card className="p-6 flex flex-col bg-surfaceHighlight border-border/20 h-[350px] overflow-hidden">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-1">Consistency Heatmap</h3>
            <p className="text-xs text-secondary/70 mb-6">Your activity history</p>
            <div className="flex-1 w-full overflow-x-auto no-scrollbar">
              {productivityAnalytics.heatmapData.length > 0 ? (
                <div className="flex flex-col flex-wrap h-[120px] gap-1.5 min-w-max content-start py-2 px-1">
                  {productivityAnalytics.heatmapData.map((day, i) => {
                    let colorClass = 'bg-border/50';
                    if (day.intensity === 1) colorClass = 'bg-accent/30';
                    if (day.intensity === 2) colorClass = 'bg-accent/60';
                    if (day.intensity === 3) colorClass = 'bg-accent/80';
                    if (day.intensity === 4) colorClass = 'bg-accent';
                    
                    return (
                      <div 
                        key={i} 
                        className={cn("w-3.5 h-3.5 rounded-[3px] transition-all hover:scale-125 hover:z-10 cursor-pointer", colorClass)}
                        title={`${day.date}: ${day.count} activities`}
                      />
                    );
                  })}
                </div>
              ) : <AnalyticsEmptyState />}
            </div>
            <div className="flex justify-end items-center gap-2 text-xs text-secondary mt-4">
              <span>Less</span>
              <div className="w-3 h-3 rounded-[3px] bg-border/50" />
              <div className="w-3 h-3 rounded-[3px] bg-accent/30" />
              <div className="w-3 h-3 rounded-[3px] bg-accent/60" />
              <div className="w-3 h-3 rounded-[3px] bg-accent/80" />
              <div className="w-3 h-3 rounded-[3px] bg-accent" />
              <span>More</span>
            </div>
          </Card>
        </div>
      </motion.div>

    </motion.div>
  );
}
