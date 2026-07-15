import React from 'react';
import { View } from 'react-native';
import { Card } from '../../../design-system';

export const JourneySkeleton = () => {
  return (
    <View className="p-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="mb-4 flex-row opacity-50">
          <View className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900 mr-3" />
          <View className="flex-1">
            <View className="w-3/4 h-5 bg-secondary-100 dark:bg-secondary-900 rounded mb-2" />
            <View className="w-full h-4 bg-secondary-100 dark:bg-secondary-900 rounded mb-1" />
            <View className="w-2/3 h-4 bg-secondary-100 dark:bg-secondary-900 rounded" />
          </View>
        </Card>
      ))}
    </View>
  );
};
