import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureErrorBoundary } from '../../../components/ui/FeatureErrorBoundary/FeatureErrorBoundary';

// Prevent console.error from cluttering the test output
const originalError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});
afterAll(() => {
  console.error = originalError;
});

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Feature Error');
  }
  return <div>Feature Data</div>;
};

describe('FeatureErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <FeatureErrorBoundary featureName="TestFeature">
        <ThrowError shouldThrow={false} />
      </FeatureErrorBoundary>
    );
    expect(screen.getByText('Feature Data')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    render(
      <FeatureErrorBoundary featureName="TestFeature">
        <ThrowError shouldThrow={true} />
      </FeatureErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/The TestFeature feature encountered an unexpected error/i)).toBeInTheDocument();
  });

  it('re-renders children when Try Again is clicked', () => {
    const { rerender } = render(
      <FeatureErrorBoundary featureName="TestFeature">
        <ThrowError shouldThrow={true} />
      </FeatureErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Rerender with shouldThrow false before clicking retry so it actually mounts successfully
    rerender(
      <FeatureErrorBoundary featureName="TestFeature">
        <ThrowError shouldThrow={false} />
      </FeatureErrorBoundary>
    );

    fireEvent.click(screen.getByText('Try Again'));

    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    expect(screen.getByText('Feature Data')).toBeInTheDocument();
  });
});
