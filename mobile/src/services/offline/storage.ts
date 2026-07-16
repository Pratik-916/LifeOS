import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SyncOperation } from './types';

const QUEUE_STORAGE_KEY = '@lifeos_offline_queue';

export const storage = {
  async saveQueue(queue: SyncOperation[]): Promise<void> {
    try {
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('[Offline Storage] Failed to save queue:', error);
      // Depending on severity, we might want to log this to monitoring service directly
      // but monitoringService import here might cause circular dependencies, so we handle it at the engine level.
    }
  },

  async loadQueue(): Promise<SyncOperation[]> {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as SyncOperation[];
      }
    } catch (error) {
      console.error('[Offline Storage] Failed to load queue:', error);
    }
    return [];
  },

  async clearQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
    } catch (error) {
      console.error('[Offline Storage] Failed to clear queue:', error);
    }
  },
};
