import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { PrimaryCard, HeadingMD } from '../../../design-system';
import type { ChartDataset } from '../api/analytics.types';
import { LazyRender } from './LazyRender';

interface TrendChartProps {
  data?: ChartDataset;
  title: string;
  type?: 'weekly' | 'monthly';
}

export const TrendChart = React.memo(({ data, title, type = 'weekly' }: TrendChartProps) => {
  const chartData = useMemo(() => {
    if (!data || !data.datasets.length) return [];
    
    const values = data.datasets[0].data as number[] || [];
    return values.map((val, index) => ({
      value: val,
      label: data.labels[index] || '',
      frontColor: type === 'weekly' ? '#3B82F6' : '#10B981',
    }));
  }, [data, type]);

  if (!chartData.length) return null;

  const screenWidth = Dimensions.get('window').width;

  return (
    <PrimaryCard 
      className="mb-4"
      accessible={true}
      accessibilityLabel={`${title} Chart`}
      accessibilityHint={`Displays a bar chart for ${title}.`}
    >
      <HeadingMD className="mb-4">{title}</HeadingMD>
      <LazyRender>
        <View className="overflow-hidden">
          <BarChart
            data={chartData}
            width={screenWidth - 80}
            height={180}
            barWidth={type === 'weekly' ? 22 : 8}
            spacing={type === 'weekly' ? 20 : 4}
            roundedTop
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
            xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
            noOfSections={4}
            isAnimated
          />
        </View>
      </LazyRender>
    </PrimaryCard>
  );
});
TrendChart.displayName = 'TrendChart';

export const WeeklyTrendChart = (props: Omit<TrendChartProps, 'type'>) => <TrendChart {...props} type="weekly" />;
export const MonthlyTrendChart = (props: Omit<TrendChartProps, 'type'>) => <TrendChart {...props} type="monthly" />;
