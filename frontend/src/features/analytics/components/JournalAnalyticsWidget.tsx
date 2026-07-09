import React from 'react';
import { 
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useJournalAnalytics } from '../hooks';
import { mapChartDatasetToRecharts } from '../api/analytics.mapper';
import { AnalyticsCard } from '../../../components/analytics/AnalyticsCard';
import { AnalyticsEmptyState } from '../../../components/analytics/AnalyticsEmptyState';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Card } from '../../../components/Card';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function JournalAnalyticsWidget({ filters }: { filters?: Record<string, any> }) {
  const { data, isLoading, error } = useJournalAnalytics(filters);

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error || !data) {
    return <div className="h-[400px] flex items-center justify-center text-red-500">Failed to load journal analytics.</div>;
  }

  const moodDistData = mapChartDatasetToRecharts(data.moodDistribution);
  const pieData = moodDistData.map(item => {
    const keys = Object.keys(item).filter(k => k !== 'name');
    return { name: item.name, value: item[keys[0]] || 0 };
  });

  return (
    <div>
      <h2 className="text-xl font-bold mt-12 mb-6">Journal Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <Card className="p-6 bg-surfaceHighlight border-border/20 flex flex-col justify-center items-center text-center min-h-[160px]">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Writing Streak</h3>
            <span className="text-4xl font-bold text-primary sensitive-data">{data.writingStreak}</span>
          </Card>
          <Card className="p-6 bg-surfaceHighlight border-border/20 flex flex-col justify-center items-center text-center min-h-[160px]">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Total Reading Time</h3>
            <span className="text-4xl font-bold text-primary sensitive-data">{data.averageReadingTimeMins} <span className="text-lg text-secondary">avg min</span></span>
          </Card>
          <Card className="p-6 bg-surfaceHighlight border-border/20 flex flex-col justify-center items-center text-center min-h-[160px] col-span-2">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Avg Words Per Entry</h3>
            <span className="text-4xl font-bold text-primary sensitive-data">{data.averageWords}</span>
          </Card>
        </div>
        
        <AnalyticsCard title="Mood Distribution" subtitle="How you've been feeling">
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
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <AnalyticsEmptyState />}
        </AnalyticsCard>
      </div>
    </div>
  );
}
