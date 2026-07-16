import { setupChannels } from './channels';
import { setupHandlers } from './handlers';
import { requestPermission, getPermissionStatus } from './permissions';
import { schedule, cancel, cancelAll, getScheduled } from './scheduler';
import type { ScheduleOptions, PermissionStatus } from './types';

class NotificationService {
  private removeHandlers?: () => void;

  public async initialize(): Promise<void> {
    await setupChannels();
    this.removeHandlers = setupHandlers();
  }

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
  }
}

export const notificationService = new NotificationService();
