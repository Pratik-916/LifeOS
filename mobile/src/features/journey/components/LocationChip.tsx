import React from 'react';
import { View, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';

export const LocationChip = ({ location }: { location?: string }) => {
  if (!location) return null;
  return (
    <View className="flex-row items-center">
      <MapPin size={14} color="#6B7280" />
      <Text className="text-sm text-gray-500 ml-1">{location}</Text>
    </View>
  );
};
