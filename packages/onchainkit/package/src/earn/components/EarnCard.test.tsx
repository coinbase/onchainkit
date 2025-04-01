import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EarnCard } from './EarnCard';

describe('EarnCard Component', () => {
  it('renders children correctly', () => {
    render(
      <EarnCard>
        <p>Test Child</p>
      </EarnCard>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(
      <EarnCard className={customClass}>
        <div>earn</div>
      </EarnCard>,
    );

    const cardElement = screen.getByTestId('ockEarnCard');
    expect(cardElement).toHaveClass(customClass);
  });
});
