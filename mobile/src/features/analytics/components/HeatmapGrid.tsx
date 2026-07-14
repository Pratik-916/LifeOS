import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import type { ChartDataset } from '../api/analytics.types';

interface HeatmapGridProps {
  data?: ChartDataset;
  title?: string;
}

export const HeatmapGrid = React.memo(({ data, title = "Activity Heatmap" }: HeatmapGridProps) => {
  if (!data || !data.datasets.length) return null;
  
  // Assume data is passed as flat array of intensities or similar, 
  // or we render a simplified grid here.
  const values = (data.datasets[0].data as number[]) || [];
  
  const getColor = (val: number) => {
    if (val === 0) return 'bg-gray-100';
    if (val < 3) return 'bg-green-200';
    if (val < 6) return 'bg-green-400';
    return 'bg-green-600';
  };

  return (
    <Card 
      className="mb-4"
      accessible={true}
      accessibilityLabel={title}
      accessibilityHint="A heatmap grid visualizing activity intensity over time."
    >
      <Typography variant="h3" className="mb-4">{title}</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row flex-wrap" style={{ width: 400, height: 100 }}>
          {values.slice(0, 365).map((val, idx) => (
            <View 
              key={idx} 
              className={`w-3 h-3 m-0.5 rounded-sm ${getColor(val)}`}
            />
          ))}
        </View>
      </ScrollView>
    </Card>
  );
});
HeatmapGrid.displayName = 'HeatmapGrid';
