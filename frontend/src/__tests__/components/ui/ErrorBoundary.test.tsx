import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';

// Prevent console.error from cluttering the test output
const originalError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});
afterAll(() => {
  console.error = originalError;
});

const ThrowError = () => {
  throw new Error('Test Error');
};

describe('ErrorBoundary', () => {
  it('renders children if no error', () => {
    render(
      <ErrorBoundary>
        <div>All good!</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('All good!')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Test Error/i)).toBeInTheDocument();
  });

  it('reloads page on refresh button click', () => {
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    window.location = { reload: vi.fn() } as any;

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Refresh Application'));
    expect(window.location.reload).toHaveBeenCalled();

    window.location = originalLocation;
  });
});
