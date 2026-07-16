export interface NotificationPayload {
  entityId: string;
  entityType: 'task' | 'habit' | 'goal' | 'journal' | 'journey';
  action?: string;
  [key: string]: any;
}

export interface ScheduleOptions {
  id: string;
  title: string;
  body: string;
  triggerDate: Date;
  payload: NotificationPayload;
  channelId?: string;
  badge?: number;
  sound?: boolean | string;
  vibrate?: number[];
}

export interface StoredNotificationMapping {
  entityId: string;
  notificationIds: string[];
}

export type PermissionStatus = 'granted' | 'denied' | 'provisional' | 'undetermined';
