import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionTitle,
  onAction,
  icon,
}) => {
  return (
    <View className="flex-1 items-center justify-center p-6 min-h-[250px]">
      {icon && <View className="mb-4">{icon}</View>}
      <Typography variant="h2" className="text-center mb-2">
        {title}
      </Typography>
      <Typography variant="body" className="text-center text-gray-500 mb-6">
        {description}
      </Typography>
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} />
      )}
    </View>
  );
};
