import React, { useEffect, useState } from 'react';
import { View, Animated, Easing } from 'react-native';

interface GoalProgressBarProps {
  progress: number;
  color?: string;
}

export const GoalProgressBar = ({ progress, color = '#6366F1' }: GoalProgressBarProps) => {
  const [animatedWidth] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View className="h-2 bg-slate-100 rounded-full overflow-hidden flex-row">
      <Animated.View
        style={{
          width: widthInterpolation,
          backgroundColor: color,
        }}
        className="h-full rounded-full"
      />
    </View>
  );
};
