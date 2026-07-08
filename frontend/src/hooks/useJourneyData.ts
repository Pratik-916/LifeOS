import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { TimelineEvent } from '../types';
import { format, parseISO } from 'date-fns';

export interface TimelineMonth {
  month: string; // e.g., 'January'
  events: TimelineEvent[];
}

export interface TimelineYear {
  year: string; // e.g., '2026'
  months: TimelineMonth[];
}

export interface JourneyStatisticsData {
  activeYears: number;
  totalAchievements: number;
  goalsCompleted: number;
  tasksCompleted: number;
  journalEntries: number;
  longestHabitStreak: number;
  totalMemories: number;
}

import type { Task } from '../types';

export function useJourneyData() {
  const { goals, memories, journalEntries, habits, activities } = useAppStore();
  const tasks: Task[] = useMemo(() => [], []);

  const timelineData = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Add completed goals
    goals.forEach(goal => {
      if (goal.status === 'Completed' || goal.progress === 100) {
        events.push({
          id: `goal-${goal.id}`,
          type: 'goal',
          title: `Completed Goal: ${goal.title}`,
          description: goal.description,
          date: goal.completedAt || goal.updatedAt,
          tags: goal.tags,
          favorite: goal.favorite,
          metadata: { color: goal.color, category: goal.category }
        });
      }

      // Add completed milestones
      goal.milestones.forEach(m => {
        if (m.completed) {
          events.push({
            id: `milestone-${m.id}`,
            type: 'milestone',
            title: `Milestone Achieved: ${m.title}`,
            description: `Part of goal: ${goal.title}`,
            date: m.completedAt || goal.updatedAt,
            tags: goal.tags,
          });
        }
      });
    });

    // Add memories
    if (memories) {
      memories.forEach(memory => {
        events.push({
          id: `memory-${memory.id}`,
          type: 'memory',
          title: memory.title,
          description: memory.description,
          date: memory.date,
          tags: memory.tags,
          favorite: memory.favorite,
          metadata: { photos: memory.photos }
        });
      });
    }

    // Add journal entries
    journalEntries.forEach(entry => {
      events.push({
        id: `journal-${entry.id}`,
        type: 'journal',
        title: entry.title,
        description: entry.excerpt || (entry.content.substring(0, 100) + '...'),
        date: entry.date || entry.createdAt,
        tags: entry.tags,
        favorite: entry.favorite,
        metadata: { mood: entry.mood }
      });
    });

    // Add habit streaks (if streak > 10)
    habits.forEach(habit => {
      if (habit.longestStreak >= 10) {
        // Find the most recent completion date or use updatedAt
        const lastDate = (habit.datesCompleted && habit.datesCompleted.length > 0) ? habit.datesCompleted[0] : habit.updatedAt;
        events.push({
          id: `habit-${habit.id}-streak`,
          type: 'habit',
          title: `Habit Streak: ${habit.title}`,
          description: `Reached a ${habit.longestStreak}-day streak!`,
          date: lastDate,
          tags: [habit.category],
          metadata: { color: habit.color, icon: habit.icon }
        });
      }
    });

    // Add significant activities
    tasks.forEach(task => {
      if (task.status === 'done' && task.priority === 'high') {
        events.push({
          id: `task-${task.id}`,
          type: 'task',
          title: `Completed Priority Task: ${task.title}`,
          date: task.completedAt || task.updatedAt,
          tags: task.tags || [task.category],
        });
      }
    });

    // Sort all events by date descending
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Group by Year -> Month
    const groupedByYear = new Map<string, Map<string, TimelineEvent[]>>();

    events.forEach(event => {
      if (!event.date) return;
      try {
        const dateObj = parseISO(event.date);
        const year = format(dateObj, 'yyyy');
        const month = format(dateObj, 'MMMM');

        if (!groupedByYear.has(year)) {
          groupedByYear.set(year, new Map());
        }
        
        const yearMap = groupedByYear.get(year)!;
        if (!yearMap.has(month)) {
          yearMap.set(month, []);
        }
        
        yearMap.get(month)!.push(event);
      } catch (error) {
        console.error('Invalid date format for event:', event);
      }
    });

    // Convert to Array structure
    const timeline: TimelineYear[] = Array.from(groupedByYear.entries()).map(([year, monthsMap]) => {
      const months: TimelineMonth[] = Array.from(monthsMap.entries()).map(([month, monthEvents]) => ({
        month,
        events: monthEvents
      }));
      // Sort months conceptually
      const monthOrder = ['December', 'November', 'October', 'September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January'];
      months.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

      return { year, months };
    });

    // Sort years descending
    timeline.sort((a, b) => parseInt(b.year) - parseInt(a.year));

    return { events, timeline };
  }, [goals, memories, journalEntries, habits, activities, tasks]);

  const stats: JourneyStatisticsData = useMemo(() => {
    const goalsCompleted = goals.filter(g => g.status === 'Completed' || g.progress === 100).length;
    const tasksCompleted = tasks.filter(t => t.status === 'done').length;
    const milestonesCompleted = goals.flatMap(g => g.milestones).filter(m => m.completed).length;
    const totalAchievements = goalsCompleted + milestonesCompleted;
    
    const longestHabitStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
    const activeYears = timelineData.timeline.length;

    return {
      activeYears,
      totalAchievements,
      goalsCompleted,
      tasksCompleted,
      journalEntries: journalEntries.length,
      longestHabitStreak,
      totalMemories: memories ? memories.length : 0
    };
  }, [goals, tasks, journalEntries, habits, memories, timelineData.timeline]);

  return { ...timelineData, stats };
};
