import type { Task, Habit, Goal, Activity } from '../types';
import { format, subDays } from 'date-fns';

const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');
const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
const twoDaysAgoStr = format(subDays(today, 2), 'yyyy-MM-dd');
const threeDaysAgoStr = format(subDays(today, 3), 'yyyy-MM-dd');

export const initialTasks: Task[] = [
  { id: 't1', title: 'Complete React Dashboard UI', status: 'todo', dueTime: '10:00 AM', dueDate: todayStr, category: 'Work', priority: 'high', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't2', title: 'Review PRs for API Gateway', status: 'done', dueTime: '11:30 AM', dueDate: todayStr, category: 'Work', priority: 'medium', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't3', title: 'Team Standup', status: 'done', dueTime: '1:00 PM', dueDate: todayStr, category: 'Work', priority: 'low', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't4', title: 'Read 2 chapters of Clean Code', status: 'todo', dueTime: '4:00 PM', dueDate: todayStr, category: 'Learning', priority: 'medium', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't5', title: 'Workout (Push day)', status: 'todo', dueTime: '6:30 PM', dueDate: todayStr, category: 'Health', priority: 'high', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  // Historical data for coding hours/study hours/etc.
  { id: 't6', title: 'Build auth service', status: 'done', dueDate: yesterdayStr, category: 'Work', priority: 'high', createdAt: subDays(new Date(), 1).toISOString(), updatedAt: subDays(new Date(), 1).toISOString() },
  { id: 't7', title: 'Study algorithms', status: 'done', dueDate: yesterdayStr, category: 'Learning', priority: 'high', createdAt: subDays(new Date(), 1).toISOString(), updatedAt: subDays(new Date(), 1).toISOString() },
];

export const initialHabits: Habit[] = [
  { 
    id: 'h1', 
    title: 'Drink 2L Water', 
    category: 'Health',
    icon: 'Droplet',
    color: 'from-blue-500 to-cyan-500', 
    frequency: 'daily',
    targetCount: 3,
    currentCount: 0,
    streak: 4,
    longestStreak: 12,
    completedToday: false,
    createdAt: subDays(new Date(), 30).toISOString(),
    updatedAt: new Date().toISOString(),
    datesCompleted: [todayStr, yesterdayStr, twoDaysAgoStr, threeDaysAgoStr],
    isArchived: false,
    isFavorite: true
  },
  { 
    id: 'h2', 
    title: 'Read 20 pages', 
    category: 'Learning',
    icon: 'BookOpen',
    color: 'from-green-500 to-emerald-500', 
    frequency: 'daily',
    targetCount: 1,
    currentCount: 0,
    streak: 3,
    longestStreak: 15,
    completedToday: false,
    createdAt: subDays(new Date(), 20).toISOString(),
    updatedAt: new Date().toISOString(),
    datesCompleted: [todayStr, yesterdayStr, twoDaysAgoStr],
    isArchived: false,
    isFavorite: true
  },
  { 
    id: 'h3', 
    title: 'Coding Practice', 
    category: 'Work',
    icon: 'Code',
    color: 'from-purple-500 to-fuchsia-500', 
    frequency: 'daily',
    targetCount: 1,
    currentCount: 0,
    streak: 3,
    longestStreak: 30,
    completedToday: false,
    createdAt: subDays(new Date(), 60).toISOString(),
    updatedAt: new Date().toISOString(),
    datesCompleted: [yesterdayStr, twoDaysAgoStr, threeDaysAgoStr],
    isArchived: false,
    isFavorite: false
  },
  { 
    id: 'h4', 
    title: 'Meditation', 
    category: 'Health',
    icon: 'Heart',
    color: 'from-orange-500 to-red-500', 
    frequency: 'daily',
    targetCount: 1,
    currentCount: 0,
    streak: 0,
    longestStreak: 5,
    completedToday: false,
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: new Date().toISOString(),
    datesCompleted: [],
    isArchived: false,
    isFavorite: false
  },
];

export const initialGoals: Goal[] = [
  { 
    id: 'g1', 
    title: 'Ship LifeOS MVP', 
    description: 'Complete all core modules including Dashboard, Planner, Journal, Goals, Journey, and Analytics. Must be bug-free and production ready.',
    category: 'Work',
    priority: 'High',
    status: 'In Progress',
    targetDate: '2026-07-30',
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: new Date().toISOString(),
    progress: 75,
    milestones: [
      { id: 'm1', title: 'Complete Dashboard UI', completed: true, completedAt: subDays(new Date(), 8).toISOString() },
      { id: 'm2', title: 'Connect Planner to Zustand', completed: true, completedAt: subDays(new Date(), 4).toISOString() },
      { id: 'm3', title: 'Implement Journal Autosave', completed: true, completedAt: subDays(new Date(), 1).toISOString() },
      { id: 'm4', title: 'Build Goals module', completed: false }
    ],
    tags: ['React', 'SaaS', 'MVP'],
    color: 'from-blue-500 to-cyan-500',
    favorite: true
  },
  { 
    id: 'g2', 
    title: 'Read 12 Books', 
    description: 'Expand my knowledge across design, programming, and personal development.',
    category: 'Personal',
    priority: 'Medium',
    status: 'In Progress',
    targetDate: '2026-12-31',
    createdAt: subDays(new Date(), 30).toISOString(),
    updatedAt: new Date().toISOString(),
    progress: 41,
    milestones: [
      { id: 'm1', title: 'Read Atomic Habits', completed: true, completedAt: subDays(new Date(), 20).toISOString() },
      { id: 'm2', title: 'Read Clean Code', completed: true, completedAt: subDays(new Date(), 5).toISOString() },
      { id: 'm3', title: 'Read The Pragmatic Programmer', completed: false }
    ],
    tags: ['Reading', 'Growth'],
    color: 'from-green-500 to-emerald-500',
    favorite: false
  },
  { 
    id: 'g3', 
    title: 'Run a Half Marathon', 
    description: 'Train consistently to run 21km without stopping.',
    category: 'Health',
    priority: 'High',
    status: 'In Progress',
    targetDate: '2026-10-31',
    createdAt: subDays(new Date(), 15).toISOString(),
    updatedAt: new Date().toISOString(),
    progress: 42,
    milestones: [
      { id: 'm1', title: 'Run 5km', completed: true, completedAt: subDays(new Date(), 10).toISOString() },
      { id: 'm2', title: 'Run 10km', completed: false },
      { id: 'm3', title: 'Run 15km', completed: false }
    ],
    tags: ['Fitness', 'Running'],
    color: 'from-orange-500 to-red-500',
    favorite: true
  },
];

export const initialActivities: Activity[] = [
  { id: 'a1', type: 'task', message: 'Completed "Review PRs for API Gateway"', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'a2', type: 'habit', message: 'Logged "Read 20 pages"', timestamp: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: 'a3', type: 'journal', message: 'Wrote a new journal entry', timestamp: subDays(new Date(), 1).toISOString() },
  { id: 'a4', type: 'goal', message: 'Reached milestone in "Learn Rust"', timestamp: subDays(new Date(), 2).toISOString() },
];
