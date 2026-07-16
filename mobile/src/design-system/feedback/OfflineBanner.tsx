import React from 'react';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SyncStatus } from './SyncStatus';

export const OfflineBanner = () => {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="absolute top-0 w-full items-center justify-center z-50 pointer-events-none"
      style={{ paddingTop: Platform.OS === 'ios' ? insets.top : 32 }}
    >
      <SyncStatus />
    </View>
  );
};
