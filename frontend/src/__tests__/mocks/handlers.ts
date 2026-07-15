import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '../../api/config';

const baseURL = API_CONFIG.baseURL;

export const handlers = [
  http.delete(`${baseURL}/goals/goals/:id/`, ({ params }) => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
  http.get(`${baseURL}/goals/goals/`, () => {
    return HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: '1',
          title: 'Test Goal',
          description: 'Test description',
          status: 'not_started',
          priority: 'medium',
          category: 'health',
          is_favorite: false,
          is_archived: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          target_date: null,
          progress: 0,
        }
      ]
    });
  }),
  http.post(`${baseURL}/auth/login/`, () => {
    return HttpResponse.json({
      access: 'fake-access-token',
      refresh: 'fake-refresh-token',
      user: {
        id: '1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      }
    });
  }),
  http.get(`${baseURL}/habits/habits/`, () => {
    return HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 'h1',
          title: 'Test Habit',
          description: 'A habit to test',
          frequency: 'daily',
          category: 'Health',
          status: 'active',
          current_streak: 5,
          completion_rate: 80,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    });
  }),
  http.get(`${baseURL}/journal/entries/`, () => {
    return HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 'j1',
          title: 'Test Entry',
          content: 'This is a test entry',
          mood: 'happy',
          is_favorite: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    });
  }),
  http.get(`${baseURL}/journey/timeline/`, () => {
    return HttpResponse.json({
      results: [
        {
          year: '2026',
          months: [
            {
              month: '7',
              events: [
                {
                  id: 'jrn1',
                  entity_id: 'jrn1',
                  entity_type: 'memory',
                  title: 'A memory',
                  description: 'A memory description',
                  timestamp: new Date().toISOString(),
                  type: 'memory',
                  icon: 'star',
                  color: '#000000',
                  tags: []
                }
              ]
            }
          ]
        }
      ]
    });
  }),
  http.get(`${baseURL}/journey/statistics/`, () => {
    return HttpResponse.json({
      total_events: 1,
      events_by_type: { memory: 1 },
      events_this_year: 1,
      streak_days: 1
    });
  }),
  http.get(`${baseURL}/goals/goals/stats/`, () => {
    return HttpResponse.json({
      total: 10,
      completed: 5,
      in_progress: 3,
      not_started: 2
    });
  }),
  http.get(`${baseURL}/habits/habits/stats/`, () => {
    return HttpResponse.json({
      total: 5,
      active: 4,
      completed_today: 2,
      longest_streak: 10
    });
  }),
  http.get(`${baseURL}/journey/memories/timeline/`, () => {
    return HttpResponse.json({
      results: [
        {
          year: '2026',
          months: [
            {
              month: '7',
              events: [
                {
                  id: 'm1',
                  entity_id: 'm1',
                  entity_type: 'memory',
                  title: 'A memory',
                  description: 'A memory description',
                  timestamp: new Date().toISOString(),
                  type: 'memory',
                  icon: 'star',
                  color: '#000000',
                  tags: []
                }
              ]
            }
          ]
        }
      ]
    });
  }),
  http.get(`${baseURL}/journey/memories/stats/`, () => {
    return HttpResponse.json({
      total_events: 1,
      events_by_type: { memory: 1 },
      events_this_year: 1,
      streak_days: 1
    });
  }),
];
