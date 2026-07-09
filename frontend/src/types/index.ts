export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string; // ISO format (e.g. yyyy-MM-dd)
  dueTime?: string; // Time string (e.g. 10:00 AM)
  status: 'todo' | 'in-progress' | 'done';
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  recurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | null;
  subtasks?: Subtask[];
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  icon?: string;
  color: string;
  frequency: 'daily' | 'weekly';
  targetCount: number;
  currentCount: number;
  streak: number;
  longestStreak: number;
  completedToday: boolean;
  reminderTime?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  datesCompleted: string[]; // ISO date strings of when it was fully completed
  isArchived: boolean;
  isFavorite: boolean;
  
  // Legacy support
  name?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Archived';
  targetDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  progress: number;
  milestones: Milestone[];
  tags: string[];
  notes?: string;
  color?: string;
  icon?: string;
  favorite: boolean;
  estimatedCompletionDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  
  // Legacy support
  deadline?: string;
}

export interface Activity {
  id: string;
  type: 'task' | 'habit' | 'journal' | 'goal';
  message: string;
  timestamp: string; // ISO date
}

export interface TimelineEvent {
  id: string;
  type: 'goal' | 'milestone' | 'project' | 'journal' | 'habit' | 'task' | 'memory';
  title: string;
  description?: string;
  date: string; // ISO date
  tags?: string[];
  favorite?: boolean;
  metadata?: any;
}

export interface AppState {
  habits: Habit[];
  goals: Goal[];
  activities: Activity[];
  
  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'datesCompleted' | 'streak' | 'longestStreak' | 'currentCount' | 'completedToday'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabit: (habitId: string) => void;
  resetDailyHabits: () => void;
  
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  addMilestone: (goalId: string, milestone: Omit<Milestone, 'id'>) => void;
  updateMilestone: (goalId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
}

export interface AppSettings {
  // Appearance
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animations: boolean;
  
  // Planner
  defaultView: 'Day' | 'Week' | 'Month';
  weekStartsOn: 'Monday' | 'Sunday';
  defaultReminderTime: string; // e.g. "09:00"
  
  // Journal
  autosave: boolean;
  markdownSupport: boolean;
  defaultMood: string;
  
  // Notifications
  dailyReminder: boolean;
  goalReminder: boolean;
  habitReminder: boolean;
  
  // Dashboard
  widgetVisibility: {
    productivityScore: boolean;
    weather: boolean;
    quotes: boolean;
    recentActivity: boolean;
    habitTracker: boolean;
  };
  
  // Security
  privacyMode: boolean;
}

export interface BackupMetadata {
  lastBackupTime: string | null;
  backupSize: number | null; // in bytes
  applicationVersion: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

