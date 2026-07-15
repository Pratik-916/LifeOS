import { useTheme } from '../../../theme/ThemeProvider';
import React from 'react';
import { View } from 'react-native';
import { HeadingMD, BodySM, Button, Icon } from '../../../design-system';

interface JournalEmptyStateProps {
  onAction?: () => void;
  message?: string;
}

export const JournalEmptyState = ({ onAction, message = "Every great journey begins with a single thought." }: JournalEmptyStateProps) => {
  const { theme } = useTheme();

  return (
    <View className="flex-1 items-center justify-center p-8 min-h-[300px]">
      <View className="w-16 h-16 rounded-full bg-indigo-50 items-center justify-center mb-4">
        <Icon name="BookOpen" size={32} color={theme.colors.primary[600]} />
      </View>
      <HeadingMD className="mb-2 text-center">
        Your Space to Reflect
      </HeadingMD>
      <BodySM className="text-slate-500 text-center mb-6">
        {message}
      </BodySM>
      {onAction && (
        <Button variant="primary" title="Create Your First Journal Entry" onPress={onAction} />
      )}
    </View>
  );
};
