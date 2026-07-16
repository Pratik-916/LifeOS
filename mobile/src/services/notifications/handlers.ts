import * as Notifications from 'expo-notifications';
import { monitoringService } from '../monitoring';

export const setupHandlers = () => {
  // Handle notifications that are received while the app is in the foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Handle notification interactions (e.g. user taps the notification)
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    try {
      const data = response.notification.request.content.data;
      monitoringService.captureMessage(`Notification tapped: ${data?.entityType}`, 'info');
      // Navigation routing could be handled here via a global navigation reference
    } catch (error) {
      monitoringService.captureException(error, { context: 'notification_response_handler' });
    }
  });

  return () => {
    subscription.remove();
  };
};
