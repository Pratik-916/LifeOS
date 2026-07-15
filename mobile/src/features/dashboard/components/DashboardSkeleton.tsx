import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../../../design-system';

export const DashboardSkeleton = () => {
  return (
    <View className="flex-1 px-4 pt-6">
      <Skeleton className="w-48 h-6 mb-2" variant="text" />
      <Skeleton className="w-64 h-8 mb-1" variant="text" />
      <Skeleton className="w-32 h-4 mb-8" variant="text" />
      
      <Skeleton className="w-full h-40 mb-8" />
      
      <Skeleton className="w-32 h-6 mb-4" variant="text" />
      <View className="flex-row mb-8">
        <Skeleton className="w-[140px] h-32 mr-3" />
        <Skeleton className="w-[140px] h-32 mr-3" />
        <Skeleton className="w-[140px] h-32" />
      </View>
    </View>
  );
};
