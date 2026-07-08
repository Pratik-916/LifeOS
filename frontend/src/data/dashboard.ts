import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  TrendingUp, 
  Award, 
  Terminal, 
  BookOpen, 
  PenTool
} from 'lucide-react';

export const statCards = [
  { id: 1, title: 'Tasks Completed', value: '12', icon: CheckCircle2, color: 'text-success' },
  { id: 2, title: 'Tasks Pending', value: '4', icon: Clock, color: 'text-warning' },
  { id: 3, title: 'Current Streak', value: '14 Days', icon: Flame, color: 'text-orange-500' },
  { id: 4, title: 'Longest Streak', value: '42 Days', icon: Award, color: 'text-yellow-400' },
  { id: 5, title: 'Productivity Score', value: '92%', icon: TrendingUp, color: 'text-accent' },
  { id: 6, title: 'Coding Hours', value: '38h', icon: Terminal, color: 'text-purple-500' },
  { id: 7, title: 'Study Hours', value: '15h', icon: BookOpen, color: 'text-blue-400' },
  { id: 8, title: 'Journal Entries', value: '28', icon: PenTool, color: 'text-pink-500' },
];

export const todayTasks = [
  { id: 1, title: 'Complete React Dashboard UI', completed: false, time: '10:00 AM' },
  { id: 2, title: 'Review PRs for API Gateway', completed: true, time: '11:30 AM' },
  { id: 3, title: 'Team Standup', completed: true, time: '1:00 PM' },
  { id: 4, title: 'Read 2 chapters of Clean Code', completed: false, time: '4:00 PM' },
  { id: 5, title: 'Workout (Push day)', completed: false, time: '6:30 PM' },
];

export const habits = [
  { id: 1, name: 'Drink 2L Water', progress: 80, color: 'bg-blue-500' },
  { id: 2, name: 'Read 20 pages', progress: 100, color: 'bg-green-500' },
  { id: 3, name: 'Coding Practice', progress: 60, color: 'bg-purple-500' },
  { id: 4, name: 'Meditation', progress: 0, color: 'bg-orange-500' },
];

export const recentActivity = [
  { id: 1, type: 'task', message: 'Completed "Review PRs for API Gateway"', time: '2 hours ago' },
  { id: 2, type: 'habit', message: 'Logged "Read 20 pages"', time: '4 hours ago' },
  { id: 3, type: 'journal', message: 'Wrote a new journal entry', time: 'Yesterday' },
  { id: 4, type: 'goal', message: 'Reached milestone in "Learn Rust"', time: '2 days ago' },
];

export const weeklyData = [
  { name: 'Mon', tasks: 6, focus: 4 },
  { name: 'Tue', tasks: 8, focus: 6 },
  { name: 'Wed', tasks: 5, focus: 5 },
  { name: 'Thu', tasks: 12, focus: 8 },
  { name: 'Fri', tasks: 9, focus: 7 },
  { name: 'Sat', tasks: 4, focus: 3 },
  { name: 'Sun', tasks: 2, focus: 2 },
];

export const monthlyData = [
  { week: 'Week 1', completed: 35 },
  { week: 'Week 2', completed: 42 },
  { week: 'Week 3', completed: 38 },
  { week: 'Week 4', completed: 50 },
];

export const goalsProgress = [
  { id: 1, title: 'Ship LifeOS MVP', current: 75, total: 100 },
  { id: 2, title: 'Read 12 Books', current: 5, total: 12 },
  { id: 3, title: 'Run 100km', current: 42, total: 100 },
];

// Generate fake heatmap data (last 90 days)
export const generateHeatmapData = () => {
  const data = [];
  for (let i = 0; i < 90; i++) {
    // Random intensity 0-4
    const intensity = Math.floor(Math.random() * 10) > 2 ? Math.floor(Math.random() * 4) + 1 : 0;
    data.push({ date: new Date(Date.now() - (89 - i) * 86400000).toISOString(), intensity });
  }
  return data;
};
