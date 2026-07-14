import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useAnalyticsHeatmap } from '../hooks/useAnalyticsHeatmap';
import { FilterBar } from '../components/FilterBar';
import { AnalyticsSkeleton } from '../components/AnalyticsSkeleton';
import { AnalyticsEmptyState } from '../components/AnalyticsEmptyState';
import { HeatmapGrid } from '../components/HeatmapGrid';
import { mapChartDataset } from '../api/analytics.mapper';

export const HeatmapScreen = () => {
  const [range, setRange] = useState('1_year');
  const { data, isLoading, refetch } = useAnalyticsHeatmap({ dateRange: range });

  if (isLoading) return <AnalyticsSkeleton />;
  if (!data) return <AnalyticsEmptyState onAction={refetch} />;

  const heatmapDataset = mapChartDataset(data as unknown as import('../api/analytics.types').ChartDatasetDTO);

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16 }}>
      <FilterBar selectedRange={range} onSelectRange={setRange} />
      <HeatmapGrid data={heatmapDataset} title="Global Activity Heatmap" />
    </ScrollView>
  );
};
