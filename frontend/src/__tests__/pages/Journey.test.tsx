import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import Journey from '../../pages/Journey';
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

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  const React = await import('react');
  return {
    ...actual as any,
    AnimatePresence: ({ children }: any) => children,
    motion: new Proxy({}, {
      get: (_, tag: string) => React.forwardRef((props: any, ref: any) => {
        const { animate, initial, exit, transition, whileHover, whileTap, layout, layoutId, ...rest } = props;
        return React.createElement(tag, { ...rest, ref });
      })
    })
  };
});

describe('Journey Page', () => {
  it('renders journey timeline', async () => {
    renderWithProviders(<Journey />);
    
    expect(screen.getByRole('heading', { name: 'The Journey' })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('7')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('7'));
    
    await waitFor(() => {
      expect(screen.getByText('A memory')).toBeInTheDocument();
    });
    
    expect(screen.getByPlaceholderText('Search your journey...')).toBeInTheDocument();
  });

  it('can switch to map view', async () => {
    renderWithProviders(<Journey />);
    
    const mapBtn = screen.getByRole('button', { name: /map/i });
    fireEvent.click(mapBtn);
    
    await waitFor(() => {
      expect(screen.getByText('Map View Coming Soon')).toBeInTheDocument();
    });
  });

  it('can open add memory modal', async () => {
    renderWithProviders(<Journey />);
    
    const addMemoryBtn = screen.getByRole('button', { name: /add memory/i });
    fireEvent.click(addMemoryBtn);
    
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });
});
