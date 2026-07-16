import { setupChannels } from './channels';
import { setupHandlers } from './handlers';
import { requestPermission, getPermissionStatus } from './permissions';
import { schedule, cancel, cancelAll, getScheduled } from './scheduler';
import type { ScheduleOptions, PermissionStatus } from './types';
import { AppState, AppStateStatus } from 'react-native';
import { useNotificationStore } from '../../store/useNotificationStore';
import { monitoringService } from '../monitoring';

class NotificationService {
  private removeHandlers?: () => void;
  private appStateSubscription?: { remove: () => void };

  public async initialize(): Promise<void> {
    await setupChannels();
    this.removeHandlers = setupHandlers();
    
    // Register AppState listener to check for permission revocation or restoration
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
  }

  private handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      try {
        const status = await this.getPermissionStatus();
        const store = useNotificationStore.getState();
        if (status !== 'granted' && store.globalEnabled) {
          monitoringService.captureMessage('Notification permission revoked by user in settings', 'warning');
          store.setGlobalEnabled(false);
        } else if (status === 'granted' && !store.globalEnabled) {
          // If the user restored permissions natively, we might not want to auto-enable everything,
          // but logging it is useful. Or we can auto-enable if we choose.
          monitoringService.captureMessage('Notification permission restored by user in settings', 'info');
        }
      } catch (error) {
        monitoringService.captureException(error, { context: 'app_state_permission_check' });
      }
    }
  };

  public async requestPermission(): Promise<PermissionStatus> {
    return requestPermission();
  }

  public async getPermissionStatus(): Promise<PermissionStatus> {
    return getPermissionStatus();
  }

  public async schedule(options: ScheduleOptions): Promise<string | null> {
    return schedule(options);
  }

  public async cancel(entityId: string): Promise<void> {
    return cancel(entityId);
  }

  public async cancelAll(): Promise<void> {
    return cancelAll();
  }

  public async rescheduleAll(): Promise<void> {
    // This will be invoked by background tasks.
    // In a full implementation, it would fetch all active entities and re-run them through ReminderEngine.
  }

  public async getScheduled() {
    return getScheduled();
  }

  public cleanup() {
    if (this.removeHandlers) {
      this.removeHandlers();
    }
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
  }
}

export const notificationService = new NotificationService();
