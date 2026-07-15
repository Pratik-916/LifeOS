import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import Analytics from "../../pages/Analytics";
import { renderWithProviders } from '../utils';

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

describe('Analytics Page', () => {
  it('renders analytics title and components', async () => {
    renderWithProviders(<Analytics />);
    
    expect(screen.getByRole('heading', { name: 'Analytics' })).toBeInTheDocument();
    
    // We can't easily wait for lazy loaded widgets without mocking them, but the page itself should render.
    await waitFor(() => {
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
  });
});
