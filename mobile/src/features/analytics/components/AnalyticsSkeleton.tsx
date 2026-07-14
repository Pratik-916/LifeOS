import React from 'react';
import { View } from 'react-native';
import { Card } from '../../../components/ui/Card';

export const AnalyticsSkeleton = () => {
  return (
    <View className="p-4">
      <View className="flex-row justify-between mb-4">
        <View className="w-[48%] h-24 bg-gray-200 rounded-2xl opacity-50" />
        <View className="w-[48%] h-24 bg-gray-200 rounded-2xl opacity-50" />
      </View>
      <Card className="h-64 mb-4 opacity-50 bg-gray-200" />
      <Card className="h-48 mb-4 opacity-50 bg-gray-200" />
      <View className="flex-row justify-between mb-4">
        <View className="w-[30%] h-20 bg-gray-200 rounded-2xl opacity-50" />
        <View className="w-[30%] h-20 bg-gray-200 rounded-2xl opacity-50" />
        <View className="w-[30%] h-20 bg-gray-200 rounded-2xl opacity-50" />
      </View>
    </View>
  );
};
