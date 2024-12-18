import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FundCardCurrencyLabel } from './FundCardCurrencyLabel';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('FundCardCurrencyLabel', () => {
  it('renders the currency sign', () => {
    render(<FundCardCurrencyLabel currencySign="$" />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('applies the correct classes', () => {
    render(<FundCardCurrencyLabel currencySign="$" />);
    const spanElement = screen.getByText('$');
    expect(spanElement).toHaveClass(
      'flex items-center justify-center bg-transparent text-[60px] leading-none outline-none',
    );
  });
});
