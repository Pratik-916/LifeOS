import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertOctagon } from 'lucide-react-native';

interface GlobalErrorScreenProps {
  error: Error | null;
  onReset: () => void;
}

export const GlobalErrorScreen: React.FC<GlobalErrorScreenProps> = ({ error, onReset }) => {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      <AlertOctagon size={64} color="#EF4444" />
      <Text className="text-2xl font-bold text-gray-900 mt-6 mb-2 text-center">
        Oops! Something went wrong.
      </Text>
      <Text className="text-base text-gray-500 text-center mb-8">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </Text>
      <View className="w-full">
        <Button title="Try Again" onPress={onReset} variant="primary" />
      </View>
    </SafeAreaView>
  );
};
