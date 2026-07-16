import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getQueueStatus, networkService } from '../../services/offline';
import type { OfflineQueueStatus } from '../../services/offline/types';
import { Cloud, CloudOff, CloudDrizzle, AlertCircle, RefreshCw } from 'lucide-react-native';

export const SyncStatus = () => {
  const [status, setStatus] = useState<OfflineQueueStatus>({
    size: 0,
    isSyncing: false,
    pendingOperations: [],
    failedOperations: [],
  });
  const [isOnline, setIsOnline] = useState(networkService.isOnline);

  useEffect(() => {
    const unsubscribe = networkService.addListener(setIsOnline);
    const interval = setInterval(async () => {
      const qStatus = await getQueueStatus();
      setStatus(qStatus);
    }, 1500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const renderContent = () => {
    if (!isOnline) {
      return (
        <View className="flex-row items-center space-x-2 bg-white/90 dark:bg-zinc-800/90 rounded-full px-4 py-1.5 shadow-sm border border-zinc-200 dark:border-zinc-700 pointer-events-auto">
          <CloudOff size={16} color="#ef4444" />
          <Text className="text-red-500 font-medium text-xs">Offline {status.size > 0 ? `(${status.size} pending)` : ''}</Text>
        </View>
      );
    }

    if (status.isSyncing) {
      return (
        <View className="flex-row items-center space-x-2 bg-white/90 dark:bg-zinc-800/90 rounded-full px-4 py-1.5 shadow-sm border border-zinc-200 dark:border-zinc-700 pointer-events-auto">
          <RefreshCw size={16} color="#3b82f6" />
          <Text className="text-blue-500 font-medium text-xs">Syncing...</Text>
        </View>
      );
    }

    if (status.failedOperations.length > 0) {
      return (
        <View className="flex-row items-center space-x-2 bg-white/90 dark:bg-zinc-800/90 rounded-full px-4 py-1.5 shadow-sm border border-zinc-200 dark:border-zinc-700 pointer-events-auto">
          <AlertCircle size={16} color="#f59e0b" />
          <Text className="text-amber-500 font-medium text-xs">Conflict Detected</Text>
        </View>
      );
    }

    if (status.pendingOperations.length > 0) {
      return (
        <View className="flex-row items-center space-x-2 bg-white/90 dark:bg-zinc-800/90 rounded-full px-4 py-1.5 shadow-sm border border-zinc-200 dark:border-zinc-700 pointer-events-auto">
          <CloudDrizzle size={16} color="#8b5cf6" />
          <Text className="text-purple-500 font-medium text-xs">Pending Changes ({status.pendingOperations.length})</Text>
        </View>
      );
    }

    return null;
  };

  return renderContent();
};
