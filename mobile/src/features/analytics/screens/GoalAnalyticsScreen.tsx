import { useTheme } from '../../../theme/ThemeProvider';
import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useGoalAnalytics } from '../hooks/useGoalAnalytics';
import { FilterBar } from '../components/FilterBar';
import { AnalyticsSkeleton } from '../components/AnalyticsSkeleton';
import { AnalyticsEmptyState } from '../components/AnalyticsEmptyState';
import { StatCard } from '../components/StatCard';
import { MonthlyTrendChart } from '../components/TrendChart';
import { ProgressRing } from '../components/ProgressRing';
import { PrimaryCard } from '../../../design-system';

export const GoalAnalyticsScreen = () => {
  const { theme } = useTheme();

  const [range, setRange] = useState('30_days');
  const { data, isLoading, refetch } = useGoalAnalytics({ dateRange: range });

  if (isLoading) return <AnalyticsSkeleton />;
  if (!data) return <AnalyticsEmptyState onAction={refetch} />;

  return (
    <ScrollView 
      className="flex-1 bg-background-light dark:bg-background-dark" 
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
    >
      <FilterBar selectedRange={range} onSelectRange={setRange} />
      
      <PrimaryCard className="mb-4 flex-row justify-between items-center bg-surface-light dark:bg-surface-dark border-0 p-4">
        <View className="flex-1">
          <StatCard title="Completed" value={data.completedGoals} icon="Target" iconColor={theme.colors.success} />
        </View>
        <View className="mx-4">
          <ProgressRing progress={data.goalProgress} size={100} color={theme.colors.success} label="Progress" />
        </View>
      </PrimaryCard>

      <View className="flex-row mb-4">
        <StatCard title="Milestones" value={data.milestoneCompletion} icon="Flag" />
        <StatCard title="Velocity" value={`${data.goalVelocity} goals/mo`} />
      </View>

      <MonthlyTrendChart data={data.goalCompletionTrends} title="Completion Trends" />
    </ScrollView>
  );
};
