export const plannerTasks = [
  { id: 1, title: 'Draft technical specs for new feature', completed: false, priority: 'high', category: 'Work' },
  { id: 2, title: 'Review pull requests', completed: true, priority: 'medium', category: 'Work' },
  { id: 3, title: 'Reply to support emails', completed: false, priority: 'low', category: 'Admin' },
  { id: 4, title: 'Grocery shopping', completed: false, priority: 'medium', category: 'Personal' },
  { id: 5, title: 'Read 20 pages of book', completed: true, priority: 'low', category: 'Personal' },
];

export const timeBlocks = [
  { id: 1, time: '09:00 AM', duration: '1h', title: 'Deep Work: Coding', color: 'bg-accent/20 border-accent/40 text-accent' },
  { id: 2, time: '10:00 AM', duration: '30m', title: 'Daily Standup', color: 'bg-orange-500/20 border-orange-500/40 text-orange-500' },
  { id: 3, time: '10:30 AM', duration: '1.5h', title: 'Deep Work: Coding', color: 'bg-accent/20 border-accent/40 text-accent' },
  { id: 4, time: '12:00 PM', duration: '1h', title: 'Lunch & Walk', color: 'bg-green-500/20 border-green-500/40 text-green-500' },
  { id: 5, time: '01:00 PM', duration: '2h', title: 'Meetings / PR Review', color: 'bg-purple-500/20 border-purple-500/40 text-purple-500' },
  { id: 6, time: '03:00 PM', duration: '1h', title: 'Admin & Emails', color: 'bg-surfaceHighlight border-border/20 text-primary' },
];

export interface CalendarDay {
  day: number;
  currentMonth: boolean;
  isToday?: boolean;
  hasEvents?: boolean;
}

export const calendarDays: CalendarDay[] = [
  // Generating a small grid of days just for visual dummy UI
  ...Array.from({length: 3}).map((_, i) => ({ day: 28 + i, currentMonth: false })),
  ...Array.from({length: 28}).map((_, i) => ({ day: i + 1, currentMonth: true, isToday: i + 1 === 6, hasEvents: [2, 6, 14, 21].includes(i + 1) })),
  ...Array.from({length: 4}).map((_, i) => ({ day: i + 1, currentMonth: false }))
];
