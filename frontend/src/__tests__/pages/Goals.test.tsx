import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import Goals from '../../pages/Goals';
import { renderWithProviders } from '../utils';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '../../api/config';

// Mock window.matchMedia since components like Toaster might need it
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('Goals Page', () => {
  it('renders goals and elements', async () => {
    renderWithProviders(<Goals />);
    
    // Check header
    expect(screen.getByText('Goals')).toBeInTheDocument();
    
    // Wait for mock data
    await waitFor(() => {
      expect(screen.getByText('Test Goal')).toBeInTheDocument();
    });
    
    // Check that search input is present
    expect(screen.getByPlaceholderText('Search goals...')).toBeInTheDocument();
    
    // Check that new goal button is present
    expect(screen.getByRole('button', { name: /new goal/i })).toBeInTheDocument();
  });

  it('handles empty state', async () => {
    server.use(
      http.get(`${API_CONFIG.baseURL}/goals/goals/`, () => {
        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: []
        });
      })
    );

    renderWithProviders(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('No goals found')).toBeInTheDocument();
    });
  });

  it('updates filters and triggers refetch (via search params)', async () => {
    let searchParamHit = false;
    server.use(
      http.get(`${API_CONFIG.baseURL}/goals/goals/`, ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get('search') === 'test search') {
          searchParamHit = true;
        }
        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: []
        });
      })
    );

    renderWithProviders(<Goals />);
    
    const searchInput = screen.getByPlaceholderText('Search goals...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    await waitFor(() => {
      expect(searchParamHit).toBe(true);
    });
  });

  it('opens new goal modal when "New Goal" is clicked', async () => {
    renderWithProviders(<Goals />);
    
    const newGoalBtn = screen.getByRole('button', { name: /new goal/i });
    fireEvent.click(newGoalBtn);
    
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });
});
