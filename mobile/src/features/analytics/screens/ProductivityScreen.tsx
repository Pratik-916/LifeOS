import { useTheme } from '../../../theme/ThemeProvider';
import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useProductivityStats } from '../hooks/useProductivityStats';
import { FilterBar } from '../components/FilterBar';
import { AnalyticsSkeleton } from '../components/AnalyticsSkeleton';
import { AnalyticsEmptyState } from '../components/AnalyticsEmptyState';
import { ProgressRing } from '../components/ProgressRing';
import { InsightCard } from '../components/InsightCard';
import { HeadingMD, BodyMD, PrimaryCard } from '../../../design-system';

export const ProductivityScreen = () => {
  const { theme } = useTheme();

  const [range, setRange] = useState('7_days');
  const { data, isLoading, refetch } = useProductivityStats({ dateRange: range });

  if (isLoading) return <AnalyticsSkeleton />;
  if (!data) return <AnalyticsEmptyState onAction={refetch} />;

  return (
    <ScrollView 
      className="flex-1 bg-background-light dark:bg-background-dark" 
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
    >
      <FilterBar selectedRange={range} onSelectRange={setRange} />
      
      <PrimaryCard className="mb-4 items-center py-6">
        <HeadingMD className="mb-4">Overall Productivity</HeadingMD>
        <ProgressRing progress={data.overallScore} size={160} color={theme.colors.primary[500]} />
      </PrimaryCard>

      <HeadingMD className="mb-3 mt-2">Analysis</HeadingMD>
      {data.reasons?.map((reason, idx) => (
        <InsightCard key={idx} message={reason} type="neutral" />
      ))}

      <HeadingMD className="mb-3 mt-4">Module Breakdown</HeadingMD>
      {Object.entries(data.individualModuleScores || {}).map(([module, score]) => (
        <View key={module} className="flex-row justify-between py-3 border-b border-secondary-100 dark:border-secondary-900">
          <BodyMD className="capitalize text-gray-700">{module}</BodyMD>
          <BodyMD className="font-semibold">{String(score)}</BodyMD>
        </View>
      ))}
    </ScrollView>
  );
};
