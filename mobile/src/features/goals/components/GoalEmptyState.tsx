import React from 'react';
import { View } from 'react-native';
import { HeadingMD, BodyMD } from '../../../design-system';
import { PrimaryButton } from '../../../design-system';

interface GoalEmptyStateProps {
  onAction?: () => void;
  message?: string;
}

export const GoalEmptyState = ({ onAction, message = "Start with something meaningful." }: GoalEmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center p-8 min-h-[300px]">
      <HeadingMD className="text-center text-slate-800 mb-2">
        {message}
      </HeadingMD>
      <BodyMD className="text-center text-slate-500 mb-6">
        What matters most right now?
      </BodyMD>
      {onAction && (
        <PrimaryButton title="Create Goal" onPress={onAction} />
      )}
    </View>
  );
};
