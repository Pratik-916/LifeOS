import { Activity, Code, BookOpen, PenTool, Dumbbell, Moon, CheckCircle2, Flame } from 'lucide-react';

export const analyticsStats = [
  { id: 1, title: 'Avg. Productivity', value: '87%', icon: Activity, color: 'text-accent' },
  { id: 2, title: 'Tasks Finished', value: '1,204', icon: CheckCircle2, color: 'text-success' },
  { id: 3, title: 'Current Habit Streak', value: '42 Days', icon: Flame, color: 'text-orange-500' },
  { id: 4, title: 'Total Coding Time', value: '840 hrs', icon: Code, color: 'text-purple-500' },
  { id: 5, title: 'Study Hours', value: '215 hrs', icon: BookOpen, color: 'text-blue-400' },
  { id: 6, title: 'Journal Entries', value: '184', icon: PenTool, color: 'text-pink-500' },
  { id: 7, title: 'Workouts', value: '96', icon: Dumbbell, color: 'text-red-500' },
  { id: 8, title: 'Avg. Sleep', value: '7.2 hrs', icon: Moon, color: 'text-indigo-400' },
];

export const monthlyProductivity = [
  { name: 'Jan', productivity: 75, focus: 60 },
  { name: 'Feb', productivity: 82, focus: 65 },
  { name: 'Mar', productivity: 80, focus: 68 },
  { name: 'Apr', productivity: 88, focus: 75 },
  { name: 'May', productivity: 92, focus: 85 },
  { name: 'Jun', productivity: 85, focus: 70 },
  { name: 'Jul', productivity: 95, focus: 90 },
];

export const weeklyTasks = [
  { name: 'Mon', completed: 12, pending: 2 },
  { name: 'Tue', completed: 15, pending: 1 },
  { name: 'Wed', completed: 8, pending: 5 },
  { name: 'Thu', completed: 18, pending: 0 },
  { name: 'Fri', completed: 14, pending: 3 },
  { name: 'Sat', completed: 5, pending: 8 },
  { name: 'Sun', completed: 4, pending: 4 },
];

export const codingVsStudy = [
  { name: 'Week 1', coding: 25, study: 10 },
  { name: 'Week 2', coding: 30, study: 12 },
  { name: 'Week 3', coding: 28, study: 15 },
  { name: 'Week 4', coding: 35, study: 20 },
];

export const wellnessData = [
  { name: 'Mon', sleep: 7.5, workout: 1, reading: 0.5 },
  { name: 'Tue', sleep: 6.8, workout: 0, reading: 1 },
  { name: 'Wed', sleep: 7.2, workout: 1.5, reading: 0.5 },
  { name: 'Thu', sleep: 8.0, workout: 0, reading: 1.5 },
  { name: 'Fri', sleep: 7.0, workout: 1, reading: 1 },
  { name: 'Sat', sleep: 9.0, workout: 2, reading: 2 },
  { name: 'Sun', sleep: 8.5, workout: 0, reading: 2.5 },
];

// Generate fake heatmap data for GitHub contribution graph (last 180 days)
export const generateLongHeatmapData = () => {
  const data = [];
  for (let i = 0; i < 180; i++) {
    const intensity = Math.floor(Math.random() * 10) > 3 ? Math.floor(Math.random() * 4) + 1 : 0;
    data.push({ date: new Date(Date.now() - (179 - i) * 86400000).toISOString(), intensity });
  }
  return data;
};
