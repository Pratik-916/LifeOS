import React from 'react';
import { View } from 'react-native';
import { Card } from '../../../components/ui/Card';

export const JourneySkeleton = () => {
  return (
    <View className="px-4 mb-4">
      <View className="h-8 w-24 bg-slate-200 rounded mb-4 animate-pulse mt-4" />
      <View className="flex-row items-center mb-4">
        <View className="h-5 w-16 bg-slate-200 rounded animate-pulse mr-4" />
        <View className="flex-1 h-px bg-slate-100" />
      </View>
      
      <Card className="overflow-hidden">
        <View className="h-40 bg-slate-200 animate-pulse" />
        <View className="p-4">
          <View className="h-4 w-20 bg-slate-200 rounded mb-3 animate-pulse" />
          <View className="h-6 w-3/4 bg-slate-200 rounded mb-2 animate-pulse" />
          <View className="h-4 w-full bg-slate-200 rounded mb-1 animate-pulse" />
          <View className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
        </View>
      </Card>
    </View>
  );
};
