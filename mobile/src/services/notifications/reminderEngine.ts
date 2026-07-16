import { notificationService } from './notificationService';
import { NOTIFICATION_CHANNELS } from './constants';
import type { Task, Goal, JournalEntry } from '../../features/planner/api/planner.types'; // wait, Need to adjust imports
import type { HabitModel } from '../../features/habits/api/habits.types';
import { parseISO, isPast, isToday, addDays, startOfDay } from 'date-fns';
import { useNotificationStore } from '../../store/useNotificationStore';

class ReminderEngine {

  /**
   * PLANNER
   */
  public async processTask(task: any): Promise<void> {
    await notificationService.cancel(task.id);

    const state = useNotificationStore.getState();
    if (!state.plannerEnabled || task.status === 'completed' || task.isArchived || !task.dueDate) {
      return;
    }

    // Attempt to parse due date
    try {
      const dateStr = task.dueTime ? `${task.dueDate}T${task.dueTime}` : `${task.dueDate}T09:00:00`;
      const triggerDate = new Date(dateStr);

      if (!isPast(triggerDate)) {
        await notificationService.schedule({
          id: `planner-task-${task.id}-due`,
          title: 'Task Due',
          body: `"${task.title}" is due soon.`,
          triggerDate,
          payload: { entityId: task.id, entityType: 'task' },
          channelId: NOTIFICATION_CHANNELS.PLANNER,
        });
      }
    } catch (e) {
      console.warn('Failed to parse task date', e);
    }
  }

  /**
   * HABITS
   */
  public async processHabit(habit: any): Promise<void> {
    await notificationService.cancel(habit.id);

    const state = useNotificationStore.getState();
    if (!state.habitsEnabled || habit.status !== 'active' || !habit.reminderEnabled || !habit.reminderTime) {
      return;
    }

    try {
      // Schedule reminder for today or tomorrow depending on if time passed
      const [hours, minutes] = habit.reminderTime.split(':').map(Number);
      let triggerDate = new Date();
      triggerDate.setHours(hours, minutes, 0, 0);

      if (isPast(triggerDate)) {
        triggerDate = addDays(triggerDate, 1);
      }

      await notificationService.schedule({
        id: `habit-${habit.id}-daily`,
        title: 'Habit Reminder',
        body: `Time to complete: ${habit.title}`,
        triggerDate,
        payload: { entityId: habit.id, entityType: 'habit' },
        channelId: NOTIFICATION_CHANNELS.HABITS,
      });

      // Missed habit reminder (e.g., 20:00)
      let missedDate = new Date();
      missedDate.setHours(20, 0, 0, 0);
      if (isPast(missedDate)) {
        missedDate = addDays(missedDate, 1);
      }
      
      await notificationService.schedule({
        id: `habit-${habit.id}-streak`,
        title: 'Streak at risk!',
        body: `You haven't completed "${habit.title}" today. Keep your streak alive!`,
        triggerDate: missedDate,
        payload: { entityId: habit.id, entityType: 'habit', action: 'missed' },
        channelId: NOTIFICATION_CHANNELS.HABITS,
      });
    } catch (e) {
      console.warn('Failed to parse habit date', e);
    }
  }

  /**
   * GOALS
   */
  public async processGoal(goal: any): Promise<void> {
    await notificationService.cancel(goal.id);

    const state = useNotificationStore.getState();
    if (!state.goalsEnabled || goal.status !== 'active' || !goal.deadline) {
      return;
    }

    try {
      const triggerDate = new Date(goal.deadline);
      // Remind 1 day before
      triggerDate.setDate(triggerDate.getDate() - 1);
      triggerDate.setHours(9, 0, 0, 0);

      if (!isPast(triggerDate)) {
        await notificationService.schedule({
          id: `goal-${goal.id}-deadline`,
          title: 'Goal Deadline Approaching',
          body: `Your goal "${goal.title}" is due tomorrow!`,
          triggerDate,
          payload: { entityId: goal.id, entityType: 'goal' },
          channelId: NOTIFICATION_CHANNELS.GOALS,
        });
      }
    } catch (e) {
      console.warn('Failed to parse goal date', e);
    }
  }

  /**
   * JOURNAL
   */
  public async processJournal(journal: any): Promise<void> {
    // Basic reminder support for journal entries if applicable
  }

  /**
   * JOURNEY
   */
  public async processJourney(memory: any): Promise<void> {
    // Basic reminder support
  }
}

export const reminderEngine = new ReminderEngine();
