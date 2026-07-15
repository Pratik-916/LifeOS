import React from 'react';
import { View } from 'react-native';
import { PrimaryCard } from '../../../design-system';

export const GoalSkeleton = () => {
  return (
    <View className="mb-4">
      <PrimaryCard className="p-4">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-4">
            <View className="h-4 w-16 bg-slate-200 rounded mb-2 animate-pulse" />
            <View className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
          </View>
          <View className="items-end">
            <View className="h-5 w-16 bg-slate-200 rounded mb-1 animate-pulse" />
            <View className="h-5 w-14 bg-slate-200 rounded animate-pulse" />
          </View>
        </View>
        
        <View className="mt-3 mb-2">
          <View className="flex-row justify-between mb-2">
            <View className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
            <View className="h-3 w-8 bg-slate-200 rounded animate-pulse" />
          </View>
          <View className="h-2 w-full bg-slate-200 rounded-full animate-pulse" />
        </View>

        <View className="flex-row justify-between mt-3 pt-3 border-t border-slate-100">
          <View className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
          <View className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
        </View>
      </PrimaryCard>
    </View>
  );
};
