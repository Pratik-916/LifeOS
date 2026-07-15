import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../../../design-system';

export const TaskSkeleton: React.FC = () => {
  return (
    <View className="bg-white p-4 rounded-xl mb-3 border border-gray-100">
      <View className="flex-row items-center mb-2">
        <Skeleton variant="circular" width={20} height={20} className="mr-3" />
        <Skeleton variant="text" width="60%" height={16} />
      </View>
      <Skeleton variant="text" width="40%" height={12} className="ml-8" />
    </View>
  );
};
