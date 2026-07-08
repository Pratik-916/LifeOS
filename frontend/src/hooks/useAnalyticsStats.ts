import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  subDays, isAfter, isBefore, startOfDay, endOfDay, 
  parseISO, format, eachDayOfInterval, differenceInDays, startOfWeek, endOfWeek, eachWeekOfInterval
} from 'date-fns';

export type TimeRange = '7D' | '30D' | '90D' | 'YEAR' | 'ALL';

import type { Task } from '../types';

export function useAnalyticsStats(timeRange: TimeRange) {
  const { goals, journalEntries, activities, habits } = useAppStore();
  const tasks: Task[] = [];

  const now = new Date();
  
  // Date boundaries based on timeRange
  const startDate = useMemo(() => {
    switch (timeRange) {
      case '7D': return subDays(now, 7);
      case '30D': return subDays(now, 30);
      case '90D': return subDays(now, 90);
      case 'YEAR': return subDays(now, 365);
      case 'ALL': default: return new Date(2000, 0, 1);
    }
  }, [timeRange]);

  // General Filter Function
  const isWithinRange = (dateStr?: string) => {
    if (!dateStr) return false;
    try {
      const d = parseISO(dateStr);
      return isAfter(d, startDate) && isBefore(d, endOfDay(now));
    } catch(e) {
      return false;
    }
  };

  // 1. OVERVIEW METRICS
  const overview = useMemo(() => {
    const periodTasks = tasks.filter(t => isWithinRange(t.dueDate || (t as any).date));
    const completedTasks = periodTasks.filter(t => t.status === 'done' || (t as any).completed).length;
    
    const periodGoals = goals.filter(g => isWithinRange(g.createdAt));
    const activeGoals = periodGoals.filter(g => g.status === 'In Progress').length;
    const completedGoals = periodGoals.filter(g => g.status === 'Completed').length;
    
    const periodJournal = journalEntries.filter(j => isWithinRange(j.date));
    
    const periodActivities = activities.filter(a => isWithinRange(a.timestamp));

    // Simple Productivity Score: (completedTasks / totalTasks) * 60 + habit completion ratio
    let productivityScore = 0;
    if (periodTasks.length > 0) {
      productivityScore += (completedTasks / periodTasks.length) * 60;
    }
    const periodHabits = habits.flatMap(h => h.datesCompleted.filter(isWithinRange));
    if (habits.length > 0 && timeRange !== 'ALL') {
      const expectedHabits = habits.length * (timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90);
      productivityScore += (periodHabits.length / Math.max(expectedHabits, 1)) * 40;
    }
    
    // Streaks (simplified, calculating max consecutive days in activities)
    let currentStreak = 0;
    let longestStreak = 0;
    
    // Sort unique activity dates
    const activityDates = [...new Set(activities.map(a => format(parseISO(a.timestamp), 'yyyy-MM-dd')))].sort().reverse();
    const todayStr = format(now, 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(now, 1), 'yyyy-MM-dd');
    
    if (activityDates.includes(todayStr) || activityDates.includes(yesterdayStr)) {
      let checkDate = new Date();
      if (!activityDates.includes(todayStr)) checkDate = subDays(checkDate, 1);
      
      while (activityDates.includes(format(checkDate, 'yyyy-MM-dd'))) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      }
    }
    
    // Longest streak calculation
    let tempLongest = 1;
    let currentTemp = 1;
    for (let i = 0; i < activityDates.length - 1; i++) {
      const d1 = parseISO(activityDates[i]);
      const d2 = parseISO(activityDates[i+1]);
      if (differenceInDays(d1, d2) === 1) {
        currentTemp++;
        if (currentTemp > tempLongest) tempLongest = currentTemp;
      } else {
        currentTemp = 1;
      }
    }
    longestStreak = tempLongest;

    return {
      productivityScore: Math.round(productivityScore),
      currentStreak,
      longestStreak,
      totalTasks: periodTasks.length,
      completedTasks,
      activeGoals,
      completedGoals,
      journalEntries: periodJournal.length,
      totalActivities: periodActivities.length
    };
  }, [tasks, goals, journalEntries, activities, habits, timeRange, startDate]);

  // 2. TASK ANALYTICS
  const taskAnalytics = useMemo(() => {
    const periodTasks = tasks.filter(t => isWithinRange(t.dueDate || (t as any).date));
    
    // Daily Task Completion
    const days = timeRange === 'ALL' || timeRange === 'YEAR' ? 30 : (timeRange === '7D' ? 7 : (timeRange === '30D' ? 30 : 90));
    const dailyData = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = subDays(now, i);
      const dStr = format(d, 'yyyy-MM-dd');
      const dayTasks = periodTasks.filter(t => (t.dueDate || (t as any).date) === dStr);
      dailyData.push({
        date: format(d, 'MMM dd'),
        completed: dayTasks.filter(t => t.status === 'done' || (t as any).completed).length,
        pending: dayTasks.filter(t => t.status !== 'done' && !(t as any).completed).length,
      });
    }

    // Distributions
    const statusDist = [
      { name: 'To Do', value: periodTasks.filter(t => t.status === 'todo' && !(t as any).completed).length },
      { name: 'In Progress', value: periodTasks.filter(t => t.status === 'in-progress').length },
      { name: 'Done', value: periodTasks.filter(t => t.status === 'done' || (t as any).completed).length },
    ].filter(d => d.value > 0);

    const priorities = { low: 0, medium: 0, high: 0 };
    const categories: Record<string, number> = {};
    
    periodTasks.forEach(t => {
      priorities[t.priority || 'medium']++;
      categories[t.category || 'Other'] = (categories[t.category || 'Other'] || 0) + 1;
    });

    const priorityDist = Object.entries(priorities).map(([k, v]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: v })).filter(d => d.value > 0);
    const categoryDist = Object.entries(categories).map(([k, v]) => ({ name: k, value: v }));

    return { dailyData, statusDist, priorityDist, categoryDist };
  }, [tasks, timeRange, startDate]);

  // 3. GOAL ANALYTICS
  const goalAnalytics = useMemo(() => {
    const periodGoals = goals.filter(g => isWithinRange(g.createdAt) || isWithinRange(g.targetDate));
    
    const active = periodGoals.filter(g => g.status === 'In Progress').length;
    const completed = periodGoals.filter(g => g.status === 'Completed').length;
    
    const statusDist = [
      { name: 'Active', value: active },
      { name: 'Completed', value: completed },
      { name: 'Not Started', value: periodGoals.filter(g => g.status === 'Not Started').length },
    ].filter(d => d.value > 0);

    const categories: Record<string, number> = {};
    periodGoals.forEach(g => {
      categories[g.category || 'Other'] = (categories[g.category || 'Other'] || 0) + 1;
    });
    const categoryDist = Object.entries(categories).map(([k, v]) => ({ name: k, value: v }));

    // Milestone Completion
    const totalMilestones = periodGoals.reduce((acc, g) => acc + (g.milestones?.length || 0), 0);
    const completedMilestones = periodGoals.reduce((acc, g) => acc + (g.milestones?.filter(m => m.completed).length || 0), 0);
    
    return {
      statusDist,
      categoryDist,
      completionRate: periodGoals.length > 0 ? Math.round((completed / periodGoals.length) * 100) : 0,
      totalMilestones,
      completedMilestones,
      milestoneRate: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
    };
  }, [goals, timeRange, startDate]);

  // 4. JOURNAL ANALYTICS
  const journalAnalytics = useMemo(() => {
    const periodJournal = journalEntries.filter(j => isWithinRange(j.date));
    
    const totalWords = periodJournal.reduce((acc, j) => acc + (j.wordCount || 0), 0);
    const totalReadingTime = periodJournal.reduce((acc, j) => acc + (j.readingTime || 0), 0);
    const avgWords = periodJournal.length > 0 ? Math.round(totalWords / periodJournal.length) : 0;
    
    const moods: Record<string, number> = {};
    periodJournal.forEach(j => {
      if (j.mood) moods[j.mood] = (moods[j.mood] || 0) + 1;
    });
    const moodDist = Object.entries(moods).map(([k, v]) => ({ name: k, value: v }));

    return {
      totalWords,
      totalReadingTime,
      avgWords,
      moodDist
    };
  }, [journalEntries, timeRange, startDate]);

  // 5. PRODUCTIVITY ANALYTICS
  const productivityAnalytics = useMemo(() => {
    const periodTasks = tasks.filter(t => isWithinRange(t.dueDate || (t as any).date));
    
    // Coding / Study Hours
    let codingMinutes = 0;
    let studyMinutes = 0;
    
    periodTasks.filter(t => t.status === 'done' || (t as any).completed).forEach(t => {
      const mins = t.actualMinutes || t.estimatedMinutes || 60;
      if (t.category === 'Work' || t.category === 'Coding') codingMinutes += mins;
      if (t.category === 'Learning' || t.category === 'Study') studyMinutes += mins;
    });

    // Heatmap (Last 90 days regardless of filter to keep it looking like a github graph, or bounded by filter)
    const heatmapDays = timeRange === '7D' ? 7 : (timeRange === '30D' ? 30 : 90); // Max 90 days for UI reasons
    const heatmapData = [];
    for (let i = heatmapDays - 1; i >= 0; i--) {
      const d = subDays(now, i);
      const dStr = format(d, 'yyyy-MM-dd');
      
      const dayActivities = activities.filter(a => a.timestamp.startsWith(dStr)).length;
      const dayTasks = tasks.filter(t => (t.dueDate || (t as any).date) === dStr && (t.status === 'done' || (t as any).completed)).length;
      const total = dayActivities + dayTasks;
      
      let intensity = 0;
      if (total > 0) intensity = 1;
      if (total > 2) intensity = 2;
      if (total > 4) intensity = 3;
      if (total > 6) intensity = 4;
      
      heatmapData.push({ date: dStr, intensity, count: total });
    }

    return {
      codingHours: +(codingMinutes / 60).toFixed(1),
      studyHours: +(studyMinutes / 60).toFixed(1),
      heatmapData
    };
  }, [tasks, activities, timeRange, startDate]);


  return {
    overview,
    taskAnalytics,
    goalAnalytics,
    journalAnalytics,
    productivityAnalytics
  };
}
