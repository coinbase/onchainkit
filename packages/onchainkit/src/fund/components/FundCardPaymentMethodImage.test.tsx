import '@testing-library/jest-dom';
import { useIcon } from '@/internal/hooks/useIcon';
import { render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { FundCardPaymentMethodImage } from './FundCardPaymentMethodImage';

vi.mock('@/internal/hooks/useIcon', () => ({
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
      screen.queryByTestId('ockFundCardPaymentMethodImage__iconContainer'),
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
      screen.getByTestId('ockFundCardPaymentMethodImage__iconContainer'),
    ).toBeInTheDocument();
  });

  it('renders with custom className and size', () => {
    (useIcon as Mock).mockReturnValue(() => <svg data-testid="icon-svg" />);
    render(
      <FundCardPaymentMethodImage
        className="custom-class"
        size={48}
        paymentMethod={{
          icon: 'customIcon',
          id: 'ACH_BANK_ACCOUNT',
          name: 'Custom Account',
          description: 'Custom description',
        }}
      />,
    );
    const container = screen.getByTestId(
      'ockFundCardPaymentMethodImage__iconContainer',
    );
    expect(container).toHaveClass('custom-class');
  });

  it('does not apply primary color for non-coinbasePay icons', () => {
    (useIcon as Mock).mockReturnValue(() => <svg data-testid="icon-svg" />);
    render(
      <FundCardPaymentMethodImage
        paymentMethod={{
          icon: 'otherIcon',
          id: 'ACH_BANK_ACCOUNT',
          name: 'Other Account',
          description: 'Other description',
        }}
      />,
    );
    const container = screen.getByTestId(
      'ockFundCardPaymentMethodImage__iconContainer',
    );
    expect(container).not.toHaveClass('primary');
  });
});
