import { schedule } from '../../services/notifications/scheduler';
import * as Notifications from 'expo-notifications';
import { useNotificationStore } from '../../store/useNotificationStore';

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue('test-id'),
}));

jest.mock('../../services/notifications/storage', () => ({
  notificationStorage: {
    addMapping: jest.fn().mockResolvedValue(undefined),
  }
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
}));

describe('Scheduler Quiet Hours Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNotificationStore.setState({
      globalEnabled: true,
      plannerEnabled: true,
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
      quietHoursStrategy: 'MOVE_TO_END'
    });
  });

  it('should shift trigger date if falling within quiet hours (MOVE_TO_END)', async () => {
    // 23:00 is in quiet hours
    const trigger = new Date();
    trigger.setHours(23, 0, 0, 0);

    await schedule({
      id: 'test-id',
      title: 'Quiet',
      body: 'Hours',
      triggerDate: trigger,
      payload: { entityId: 'e-1', entityType: 'task' }
    });

    // Check if the scheduled date was shifted to 08:00 the NEXT day
    const expected = new Date(trigger);
    expected.setDate(expected.getDate() + 1); // moved to next day since it was 23:00 and end is 08:00
    expected.setHours(8, 0, 0, 0);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(expect.objectContaining({
      trigger: expect.objectContaining({
        date: expected
      })
    }));
  });

  it('should suppress if strategy is SUPPRESS', async () => {
    useNotificationStore.setState({ quietHoursStrategy: 'SUPPRESS' });
    
    // 01:00 is in quiet hours
    const trigger = new Date();
    trigger.setHours(1, 0, 0, 0);

    const id = await schedule({
      id: 'test-id',
      title: 'Quiet',
      body: 'Hours',
      triggerDate: trigger,
      payload: { entityId: 'e-1', entityType: 'task' }
    });

    expect(id).toBeNull();
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('should not shift if strategy is ALLOW_CRITICAL', async () => {
    useNotificationStore.setState({ quietHoursStrategy: 'ALLOW_CRITICAL' });
    
    // 01:00 is in quiet hours
    const trigger = new Date();
    trigger.setHours(1, 0, 0, 0);

    await schedule({
      id: 'test-id',
      title: 'Quiet',
      body: 'Hours',
      triggerDate: trigger,
      payload: { entityId: 'e-1', entityType: 'task' }
    });

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(expect.objectContaining({
      trigger: expect.objectContaining({
        date: trigger
      })
    }));
  });
});
