import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurrencyLabel } from './CurrencyLabel';

describe('CurrencyLabel', () => {
  it('renders the currency sign', () => {
    render(<CurrencyLabel label="$" />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('applies the correct classes', () => {
    render(<CurrencyLabel label="$" />);
    const spanElement = screen.getByText('$');
    expect(spanElement).toHaveClass(
      'flex items-center justify-center bg-transparent text-6xl leading-none outline-none',
    );
  });
});
