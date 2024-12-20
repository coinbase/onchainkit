import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { PaymentMethodReact } from '../types';
import { FundCardPaymentMethodSelectRow } from './FundCardPaymentMethodSelectRow';
import { FundCardProvider } from './FundCardProvider';

const paymentMethods = [
  {
    icon: 'sampleIcon',
    id: 'ACH_BANK_ACCOUNT',
    name: 'Bank account',
    description: 'Up to $500',
  },
  {
    icon: 'anotherIcon',
    id: 'APPLE_PAY',
    name: 'Apple Pay',
    description: 'Up to $500',
  },
] as PaymentMethodReact[];

describe('FundCardPaymentMethodSelectRow', () => {
  it('renders payment method name and description', () => {
    render(
      <FundCardProvider asset="BTC">
        <FundCardPaymentMethodSelectRow
          paymentMethod={paymentMethods[0]}
          onClick={vi.fn()}
        />
      </FundCardProvider>,
    );
    expect(screen.getByText('Bank account')).toBeInTheDocument();
    expect(screen.getByText('Up to $500')).toBeInTheDocument();
  });

  it('calls onClick with payment method when clicked', () => {
    const handleClick = vi.fn();
    render(
      <FundCardProvider asset="BTC">
        <FundCardPaymentMethodSelectRow
          paymentMethod={paymentMethods[1]}
          onClick={handleClick}
        />
      </FundCardProvider>,
    );
    const button = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__button',
    );
    act(() => {
      button.click();
    });
    expect(handleClick).toHaveBeenCalledWith(paymentMethods[1]);
  });
});
