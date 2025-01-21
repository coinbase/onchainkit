import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FundCardCurrencyLabel } from './FundCardCurrencyLabel';

describe('FundCardCurrencyLabel', () => {
  it('renders the currency sign', () => {
    render(<FundCardCurrencyLabel label="$" />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('applies the correct classes', () => {
    render(<FundCardCurrencyLabel label="$" />);
    const spanElement = screen.getByText('$');
    expect(spanElement).toHaveClass(
      'flex items-center justify-center bg-transparent text-6xl leading-none outline-none',
    );
  });
});
