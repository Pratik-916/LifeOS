import React from 'react';
import { View } from 'react-native';

export const DashboardSkeleton = () => {
  return (
    <View className="flex-1 px-4 pt-6">
      <View className="w-48 h-6 bg-slate-200 rounded mb-2" />
      <View className="w-64 h-8 bg-slate-200 rounded mb-1" />
      <View className="w-32 h-4 bg-slate-200 rounded mb-8" />
      
      <View className="w-full h-40 bg-slate-200 rounded-[24px] mb-8" />
      
      <View className="w-32 h-6 bg-slate-200 rounded mb-4" />
      <View className="flex-row mb-8">
        <View className="w-[140px] h-32 bg-slate-200 rounded-[20px] mr-3" />
        <View className="w-[140px] h-32 bg-slate-200 rounded-[20px] mr-3" />
        <View className="w-[140px] h-32 bg-slate-200 rounded-[20px]" />
      </View>
    </View>
  );
};
