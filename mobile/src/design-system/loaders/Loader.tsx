import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, View } from 'react-native';

export const Loader = ({ size = 'large', color = '#6366F1', className = '', ...props }: ActivityIndicatorProps & { className?: string }) => (
  <View className={`items-center justify-center p-4 ${className}`}>
    <ActivityIndicator size={size} color={color} {...props} />
  </View>
);
