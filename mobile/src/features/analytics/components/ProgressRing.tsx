import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Typography } from '../../../components/ui/Typography';

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
    <View className="items-center justify-center">
      <PieChart
        data={pieData}
        donut
        radius={size / 2}
        innerRadius={(size / 2) - 12}
        centerLabelComponent={() => (
          <View className="items-center justify-center">
            <Typography variant="h2" className="text-gray-900">{Math.round(validProgress)}%</Typography>
            {label && <Typography variant="caption" className="text-gray-500">{label}</Typography>}
          </View>
        )}
      />
    </View>
  );
};
