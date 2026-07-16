import * as Notifications from 'expo-notifications';
import { notificationStorage } from './storage';
import { NOTIFICATION_CHANNELS } from './constants';
import type { ScheduleOptions } from './types';
import { monitoringService } from '../monitoring';
import { useNotificationStore } from '../../store/useNotificationStore';

export const schedule = async (options: ScheduleOptions): Promise<string | null> => {
  try {
    const state = useNotificationStore.getState();
    if (!state.globalEnabled) return null;

    // Check feature toggle
    const entityType = options.payload.entityType;
    if (entityType === 'task' && !state.plannerEnabled) return null;
    if (entityType === 'habit' && !state.habitsEnabled) return null;
    if (entityType === 'goal' && !state.goalsEnabled) return null;
    if (entityType === 'journal' && !state.journalEnabled) return null;
    if (entityType === 'journey' && !state.journeyEnabled) return null;

    // Adjust for quiet hours (basic implementation: if triggered during quiet hours, we could skip or delay. For now, we schedule as requested).
    
    // In React Native Expo, local notifications have a `date` trigger for exact times
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: options.title,
        body: options.body,
        data: options.payload,
        sound: options.sound !== undefined ? options.sound : state.soundEnabled,
        badge: options.badge,
      },
      trigger: {
        date: options.triggerDate,
        channelId: options.channelId || NOTIFICATION_CHANNELS.DEFAULT,
      } as Notifications.NotificationTriggerInput,
    });

    await notificationStorage.addMapping(options.payload.entityId, identifier);
    
    monitoringService.captureMessage(`Scheduled notification for ${options.payload.entityId}`, 'info');
    return identifier;
  } catch (error) {
    monitoringService.captureException(error, { context: 'schedule_notification', payload: options.payload });
    return null;
  }
};

export const cancel = async (entityId: string): Promise<void> => {
  try {
    const notificationIds = await notificationStorage.getMappings(entityId);
    for (const id of notificationIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
      await notificationStorage.removeMapping(entityId, id);
    }
    monitoringService.captureMessage(`Cancelled notifications for ${entityId}`, 'info');
  } catch (error) {
    monitoringService.captureException(error, { context: 'cancel_notification', entityId });
  }
};

export const cancelAll = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await notificationStorage.clearAll();
  } catch (error) {
    monitoringService.captureException(error, { context: 'cancel_all_notifications' });
  }
};

export const getScheduled = async (): Promise<Notifications.NotificationRequest[]> => {
  return await Notifications.getAllScheduledNotificationsAsync();
};
