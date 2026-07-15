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
];
