import React from 'react';
import { View, Text } from 'react-native';
import { Pin } from 'lucide-react-native';

export const PinnedBadge = ({ pinned }: { pinned: boolean }) => {
  if (!pinned) return null;
  return (
    <View className="flex-row items-center bg-blue-100 rounded-full px-2 py-1 mr-2 mb-2">
      <Pin size={12} color="#2563EB" />
      <Text className="text-xs text-blue-700 ml-1">Pinned</Text>
    </View>
  );
};
