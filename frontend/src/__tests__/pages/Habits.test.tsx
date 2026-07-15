import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import Habits from '../../pages/Habits';
import { renderWithProviders } from '../utils';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '../../api/config';

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

describe('Habits Page', () => {
  it('renders habits and UI elements', async () => {
    renderWithProviders(<Habits />);
    
    expect(screen.getByText('Habits')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Test Habit')).toBeInTheDocument();
    });
    
    expect(screen.getByPlaceholderText('Search habits...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new habit/i })).toBeInTheDocument();
  });

  it('handles empty state', async () => {
    server.use(
      http.get(`${API_CONFIG.baseURL}/habits/habits/`, () => {
        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: []
        });
      })
    );

    renderWithProviders(<Habits />);
    
    await waitFor(() => {
      expect(screen.getByText('No habits found')).toBeInTheDocument();
    });
  });

  it('updates search filter', async () => {
    let searchParamHit = false;
    server.use(
      http.get(`${API_CONFIG.baseURL}/habits/habits/`, ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get('search') === 'run') {
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

    renderWithProviders(<Habits />);
    
    const searchInput = screen.getByPlaceholderText('Search habits...');
    fireEvent.change(searchInput, { target: { value: 'run' } });
    
    await waitFor(() => {
      expect(searchParamHit).toBe(true);
    });
  });

  it('opens new habit modal', async () => {
    renderWithProviders(<Habits />);
    
    const newHabitBtn = screen.getByRole('button', { name: /new habit/i });
    fireEvent.click(newHabitBtn);
    
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });
});
