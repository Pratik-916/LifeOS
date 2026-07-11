import React from 'react';
import { 
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useJourneyAnalytics } from '../hooks';
import { mapChartDatasetToRecharts } from '../api/analytics.mapper';
import { AnalyticsCard } from '../../../components/analytics/AnalyticsCard';
import { AnalyticsEmptyState } from '../../../components/analytics/AnalyticsEmptyState';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Card } from '../../../components/Card';

export default function JourneyAnalyticsWidget({ filters }: { filters?: Record<string, any> }) {
  const { data, isLoading, error } = useJourneyAnalytics(filters);

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error || !data) {
    return <div className="h-[400px] flex items-center justify-center text-red-500">Failed to load journey analytics.</div>;
  }

  const timelineData = mapChartDatasetToRecharts(data.activityTimeline);

  return (
    <div>
      <h2 className="text-xl font-bold mt-12 mb-6">Journey Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="grid grid-cols-2 gap-4 lg:col-span-1">
          <Card className="p-6 bg-surfaceHighlight border-border/20 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Journey Score</h3>
            <span className="text-4xl font-bold text-accent sensitive-data">{data.journeyScore}</span>
          </Card>
          <Card className="p-6 bg-surfaceHighlight border-border/20 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Milestones</h3>
            <span className="text-4xl font-bold text-success sensitive-data">{data.milestoneCounts}</span>
          </Card>
          <Card className="p-6 bg-surfaceHighlight border-border/20 flex flex-col justify-center items-center text-center col-span-2">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Favorite Memories</h3>
            <span className="text-4xl font-bold text-primary sensitive-data">{data.favoriteMemories}</span>
          </Card>
        </div>
        
        <AnalyticsCard title="Activity Timeline" subtitle="Events Over Time" className="lg:col-span-2">
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <RechartsTooltip isAnimationActive={false} allowEscapeViewBox={{ x: false, y: false }} cursor={{fill: 'var(--chart-cursor)'}} contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar isAnimationActive={false} dataKey="events" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          ) : <AnalyticsEmptyState />}
        </AnalyticsCard>
      </div>
    </div>
  );
}

