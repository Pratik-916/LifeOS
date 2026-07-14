import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useProductivityStats } from '../hooks/useProductivityStats';
import { FilterBar } from '../components/FilterBar';
import { AnalyticsSkeleton } from '../components/AnalyticsSkeleton';
import { AnalyticsEmptyState } from '../components/AnalyticsEmptyState';
import { ProgressRing } from '../components/ProgressRing';
import { InsightCard } from '../components/InsightCard';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';

export const ProductivityScreen = () => {
  const [range, setRange] = useState('7_days');
  const { data, isLoading, refetch } = useProductivityStats({ dateRange: range });

  if (isLoading) return <AnalyticsSkeleton />;
  if (!data) return <AnalyticsEmptyState onAction={refetch} />;

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16 }}>
      <FilterBar selectedRange={range} onSelectRange={setRange} />
      
      <Card className="mb-4 items-center py-6">
        <Typography variant="h3" className="mb-4">Overall Productivity</Typography>
        <ProgressRing progress={data.overallScore} size={160} color="#2563EB" />
      </Card>

      <Typography variant="h3" className="mb-3 mt-2">Analysis</Typography>
      {data.reasons?.map((reason, idx) => (
        <InsightCard key={idx} message={reason} type="neutral" />
      ))}

      <Typography variant="h3" className="mb-3 mt-4">Module Breakdown</Typography>
      {Object.entries(data.individualModuleScores || {}).map(([module, score]) => (
        <View key={module} className="flex-row justify-between py-3 border-b border-gray-100">
          <Typography variant="body" className="capitalize text-gray-700">{module}</Typography>
          <Typography variant="body" className="font-semibold">{String(score)}</Typography>
        </View>
      ))}
    </ScrollView>
  );
};
