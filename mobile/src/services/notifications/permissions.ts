import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { monitoringService } from '../monitoring';
import type { PermissionStatus } from './types';

export const getPermissionStatus = async (): Promise<PermissionStatus> => {
  const { status } = await Notifications.getPermissionsAsync();
  return status as PermissionStatus;
};

export const requestPermission = async (): Promise<PermissionStatus> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return 'granted';
    }

    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });

    monitoringService.captureMessage(`Notification permission requested: ${status}`, 'info');
    
    return status as PermissionStatus;
  } catch (error) {
    monitoringService.captureException(error, { context: 'notification_permission_request' });
    return 'undetermined';
  }
};
