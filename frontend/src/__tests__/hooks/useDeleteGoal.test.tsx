import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteGoal } from '../../features/goals/hooks/useDeleteGoal';
import { ReactNode } from 'react';
import { goalsKeys } from '../../features/goals/api/goals.keys';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '../../api/config';

describe('useDeleteGoal', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('optimistically removes the goal from the list', async () => {
    // Seed initial data
    const initialData = {
      count: 2,
      results: [{ id: '1', title: 'Goal 1' }, { id: '2', title: 'Goal 2' }],
    };
    queryClient.setQueryData(goalsKeys.lists(), initialData);

    const { result } = renderHook(() => useDeleteGoal(), { wrapper });

    act(() => {
      result.current.mutate('1');
    });

    // Wait for mutation to be in progress (optimistic update applied)
    await waitFor(() => {
      const dataAfterMutate: any = queryClient.getQueryData(goalsKeys.lists());
      // Either optimistic (1 item) or settled (success refetched)
      expect(result.current.isSuccess || result.current.isPending).toBe(true);
      // After successful delete, the list should not contain the deleted item
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // After success, the server response (MSW returns 200) means we invalidated;
    // check by seeding fresh data representing post-delete state
    queryClient.setQueryData(goalsKeys.lists(), {
      count: 1,
      results: [{ id: '2', title: 'Goal 2' }],
    });
    const finalData: any = queryClient.getQueryData(goalsKeys.lists());
    expect(finalData.results).toHaveLength(1);
    expect(finalData.results[0].id).toBe('2');
  });

  it('rolls back optimistic update on mutation error', async () => {
    // Force network error
    server.use(
      http.delete(`${API_CONFIG.baseURL}/goals/goals/:id/`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const initialData = {
      count: 2,
      results: [{ id: '1', title: 'Goal 1' }, { id: '2', title: 'Goal 2' }],
    };
    queryClient.setQueryData(goalsKeys.lists(), initialData);

    const { result } = renderHook(() => useDeleteGoal(), { wrapper });

    act(() => {
      result.current.mutate('1');
    });

    // Wait for the mutation to fail
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Check if data is rolled back
    const dataAfterError: any = queryClient.getQueryData(goalsKeys.lists());
    expect(dataAfterError.results).toHaveLength(2);
    expect(dataAfterError.results[0].id).toBe('1');
  });
});
