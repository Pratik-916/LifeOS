import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/api/v1/analytics/dashboard/', () => {
    return HttpResponse.json({
      productivity_score: 85,
      weekly_productivity: 80,
      completion_percentage: 90,
      todays_tasks: 5,
      todays_habits: 3,
      current_goals: 2,
      journal_entries_this_week: 4,
      journey_events_this_month: 1,
      upcoming_deadlines: [],
    });
  }),

  http.get('*/api/v1/users/me/', () => {
    return HttpResponse.json({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
    });
  }),

  http.get('*/api/v1/tasks/', () => {
    return HttpResponse.json({
      results: [
        { id: '1', title: 'Task 1', status: 'pending' },
        { id: '2', title: 'Task 2', status: 'completed' },
      ],
      count: 2,
    });
  }),

  http.get('*/api/v1/tasks/stats/', () => {
    return HttpResponse.json({
      total: 10,
      completed: 5,
      pending: 5,
    });
  }),
];
