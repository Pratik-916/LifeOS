import React from 'react';
import { View, Text } from 'react-native';
import { Folder } from 'lucide-react-native';

export const CategoryBadge = ({ category }: { category: string }) => {
  if (!category) return null;
  return (
    <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1 mr-2 mb-2">
      <Folder size={12} color="#6B7280" />
      <Text className="text-xs text-gray-600 ml-1">{category}</Text>
    </View>
  );
};
