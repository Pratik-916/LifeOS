import { useAppStore } from '../store/useAppStore';
import { format, subDays, isSameDay, parseISO, differenceInDays } from 'date-fns';

import type { Task } from '../types';

export function useDashboardStats() {
  const { habits, goals, activities, journalEntries } = useAppStore();
  const tasks: Task[] = [];
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  // Today's Tasks
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);
  const totalTasks = todayTasks.length;
  const completedTasks = todayTasks.filter(t => t.status === 'done').length;
  const pendingTasks = totalTasks - completedTasks;
  
  // Productivity Score (Calculated from completed tasks / total tasks + habit completions)
  let productivityScore = 0;
  if (totalTasks > 0) {
    productivityScore += (completedTasks / totalTasks) * 60; // Max 60 points from tasks
  }
  
  const todayHabitCompletions = habits.filter(h => h.datesCompleted.includes(todayStr)).length;
  if (habits.length > 0) {
    productivityScore += (todayHabitCompletions / habits.length) * 40; // Max 40 points from habits
  }
  
  productivityScore = Math.round(productivityScore);

  // Coding & Study Hours (Calculated from Historical Data)
  // Real app might have duration tracked, but here we just count tasks marked as Work/Learning
  const codingTasks = tasks.filter(t => t.category === 'Work' && t.status === 'done').length;
  const studyTasks = tasks.filter(t => t.category === 'Learning' && t.status === 'done').length;
  // Let's assume each task is approx 1.5 hours for dummy metric calculation
  const codingHours = Math.round(codingTasks * 1.5);
  const studyHours = Math.round(studyTasks * 1.5);

  // Streaks (Calculate current and longest streak from the most consistently completed habit)
  let currentStreak = 0;
  let longestStreak = 0;
  
  // Simplistic streak logic: find max datesCompleted length among all habits
  // A real SaaS would check consecutive days, but for dummy scaling this represents the idea:
  habits.forEach(habit => {
    // Sort dates
    const sortedDates = [...habit.datesCompleted].sort().reverse();
    let tempCurrent = 0;
    
    // Check if done today or yesterday to keep streak alive
    if (sortedDates.includes(todayStr) || sortedDates.includes(format(subDays(new Date(), 1), 'yyyy-MM-dd'))) {
      let checkDate = new Date();
      if (!sortedDates.includes(todayStr)) {
        checkDate = subDays(checkDate, 1);
      }
      
      while (sortedDates.includes(format(checkDate, 'yyyy-MM-dd'))) {
        tempCurrent++;
        checkDate = subDays(checkDate, 1);
      }
    }
    
    if (tempCurrent > currentStreak) currentStreak = tempCurrent;
    if (habit.datesCompleted.length > longestStreak) longestStreak = habit.datesCompleted.length;
  });

  // Goal Progress Calculation
  const calculatedGoalsProgress = goals.map(g => ({
    ...g,
    percent: g.progress || 0
  }));

  // Habit Data for UI
  const habitsProgress = habits.map(h => ({
    ...h,
    progress: h.datesCompleted.includes(todayStr) ? 100 : 0
  }));

  // Chart Generation: Weekly Data
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const dStr = format(d, 'yyyy-MM-dd');
    const dayTasks = tasks.filter(t => t.dueDate === dStr);
    const comp = dayTasks.filter(t => t.status === 'done').length;
    // Dummy focus calculation based on completions
    const focus = Math.max(0, comp - 1); 
    weeklyData.push({
      name: format(d, 'EEE'),
      tasks: dayTasks.length,
      focus: focus
    });
  }

  // Chart Generation: Monthly Progress
  // Hardcoded weeks for visual layout but driven by overall tasks completed
  const monthlyData = [
    { week: 'Week 1', completed: Math.round(tasks.length * 0.4) },
    { week: 'Week 2', completed: Math.round(tasks.length * 0.6) },
    { week: 'Week 3', completed: Math.round(tasks.length * 0.8) },
    { week: 'Week 4', completed: completedTasks + codingTasks }, // current projection
  ];

  // Heatmap Data (Last 90 Days) based on activity timestamps
  const heatmapData = [];
  for (let i = 0; i < 90; i++) {
    const d = subDays(new Date(), 89 - i);
    const dStr = format(d, 'yyyy-MM-dd');
    
    // Count activities on this day
    const dayActivities = activities.filter(a => a.timestamp.startsWith(dStr)).length;
    
    let intensity = 0;
    if (dayActivities > 0) intensity = 1;
    if (dayActivities > 2) intensity = 2;
    if (dayActivities > 4) intensity = 3;
    if (dayActivities > 6) intensity = 4;

    heatmapData.push({
      date: d.toISOString(),
      intensity
    });
  }

  // Recent Activity Formatting
  const formattedActivities = activities.slice(0, 5).map(a => {
    const timestampDate = new Date(a.timestamp);
    let timeLabel = '';
    
    const diffDays = differenceInDays(new Date(), timestampDate);
    if (diffDays === 0) {
      timeLabel = 'Today';
    } else if (diffDays === 1) {
      timeLabel = 'Yesterday';
    } else {
      timeLabel = `${diffDays} days ago`;
    }

    return {
      ...a,
      timeLabel
    };
  });

  return {
    todayTasks,
    totalTasks,
    completedTasks,
    pendingTasks,
    productivityScore,
    currentStreak,
    longestStreak,
    codingHours,
    studyHours,
    journalEntriesCount: journalEntries.length,
    habitsProgress,
    calculatedGoalsProgress,
    weeklyData,
    monthlyData,
    heatmapData,
    recentActivity: formattedActivities,
  };
}
