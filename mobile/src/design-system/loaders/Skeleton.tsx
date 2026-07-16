/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export interface SkeletonProps extends ViewProps {
  variant?: 'rectangular' | 'circular' | 'text';
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Skeleton = ({ variant = 'rectangular', width, height, className = '', ...props }: SkeletonProps) => {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const baseClasses = 'bg-secondary-100 dark:bg-secondary-900';
  let variantClasses = '';
  
  if (variant === 'circular') {
    variantClasses = 'rounded-full';
  } else if (variant === 'text') {
    variantClasses = 'rounded-md';
  } else {
    variantClasses = 'rounded-xl';
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { width: width as any, height: height as any },
      ]}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    />
  );
};

export const SkeletonList = ({ count = 3, ...props }: { count?: number; className?: string }) => (
  <View className={`space-y-4 ${props.className || ''}`}>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} className="flex-row items-center space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <View className="flex-1 space-y-2">
          <Skeleton variant="text" width="80%" height={16} />
          <Skeleton variant="text" width="60%" height={12} />
        </View>
      </View>
    ))}
  </View>
);
