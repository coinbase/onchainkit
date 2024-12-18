import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useIcon } from '../../core-react/internal/hooks/useIcon';
import { FundCardPaymentMethodImage } from './FundCardPaymentMethodImage';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../../core-react/internal/hooks/useIcon', () => ({
  useIcon: vi.fn(),
}));

describe('FundCardPaymentMethodImage', () => {
  it('renders the icon when iconSvg is available', () => {
    (useIcon as Mock).mockReturnValue(() => <svg data-testid="icon-svg" />);
    render(
      <FundCardPaymentMethodImage
        paymentMethod={{
          icon: 'sampleIcon',
          id: 'ACH_BANK_ACCOUNT',
          name: 'Bank account',
          description: 'Up to $500',
        }}
      />,
    );
    expect(
      screen.queryByTestId('fundCardPaymentMethodImage__iconContainer'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('fundCardPaymentMethodImage__noImage'),
    ).not.toBeInTheDocument();
  });

  it('renders the placeholder when iconSvg is not available', () => {
    (useIcon as Mock).mockReturnValue(null);

    render(
      <FundCardPaymentMethodImage
        paymentMethod={{
          icon: 'unknownIcon',
          id: 'ACH_BANK_ACCOUNT',
          name: 'Bank account',
          description: 'Up to $500',
        }}
      />,
    );
    expect(
      screen.queryByTestId('fundCardPaymentMethodImage__noImage'),
    ).toBeInTheDocument();
  });

  it('applies primary color when the icon is coinbasePay', () => {
    (useIcon as Mock).mockReturnValue(() => <svg data-testid="icon-svg" />);

    render(
      <FundCardPaymentMethodImage
        paymentMethod={{
          icon: 'coinbasePay',
          id: 'CRYPTO_ACCOUNT',
          name: 'Coinbase Pay',
          description: 'Description',
        }}
      />,
    );
    expect(
      screen.getByTestId('fundCardPaymentMethodImage__iconContainer'),
    ).toBeInTheDocument();
  });
});
