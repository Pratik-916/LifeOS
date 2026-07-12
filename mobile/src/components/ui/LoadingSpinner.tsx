import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export const LoadingSpinner: React.FC<{ size?: 'small' | 'large', color?: string }> = ({ 
  size = 'large', 
  color = '#2563EB' 
}) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};
