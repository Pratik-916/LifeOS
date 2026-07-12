import React from 'react';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export const OfflineBanner = () => {
  const { isConnected } = useNetworkStatus();
  const insets = useSafeAreaInsets();

  if (isConnected) return null;

  return (
    <View 
      className="bg-red-500 w-full items-center justify-center absolute z-50 shadow-md"
      style={{ paddingTop: Platform.OS === 'ios' ? insets.top : 0, paddingBottom: 8 }}
    >
      <Text className="text-white font-medium text-sm pt-2">
        No Internet Connection
      </Text>
    </View>
  );
};
