import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useGoalAnalytics } from '../hooks';
import { mapChartDatasetToRecharts } from '../api/analytics.mapper';
import { AnalyticsCard } from '../../../components/analytics/AnalyticsCard';
import { AnalyticsEmptyState } from '../../../components/analytics/AnalyticsEmptyState';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Card } from '../../../components/Card';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function GoalAnalyticsWidget({ filters }: { filters?: Record<string, any> }) {
  const { data, isLoading, error } = useGoalAnalytics(filters);

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error || !data) {
    return <div className="h-[400px] flex items-center justify-center text-red-500">Failed to load goal analytics.</div>;
  }

  const categoryDistData = mapChartDatasetToRecharts(data.goalCategories);
  
  const pieData = categoryDistData.map(item => {
    const keys = Object.keys(item).filter(k => k !== 'name');
    return { name: item.name, value: item[keys[0]] || 0 };
  });

  return (
    <div>
      <h2 className="text-xl font-bold mt-12 mb-6">Goal Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard title="Goal Status" subtitle="Overall Progress">
          <div className="flex h-full items-center justify-center flex-col">
            <span className="text-5xl font-bold text-accent sensitive-data">{data.averageGoalProgress.toFixed(0)}%</span>
            <p className="text-secondary mt-2">Avg Goal Completion</p>
          </div>
        </AnalyticsCard>
        
        <div className="flex flex-col gap-6">
          <Card className="p-6 bg-surfaceHighlight border-border/20 flex-1 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Goal Completion Rate</h3>
            <span className="text-5xl font-bold text-accent sensitive-data">{data.goalProgress.toFixed(0)}%</span>
            <p className="text-xs text-secondary mt-2">of goals fully achieved</p>
          </Card>
          <Card className="p-6 bg-surfaceHighlight border-border/20 flex-1 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Milestone Completion</h3>
            <span className="text-5xl font-bold text-success sensitive-data">{data.milestoneCompletion.toFixed(0)}%</span>
            <p className="text-xs text-secondary mt-2">milestones achieved</p>
          </Card>
        </div>
        
        <AnalyticsCard title="Goal Categories" subtitle="Distribution of goals">
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

