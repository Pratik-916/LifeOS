import React from 'react';
import { View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';

interface JournalEmptyStateProps {
  onAction?: () => void;
  message?: string;
}

export const JournalEmptyState = ({ onAction, message = "You haven't written any entries yet." }: JournalEmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center p-8 min-h-[300px]">
      <View className="w-16 h-16 rounded-full bg-indigo-50 items-center justify-center mb-4">
        <BookOpen size={32} color="#4F46E5" />
      </View>
      <Typography variant="h3" className="mb-2 text-center">
        Your Space to Reflect
      </Typography>
      <Typography variant="body" className="text-slate-500 text-center mb-6">
        {message}
      </Typography>
      {onAction && (
        <Button variant="primary" onPress={onAction} title="
          Write your first entry
        " />
      )}
    </View>
  );
};
