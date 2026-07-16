import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NOTIFICATION_CHANNELS } from './constants';
import { monitoringService } from '../monitoring';

export const setupChannels = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;

  try {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.PLANNER, {
      name: 'Planner Reminders',
      description: 'Reminders for your tasks and schedule',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.HABITS, {
      name: 'Habit Reminders',
      description: 'Daily and weekly habit reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.GOALS, {
      name: 'Goal Milestones',
      description: 'Goal deadline and milestone alerts',
      importance: Notifications.AndroidImportance.HIGH,
    });

    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.JOURNAL, {
      name: 'Journal Prompts',
      description: 'Daily reflection reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.JOURNEY, {
      name: 'Journey Memories',
      description: 'Reminders to capture memories',
      importance: Notifications.AndroidImportance.LOW,
    });

    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.DEFAULT, {
      name: 'General Notifications',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    monitoringService.captureException(error, { context: 'setup_notification_channels' });
  }
};
