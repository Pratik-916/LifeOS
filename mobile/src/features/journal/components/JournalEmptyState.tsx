import React from 'react';
import { View } from 'react-native';
import { HeadingMD, BodySM, Button, Icon } from '../../../design-system';

interface JournalEmptyStateProps {
  onAction?: () => void;
  message?: string;
}

export const JournalEmptyState = ({ onAction, message = "Every great journey begins with a single thought." }: JournalEmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center p-8 min-h-[300px]">
      <View className="w-16 h-16 rounded-full bg-indigo-50 items-center justify-center mb-4">
        <Icon name="BookOpen" size={32} color="#4F46E5" />
      </View>
      <HeadingMD className="mb-2 text-center">
        Evening Reflection
      </HeadingMD>
      <BodySM className="text-slate-500 text-center mb-6">
        {message !== "Every great journey begins with a single thought." ? message : "Take a moment to close out your day."}
      </BodySM>
      {onAction && (
        <Button variant="primary" title="Start your evening reflection" onPress={onAction} />
      )}
    </View>
  );
};
