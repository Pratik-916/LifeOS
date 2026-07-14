import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useJournalAnalytics } from '../hooks/useJournalAnalytics';
import { FilterBar } from '../components/FilterBar';
import { AnalyticsSkeleton } from '../components/AnalyticsSkeleton';
import { AnalyticsEmptyState } from '../components/AnalyticsEmptyState';
import { StatCard } from '../components/StatCard';
import { ProductivityChart } from '../components/ProductivityChart';
import { BookOpen, Smile } from 'lucide-react-native';

export const JournalAnalyticsScreen = () => {
  const [range, setRange] = useState('30_days');
  const { data, isLoading, refetch } = useJournalAnalytics({ dateRange: range });

  if (isLoading) return <AnalyticsSkeleton />;
  if (!data) return <AnalyticsEmptyState onAction={refetch} />;

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16 }}>
      <FilterBar selectedRange={range} onSelectRange={setRange} />
      
      <View className="flex-row mb-4">
        <StatCard title="Writing Streak" value={data.writingStreak} icon={BookOpen} iconColor="#8B5CF6" />
        <StatCard title="Favorites" value={data.favoriteEntries} icon={Smile} iconColor="#F59E0B" />
      </View>

      <View className="flex-row mb-4">
        <StatCard title="Avg Words" value={data.averageWords} />
        <StatCard title="Avg Time (m)" value={data.averageReadingTimeMins} />
      </View>

      <ProductivityChart data={data.wordCountTrends} title="Word Count Trends" />
      <ProductivityChart data={data.moodDistribution} title="Mood Trends" />
    </ScrollView>
  );
};
