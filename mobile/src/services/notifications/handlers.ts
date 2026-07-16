import * as Notifications from 'expo-notifications';
import { monitoringService } from '../monitoring';
import { navigateSafely } from '../../navigation/navigationRef';

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
      
      if (data?.entityType && data?.entityId) {
        switch (data.entityType) {
          case 'task':
            navigateSafely('Planner', { screen: 'TaskDetails', params: { id: data.entityId } });
            break;
          case 'habit':
            navigateSafely('Habits', { screen: 'HabitDetails', params: { id: data.entityId } });
            break;
          case 'goal':
            navigateSafely('Goals', { screen: 'GoalDetails', params: { id: data.entityId } });
            break;
          case 'journal':
            navigateSafely('Journal', { screen: 'JournalEditor', params: { id: data.entityId } });
            break;
          case 'journey':
            navigateSafely('Journey', { screen: 'MemoryDetails', params: { id: data.entityId } });
            break;
        }
      }
    } catch (error) {
      monitoringService.captureException(error, { context: 'notification_response_handler' });
    }
  });

  return () => {
    subscription.remove();
  };
};
