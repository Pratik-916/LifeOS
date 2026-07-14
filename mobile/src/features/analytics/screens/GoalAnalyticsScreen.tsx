import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useGoalAnalytics } from '../hooks/useGoalAnalytics';
import { FilterBar } from '../components/FilterBar';
import { AnalyticsSkeleton } from '../components/AnalyticsSkeleton';
import { AnalyticsEmptyState } from '../components/AnalyticsEmptyState';
import { StatCard } from '../components/StatCard';
import { MonthlyTrendChart } from '../components/TrendChart';
import { ProgressRing } from '../components/ProgressRing';
import { Target, Flag } from 'lucide-react-native';
import { Card } from '../../../components/ui/Card';

export const GoalAnalyticsScreen = () => {
  const [range, setRange] = useState('30_days');
  const { data, isLoading, refetch } = useGoalAnalytics({ dateRange: range });

  if (isLoading) return <AnalyticsSkeleton />;
  if (!data) return <AnalyticsEmptyState onAction={refetch} />;

  return (
    <ScrollView 
      className="flex-1 bg-white" 
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
    >
      <FilterBar selectedRange={range} onSelectRange={setRange} />
      
      <Card className="mb-4 flex-row justify-between items-center bg-gray-50 border-0 p-4">
        <View className="flex-1">
          <StatCard title="Completed" value={data.completedGoals} icon={Target} iconColor="#10B981" />
        </View>
        <View className="mx-4">
          <ProgressRing progress={data.goalProgress} size={100} color="#10B981" label="Progress" />
        </View>
      </Card>

      <View className="flex-row mb-4">
        <StatCard title="Milestones" value={data.milestoneCompletion} icon={Flag} />
        <StatCard title="Velocity" value={`${data.goalVelocity} goals/mo`} />
      </View>

      <MonthlyTrendChart data={data.goalCompletionTrends} title="Completion Trends" />
    </ScrollView>
  );
};
