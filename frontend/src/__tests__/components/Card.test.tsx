import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from '../../components/Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div data-testid="child">Card Content</div>
      </Card>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        Content
      </Card>
    );
    const card = screen.getByText('Content').closest('div');
    expect(card?.className).toContain('custom-class');
    expect(card?.className).toContain('glass-card');
  });
});
