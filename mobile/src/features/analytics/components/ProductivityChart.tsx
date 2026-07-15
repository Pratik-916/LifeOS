import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { PrimaryCard, HeadingMD } from '../../../design-system';
import type { ChartDataset } from '../api/analytics.types';
import { LazyRender } from './LazyRender';

interface ProductivityChartProps {
  data?: ChartDataset;
  title: string;
}

export const ProductivityChart = React.memo(({ data, title }: ProductivityChartProps) => {
  const chartData = useMemo(() => {
    if (!data || !data.datasets.length) return [];
    
    // Convert to gifted-charts format
    // assuming data.datasets[0].data exists and is an array of numbers
    const values = data.datasets[0].data as number[] || [];
    return values.map((val, index) => ({
      value: val,
      label: data.labels[index] || '',
      labelTextStyle: { color: '#9CA3AF', fontSize: 10 }
    }));
  }, [data]);

  if (!chartData.length) return null;

  const screenWidth = Dimensions.get('window').width;

  return (
    <PrimaryCard 
      className="mb-4"
      accessible={true}
      accessibilityLabel={`${title} Chart`}
      accessibilityHint={`Displays a line chart for ${title}.`}
    >
      <HeadingMD className="mb-4">{title}</HeadingMD>
      <LazyRender>
        <View className="overflow-hidden">
          <LineChart
            data={chartData}
            width={screenWidth - 80}
            height={180}
            thickness={3}
            color="#2563EB"
            hideRules
            yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
            xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
            isAnimated
            curved
            dataPointsColor="#2563EB"
            dataPointsRadius={4}
            hideDataPoints={false}
            spacing={(screenWidth - 100) / Math.max(1, chartData.length - 1)}
          />
        </View>
      </LazyRender>
    </PrimaryCard>
  );
});
ProductivityChart.displayName = 'ProductivityChart';
