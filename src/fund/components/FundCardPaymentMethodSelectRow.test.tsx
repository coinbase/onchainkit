import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PaymentMethod } from '../types';
import { FundCardPaymentMethodSelectRow } from './FundCardPaymentMethodSelectRow';

describe('FundCardPaymentMethodSelectRow', () => {
  const mockPaymentMethod: PaymentMethod = {
    id: 'APPLE_PAY',
    name: 'Apple Pay',
    description: 'Up to $500/week',
    icon: 'apple',
  };

  it('renders disabled state correctly', () => {
    const onClick = vi.fn();
    render(
      <FundCardPaymentMethodSelectRow
        paymentMethod={mockPaymentMethod}
        testId="ockFundCardPaymentMethodSelectRow"
        onClick={onClick}
        disabled={true}
        disabledReason="Minimum amount required"
      />,
    );

    const button = screen.getByTestId('ockFundCardPaymentMethodSelectRow');

    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-[0.38] pointer-events-none');
    expect(button).toHaveAttribute('title', 'Minimum amount required');
    expect(screen.getByText('Minimum amount required')).toBeInTheDocument();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <FundCardPaymentMethodSelectRow
        paymentMethod={mockPaymentMethod}
        onClick={onClick}
        disabled={true}
        testId="ockFundCardPaymentMethodSelectRow"
      />,
    );

    fireEvent.click(screen.getByTestId('ockFundCardPaymentMethodSelectRow'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows original description when not disabled', () => {
    render(
      <FundCardPaymentMethodSelectRow
        paymentMethod={mockPaymentMethod}
        onClick={vi.fn()}
        testId="ockFundCardPaymentMethodSelectRow"
      />,
    );

    expect(screen.getByText('Up to $500/week')).toBeInTheDocument();
  });
});
