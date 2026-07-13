import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { Compass } from 'lucide-react-native';

interface JourneyEmptyStateProps {
  onAction?: () => void;
  message?: string;
}

export const JourneyEmptyState = ({ onAction, message = "Capture your first memory and start your journey." }: JourneyEmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center p-8 min-h-[400px]">
      <View className="w-20 h-20 rounded-full bg-indigo-50 items-center justify-center mb-6">
        <Compass size={40} color="#4F46E5" />
      </View>
      <Typography variant="h2" className="text-center mb-3 text-slate-900">
        No Memories Yet
      </Typography>
      <Typography variant="body" className="text-center text-slate-500 mb-8 leading-6">
        {message}
      </Typography>
      {onAction && (
        <Button variant="primary" title="Record a Memory" onPress={onAction} />
      )}
    </View>
  );
};
