import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useHabitAnalytics } from '../hooks/useHabitAnalytics';
import { FilterBar } from '../components/FilterBar';
import { AnalyticsSkeleton } from '../components/AnalyticsSkeleton';
import { AnalyticsEmptyState } from '../components/AnalyticsEmptyState';
import { StatCard } from '../components/StatCard';
import { WeeklyTrendChart } from '../components/TrendChart';
import { HeatmapGrid } from '../components/HeatmapGrid';


export const HabitAnalyticsScreen = () => {
  const [range, setRange] = useState('30_days');
  const { data, isLoading, refetch } = useHabitAnalytics({ dateRange: range });

  if (isLoading) return <AnalyticsSkeleton />;
  if (!data) return <AnalyticsEmptyState onAction={refetch} />;

  return (
    <ScrollView 
      className="flex-1 bg-white" 
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
    >
      <FilterBar selectedRange={range} onSelectRange={setRange} />
      
      <View className="flex-row mb-2">
        <StatCard 
          title="Completion Rate" 
          value={`${Math.round(data.completionRate)}%`} 
          icon="Activity"
          iconColor="#2563EB"
        />
        <StatCard 
          title="Current Streak" 
          value={data.currentStreak} 
          icon="Zap"
          iconColor="#EAB308"
        />
      </View>
      <View className="flex-row mb-4">
        <StatCard title="Longest Streak" value={data.longestStreak} />
        <StatCard title="Recovery Time" value={`${data.recoveryTimeDays}d`} />
      </View>

      <WeeklyTrendChart data={data.weeklyActivity} title="Weekly Completion" />
      <HeatmapGrid data={data.habitHeatmap} title="Habit Consistency" />
    </ScrollView>
  );
};
