import { useTheme } from '../../../theme/ThemeProvider';
import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useJourneyAnalytics } from '../hooks/useJourneyAnalytics';
import { FilterBar } from '../components/FilterBar';
import { AnalyticsSkeleton } from '../components/AnalyticsSkeleton';
import { AnalyticsEmptyState } from '../components/AnalyticsEmptyState';
import { StatCard } from '../components/StatCard';
import { MonthlyTrendChart } from '../components/TrendChart';


export const JourneyAnalyticsScreen = () => {
  const { theme } = useTheme();

  const [range, setRange] = useState('1_year'); // Custom range for journey
  const { data, isLoading, refetch } = useJourneyAnalytics({ dateRange: range });

  if (isLoading) return <AnalyticsSkeleton />;
  if (!data) return <AnalyticsEmptyState onAction={refetch} />;

  return (
    <ScrollView 
      className="flex-1 bg-background-light dark:bg-background-dark" 
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
    >
      <FilterBar selectedRange={range} onSelectRange={setRange} />
      
      <View className="flex-row mb-2">
        <StatCard title="Milestones" value={data.milestoneCounts} icon="Flag" iconColor={theme.colors.danger} />
        <StatCard title="Favorites" value={data.favoriteMemories} icon="Star" iconColor={theme.colors.warning} />
      </View>

      <View className="flex-row mb-4">
        <StatCard title="Pinned" value={data.pinnedMemories} icon="MapPin" />
        <StatCard title="Most Active Month" value={data.mostActiveMonth || 'N/A'} />
      </View>

      <MonthlyTrendChart data={data.timelineGrowth} title="Timeline Growth" />
      <MonthlyTrendChart data={data.activityTimeline} title="Activity Timeline" />
    </ScrollView>
  );
};
