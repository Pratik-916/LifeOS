import React from 'react';
import { 
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useProductivityAnalytics } from '../hooks';
import { AnalyticsCard } from '../../../components/analytics/AnalyticsCard';
import { AnalyticsEmptyState } from '../../../components/analytics/AnalyticsEmptyState';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Card } from '../../../components/Card';

export default function ProductivityAnalyticsWidget({ filters }: { filters?: Record<string, any> }) {
  const { data, isLoading, error } = useProductivityAnalytics(filters);

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error || !data) {
    return <div className="h-[400px] flex items-center justify-center text-red-500">Failed to load productivity analytics.</div>;
  }

  const moduleScores = Object.entries(data.individualModuleScores).map(([name, value]) => ({
    name,
    score: value
  }));

  return (
    <div>
      <h2 className="text-xl font-bold mt-12 mb-6">Productivity Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card className="p-6 bg-surfaceHighlight border-border/20 flex-1 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Overall Score</h3>
            <span className="text-6xl font-bold text-accent sensitive-data">{data.overallScore.toFixed(0)}</span>
          </Card>
          <Card className="p-6 bg-surfaceHighlight border-border/20 flex-1">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">Insights</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-primary">
              {data.reasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </Card>
        </div>
        
        <AnalyticsCard title="Module Scores" subtitle="Scores by Module" className="lg:col-span-2">
          {moduleScores.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <RechartsTooltip isAnimationActive={false} allowEscapeViewBox={{ x: false, y: false }} cursor={{fill: 'var(--chart-cursor)'}} contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar isAnimationActive={false} dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          ) : <AnalyticsEmptyState />}
        </AnalyticsCard>
      </div>
    </div>
  );
}

