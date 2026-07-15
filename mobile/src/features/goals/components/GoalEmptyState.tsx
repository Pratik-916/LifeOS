import { useTheme } from '../../../theme/ThemeProvider';
import React from 'react';
import { View } from 'react-native';
import { HeadingMD, BodyMD } from '../../../design-system';
import { PrimaryButton, Icon } from '../../../design-system';

interface GoalEmptyStateProps {
  onAction?: () => void;
  message?: string;
}

export const GoalEmptyState = ({ onAction, message = "Set a goal to start building your future." }: GoalEmptyStateProps) => {
  const { theme } = useTheme();

  return (
    <View className="flex-1 items-center justify-center p-8 min-h-[300px]">
      <View className="w-16 h-16 rounded-full bg-indigo-50 items-center justify-center mb-4">
        <Icon name="Target" size={32} color={theme.colors.primary[500]} />
      </View>
      <HeadingMD className="text-center mb-2">
        No Goals Found
      </HeadingMD>
      <BodyMD className="text-center text-slate-500 mb-6">
        {message}
      </BodyMD>
      {onAction && (
        <PrimaryButton accessibilityRole="button" accessibilityLabel="Button" title="Create Your First Goal" onPress={onAction} />
      )}
    </View>
  );
};
