import React from 'react';
import { View, ViewProps, Text } from 'react-native';

interface CardProps extends ViewProps {
  title?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className, ...props }) => {
  return (
    <View className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`} {...props}>
      {title && <Text className="text-lg font-bold text-gray-900 mb-3">{title}</Text>}
      {children}
    </View>
  );
};
