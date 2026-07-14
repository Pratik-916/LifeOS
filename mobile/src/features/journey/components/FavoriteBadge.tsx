import React from 'react';
import { View, Text } from 'react-native';
import { Heart } from 'lucide-react-native';

export const FavoriteBadge = ({ favorite }: { favorite: boolean }) => {
  if (!favorite) return null;
  return (
    <View className="flex-row items-center bg-red-50 rounded-full px-2 py-1 mr-2 mb-2">
      <Heart size={12} color="#EF4444" fill="#EF4444" />
      <Text className="text-xs text-red-600 ml-1">Favorite</Text>
    </View>
  );
};
