import { reminderEngine } from '../../services/notifications/reminderEngine';
import { notificationService } from '../../services/notifications/notificationService';
import { useNotificationStore } from '../../store/useNotificationStore';

jest.mock('../../services/notifications/notificationService', () => ({
  notificationService: {
    cancel: jest.fn().mockResolvedValue(undefined),
    schedule: jest.fn().mockResolvedValue('test-id'),
  }
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
}));

describe('ReminderEngine Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNotificationStore.setState({
      plannerEnabled: true,
      habitsEnabled: true,
      goalsEnabled: true,
      journalEnabled: true,
      journeyEnabled: true,
      globalEnabled: true,
    });
  });

  it('should use deterministic ID for planner tasks', async () => {
    // A task due tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const task = {
      id: 'task-123',
      title: 'Test Task',
      status: 'pending',
      isArchived: false,
      dueDate: dateStr,
      dueTime: '10:00:00'
    };

    await reminderEngine.processTask(task);
    expect(notificationService.schedule).toHaveBeenCalledWith(expect.objectContaining({
      id: 'planner-task-task-123-due'
    }));
  });

  it('should use deterministic IDs for habits (daily and streak)', async () => {
    const habit = {
      id: 'habit-123',
      title: 'Test Habit',
      status: 'active',
      reminderEnabled: true,
      reminderTime: '08:00'
    };

    await reminderEngine.processHabit(habit);
    expect(notificationService.schedule).toHaveBeenCalledWith(expect.objectContaining({
      id: 'habit-habit-123-daily'
    }));
    expect(notificationService.schedule).toHaveBeenCalledWith(expect.objectContaining({
      id: 'habit-habit-123-streak'
    }));
  });

  it('should use deterministic ID for goals', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2); // Reminds 1 day before
    const dateStr = tomorrow.toISOString().split('T')[0];

    const goal = {
      id: 'goal-123',
      title: 'Test Goal',
      status: 'active',
      deadline: dateStr
    };

    await reminderEngine.processGoal(goal);
    expect(notificationService.schedule).toHaveBeenCalledWith(expect.objectContaining({
      id: 'goal-goal-123-deadline'
    }));
  });
});
