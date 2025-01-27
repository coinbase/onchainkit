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

  it('has default styles applied', () => {
    render(
      <EarnCard>
        <div>earn</div>
      </EarnCard>,
    );

    const cardElement = screen.getByTestId('ockEarnCard');
    expect(cardElement).toHaveClass('border-t');
    expect(cardElement).toHaveClass('flex');
    expect(cardElement).toHaveClass('flex-col');
    expect(cardElement).toHaveClass('p-4');
    expect(cardElement).toHaveClass('gap-4');
  });
});
