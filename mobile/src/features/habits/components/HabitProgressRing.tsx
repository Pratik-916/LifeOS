import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Caption } from '../../../design-system';

interface HabitProgressRingProps {
  progress: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showText?: boolean;
}

export const HabitProgressRing: React.FC<HabitProgressRingProps> = ({
  progress,
  total,
  size = 40,
  strokeWidth = 4,
  color = '#10B981', // Emerald 500
  showText = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(Math.max(progress, 0), total);
  const strokeDashoffset = circumference - (clampedProgress / total) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Background Circle */}
        <Circle
          stroke="#E5E7EB" // Gray 200
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Foreground Progress Circle */}
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      {showText && (
        <Caption className="font-bold text-gray-700" style={{ fontSize: size * 0.3 }}>
          {clampedProgress}
        </Caption>
      )}
    </View>
  );
};
