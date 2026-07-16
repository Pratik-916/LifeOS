import * as Notifications from 'expo-notifications';
import { monitoringService } from '../monitoring';
import { navigateSafely } from '../../navigation/navigationRef';

export const setupHandlers = () => {
  // Handle notifications that are received while the app is in the foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true,
    }),
  });

  // Handle notification interactions (e.g. user taps the notification)
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    try {
      const data = response.notification.request.content.data;
      monitoringService.captureMessage(`Notification tapped: ${data?.entityType}`, 'info');
      
      if (data?.entityType && data?.entityId) {
        switch (data.entityType) {
          case 'task':
            navigateSafely('Tabs', { screen: 'Planner' } as never);
            break;
          case 'habit':
            navigateSafely('Tabs', { screen: 'Habits' } as never);
            break;
          case 'goal':
            navigateSafely('Tabs', { screen: 'Goals' } as never);
            break;
          case 'journal':
            navigateSafely('Tabs', { screen: 'Journal' } as never);
            break;
          case 'journey':
            navigateSafely('Tabs', { screen: 'Journey' } as never);
            break;
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      monitoringService.captureException(error, { context: 'notification_response_handler' });
    }
  });

  return () => {
    subscription.remove();
  };
};
