import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { HeadingLG, Caption } from '../../../design-system';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  color?: string;
  label?: string;
}

export const ProgressRing = ({ progress, size = 120, color = '#2563EB', label }: ProgressRingProps) => {
  const validProgress = Math.max(0, Math.min(100, isNaN(progress) ? 0 : progress));
  
  const pieData = [
    { value: validProgress, color: color },
    { value: 100 - validProgress, color: '#F3F4F6' } // background track
  ];

  return (
    <View 
      className="items-center justify-center"
      accessible={true}
      accessibilityLabel={`Progress Ring showing ${Math.round(validProgress)} percent ${label || ''}`}
    >
      <PieChart
        data={pieData}
        donut
        radius={size / 2}
        innerRadius={(size / 2) - 12}
        centerLabelComponent={() => (
          <View className="items-center justify-center">
            <HeadingLG className="text-text-light dark:text-text-dark">{Math.round(validProgress)}%</HeadingLG>
            {label && <Caption className="text-text-muted">{label}</Caption>}
          </View>
        )}
      />
    </View>
  );
};
