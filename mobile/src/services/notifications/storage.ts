import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';
import type { StoredNotificationMapping } from './types';

export class NotificationStorage {
  private mappings: Record<string, string[]> = {};
  private isLoaded = false;

  async load(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MAPPINGS);
      if (data) {
        this.mappings = JSON.parse(data);
      }
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load notification mappings', error);
      this.mappings = {};
      this.isLoaded = true;
    }
  }

  async save(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MAPPINGS, JSON.stringify(this.mappings));
    } catch (error) {
      console.error('Failed to save notification mappings', error);
    }
  }

  async addMapping(entityId: string, notificationId: string): Promise<void> {
    if (!this.isLoaded) await this.load();
    if (!this.mappings[entityId]) {
      this.mappings[entityId] = [];
    }
    if (!this.mappings[entityId].includes(notificationId)) {
      this.mappings[entityId].push(notificationId);
      await this.save();
    }
  }

  async getMappings(entityId: string): Promise<string[]> {
    if (!this.isLoaded) await this.load();
    return this.mappings[entityId] || [];
  }

  async removeMapping(entityId: string, notificationId?: string): Promise<void> {
    if (!this.isLoaded) await this.load();
    if (!this.mappings[entityId]) return;

    if (notificationId) {
      this.mappings[entityId] = this.mappings[entityId].filter(id => id !== notificationId);
      if (this.mappings[entityId].length === 0) {
        delete this.mappings[entityId];
      }
    } else {
      delete this.mappings[entityId];
    }
    await this.save();
  }

  async clearAll(): Promise<void> {
    this.mappings = {};
    await AsyncStorage.removeItem(STORAGE_KEYS.MAPPINGS);
  }
}

export const notificationStorage = new NotificationStorage();
