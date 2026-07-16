import * as Notifications from 'expo-notifications';
import { notificationStorage } from './storage';
import { NOTIFICATION_CHANNELS } from './constants';
import type { ScheduleOptions } from './types';
import { monitoringService } from '../monitoring';
import { useNotificationStore } from '../../store/useNotificationStore';
import { parse, isAfter, isBefore, set, addDays } from 'date-fns';
import { QUEUE_CONFIG } from './constants';

interface QueueItem {
  options: ScheduleOptions;
  resolve: (value: string | null) => void;
}

const schedulingQueue: QueueItem[] = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  try {
    while (schedulingQueue.length > 0) {
      const batch = schedulingQueue.splice(0, QUEUE_CONFIG.BATCH_SIZE);
      
      await Promise.all(
        batch.map(async ({ options, resolve }) => {
          const id = await executeSchedule(options);
          resolve(id);
        })
      );

      if (schedulingQueue.length > 0) {
        // Yield to the event loop
        await new Promise(r => setTimeout(r, QUEUE_CONFIG.BATCH_DELAY_MS));
      }
    }
  } finally {
    isProcessingQueue = false;
  }
};

export const schedule = (options: ScheduleOptions): Promise<string | null> => {
  return new Promise((resolve) => {
    schedulingQueue.push({ options, resolve });
    processQueue();
  });
};

const executeSchedule = async (options: ScheduleOptions): Promise<string | null> => {
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

    let finalTriggerDate = new Date(options.triggerDate);

    // Adjust for quiet hours
    if (state.quietHoursEnabled) {
      const startSplit = state.quietHoursStart.split(':').map(Number);
      const endSplit = state.quietHoursEnd.split(':').map(Number);
      
      const startMinutes = startSplit[0] * 60 + startSplit[1];
      const endMinutes = endSplit[0] * 60 + endSplit[1];
      const currentMinutes = finalTriggerDate.getHours() * 60 + finalTriggerDate.getMinutes();

      let inQuietHours = false;
      if (startMinutes < endMinutes) {
        inQuietHours = currentMinutes >= startMinutes && currentMinutes < endMinutes;
      } else {
        inQuietHours = currentMinutes >= startMinutes || currentMinutes < endMinutes;
      }

      if (inQuietHours && state.quietHoursStrategy !== 'ALLOW_CRITICAL') {
        if (state.quietHoursStrategy === 'SUPPRESS') {
          return null; // Skip scheduling
        }
        if (state.quietHoursStrategy === 'MOVE_TO_END') {
          // Move to the exact end time
          finalTriggerDate = set(finalTriggerDate, { hours: endSplit[0], minutes: endSplit[1], seconds: 0, milliseconds: 0 });
          // If we rolled over midnight (e.g. current is 23:00, end is 08:00), we must add 1 day so it doesn't move to the PAST 08:00
          if (startMinutes > endMinutes && currentMinutes >= startMinutes) {
             finalTriggerDate = addDays(finalTriggerDate, 1);
          }
        }
      }
    }
    
    // In React Native Expo, local notifications have a `date` trigger for exact times
    const identifier = await Notifications.scheduleNotificationAsync({
      identifier: options.id, // Explicitly pass stable ID so expo overwrites existing
      content: {
        title: options.title,
        body: options.body,
        data: options.payload,
        sound: options.sound !== undefined ? options.sound : state.soundEnabled,
        badge: options.badge,
      },
      trigger: {
        date: finalTriggerDate,
        channelId: options.channelId || NOTIFICATION_CHANNELS.DEFAULT,
      } as Notifications.NotificationTriggerInput,
    });

    await notificationStorage.addMapping(options.payload.entityId, identifier);
    
    monitoringService.captureMessage(`Scheduled notification for ${options.payload.entityId}`, 'info');
    return identifier;
  } catch (error) {
    monitoringService.captureException(error, { 
      context: 'schedule_notification', 
      entityId: options.payload.entityId 
    });
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
