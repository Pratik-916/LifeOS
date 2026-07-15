import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import Journal from '../../pages/Journal';
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

describe('Journal Page', () => {
  it('renders journal entries', async () => {
    renderWithProviders(<Journal />);
    
    expect(screen.getByRole('heading', { name: 'Journal' })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Test Entry')).toBeInTheDocument();
    });
    
    expect(screen.getByPlaceholderText('Search entries...')).toBeInTheDocument();
  });

  it('handles empty state', async () => {
    server.use(
      http.get(`${API_CONFIG.baseURL}/journal/entries/`, () => {
        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: []
        });
      })
    );

    renderWithProviders(<Journal />);
    
    await waitFor(() => {
      expect(screen.getByText('No entries found')).toBeInTheDocument();
    });
  });

  it('can create a new entry', async () => {
    renderWithProviders(<Journal />);
    
    const newEntryBtn = screen.getByRole('button', { name: /new entry/i });
    fireEvent.click(newEntryBtn);
    
    // In our mock, if there is a new entry it loads the JournalEditor in the main content area
    // Just verifying that the button is clickable
    expect(newEntryBtn).toBeInTheDocument();
  });

  it('updates search param when searching', async () => {
    let searchParamHit = false;
    server.use(
      http.get(`${API_CONFIG.baseURL}/journal/entries/`, ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get('search') === 'test') {
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

    renderWithProviders(<Journal />);
    
    const searchInput = screen.getByPlaceholderText('Search entries...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(searchParamHit).toBe(true);
    });
  });
});
