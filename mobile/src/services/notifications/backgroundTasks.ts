import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { monitoringService } from '../monitoring';
import { notificationService } from './notificationService';

const NOTIFICATION_MAINTENANCE_TASK = 'NOTIFICATION_MAINTENANCE';

// Define the background task
TaskManager.defineTask(NOTIFICATION_MAINTENANCE_TASK, async () => {
  try {
    monitoringService.captureMessage('Background notification maintenance started', 'info');

    // Here we would typically re-evaluate all active habits, tasks, goals
    // and call reminderEngine.process*(entity) to fix any missing/stale notifications.
    
    // For now, just a health check
    await notificationService.rescheduleAll();

    monitoringService.captureMessage('Background notification maintenance completed', 'info');
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    monitoringService.captureException(error, { context: 'background_notification_maintenance' });
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundTasks = async () => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(NOTIFICATION_MAINTENANCE_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(NOTIFICATION_MAINTENANCE_TASK, {
        minimumInterval: 60 * 60, // 1 hour
        stopOnTerminate: false, // android only
        startOnBoot: true, // android only
      });
      monitoringService.captureMessage('Background task registered', 'info');
    }
  } catch (err) {
    monitoringService.captureException(err, { context: 'register_background_tasks' });
  }
};
