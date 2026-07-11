import React from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { usePlannerAnalytics } from '../hooks';
import { mapChartDatasetToRecharts } from '../api/analytics.mapper';
import { AnalyticsCard } from '../../../components/analytics/AnalyticsCard';
import { AnalyticsEmptyState } from '../../../components/analytics/AnalyticsEmptyState';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Card } from '../../../components/Card';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function PlannerAnalyticsWidget({ filters }: { filters?: Record<string, any> }) {
  const { data, isLoading, error } = usePlannerAnalytics(filters);

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error || !data) {
    return <div className="h-[400px] flex items-center justify-center text-red-500">Failed to load planner analytics.</div>;
  }

  const completionTrendData = mapChartDatasetToRecharts(data.taskCompletionTrend);
  const categoryDistData = mapChartDatasetToRecharts(data.categoryDistribution);
  
  // Recharts Pie expects 'value' property.
  const pieData = categoryDistData.map(item => {
    const keys = Object.keys(item).filter(k => k !== 'name');
    return { name: item.name, value: item[keys[0]] || 0 };
  });

  return (
    <div>
      <h2 className="text-xl font-bold mt-12 mb-6">Task Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsCard title="Task Completion" subtitle="Completed vs Pending" className="lg:col-span-2">
          {completionTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <RechartsTooltip isAnimationActive={false} allowEscapeViewBox={{ x: false, y: false }} cursor={{fill: 'var(--chart-cursor)'}} contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar isAnimationActive={false} dataKey="completed" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} barSize={20} />
                <Bar isAnimationActive={false} dataKey="pending" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          ) : <AnalyticsEmptyState />}
        </AnalyticsCard>

        <AnalyticsCard title="Task Categories" subtitle="Distribution of tasks">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip isAnimationActive={false} allowEscapeViewBox={{ x: false, y: false }}  contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <AnalyticsEmptyState />}
        </AnalyticsCard>
      </div>
    </div>
  );
}

