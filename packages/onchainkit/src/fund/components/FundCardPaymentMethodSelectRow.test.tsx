import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { FundEvent } from '../../core/analytics/types';
import type { PaymentMethod } from '../types';
import { FundCardPaymentMethodSelectRow } from './FundCardPaymentMethodSelectRow';

vi.mock('../../core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(),
}));

describe('FundCardPaymentMethodSelectRow', () => {
  const mockPaymentMethod: PaymentMethod = {
    id: 'APPLE_PAY',
    name: 'Apple Pay',
    description: 'Up to $500/week',
    icon: 'apple',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAnalytics as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      sendAnalytics: vi.fn(),
    });
  });

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

  it('sends analytics event when clicked', () => {
    const onClick = vi.fn();
    const mockSendAnalytics = vi.fn();
    (useAnalytics as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });

    render(
      <FundCardPaymentMethodSelectRow
        paymentMethod={mockPaymentMethod}
        onClick={onClick}
        testId="ockFundCardPaymentMethodSelectRow"
      />,
    );

    fireEvent.click(screen.getByTestId('ockFundCardPaymentMethodSelectRow'));

    expect(mockSendAnalytics).toHaveBeenCalledWith(
      FundEvent.FundOptionSelected,
      {
        option: mockPaymentMethod.id,
      },
    );
    expect(onClick).toHaveBeenCalledWith(mockPaymentMethod);
  });

  it('does not send analytics event when disabled', () => {
    const onClick = vi.fn();
    const mockSendAnalytics = vi.fn();
    (useAnalytics as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });

    render(
      <FundCardPaymentMethodSelectRow
        paymentMethod={mockPaymentMethod}
        onClick={onClick}
        disabled={true}
        testId="ockFundCardPaymentMethodSelectRow"
      />,
    );

    fireEvent.click(screen.getByTestId('ockFundCardPaymentMethodSelectRow'));

    expect(mockSendAnalytics).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('executes onClick when not disabled', () => {
    const onClick = vi.fn();
    const mockSendAnalytics = vi.fn();
    (useAnalytics as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });

    render(
      <FundCardPaymentMethodSelectRow
        paymentMethod={mockPaymentMethod}
        onClick={onClick}
        disabled={false}
        testId="ockFundCardPaymentMethodSelectRow"
      />,
    );

    fireEvent.click(screen.getByTestId('ockFundCardPaymentMethodSelectRow'));

    expect(mockSendAnalytics).toHaveBeenCalledWith(
      FundEvent.FundOptionSelected,
      {
        option: mockPaymentMethod.id,
      },
    );
    expect(onClick).toHaveBeenCalledWith(mockPaymentMethod);
  });
});
