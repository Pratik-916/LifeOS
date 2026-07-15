/**
 * Shared mock data for all tests.
 * Used by individual tests via jest.mock('../../api/client') or similar.
 */

export const mockDashboardData = {
  productivity_score: 85,
  weekly_productivity: 80,
  completion_percentage: 90,
  todays_tasks: 5,
  todays_habits: 3,
  current_goals: 2,
  journal_entries_this_week: 4,
  journey_events_this_month: 1,
  upcoming_deadlines: [],
};

export const mockUserData = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
};

export const mockTasksData = {
  results: [
    { id: '1', title: 'Task 1', status: 'pending', priority: 'medium', is_completed: false },
    { id: '2', title: 'Task 2', status: 'completed', priority: 'high', is_completed: true },
  ],
  count: 2,
  next: null,
  previous: null,
};

export const mockHabitsData = {
  results: [
    { id: '1', name: 'Exercise', frequency: 'daily', streak: 5, target_count: 1 },
    { id: '2', name: 'Read', frequency: 'daily', streak: 3, target_count: 1 },
  ],
  count: 2,
  next: null,
  previous: null,
};

export const mockGoalsData = {
  results: [
    { id: '1', title: 'Learn TypeScript', status: 'in_progress', priority: 'high', progress: 60 },
  ],
  count: 1,
  next: null,
  previous: null,
};
