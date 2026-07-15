import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../../../design-system';

export const AnalyticsSkeleton = () => {
  return (
    <View className="p-4">
      <View className="flex-row justify-between mb-4">
        <Skeleton className="w-[48%] h-24" variant="rectangular" />
        <Skeleton className="w-[48%] h-24" variant="rectangular" />
      </View>
      <Skeleton className="h-64 mb-4" variant="rectangular" />
      <Skeleton className="h-48 mb-4" variant="rectangular" />
      <View className="flex-row justify-between mb-4">
        <Skeleton className="w-[30%] h-20" variant="rectangular" />
        <Skeleton className="w-[30%] h-20" variant="rectangular" />
        <Skeleton className="w-[30%] h-20" variant="rectangular" />
      </View>
    </View>
  );
};
