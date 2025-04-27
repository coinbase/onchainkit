import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AmountInputTypeSwitch } from './AmountInputTypeSwitch';

describe('AmountInputTypeSwitch', () => {
  const defaultProps = {
    selectedInputType: 'fiat' as const,
    setSelectedInputType: vi.fn(),
    asset: 'ETH',
    fiatAmount: '100',
    cryptoAmount: '0.5',
    exchangeRate: 2000,
    exchangeRateLoading: false,
    currency: 'USD',
  };

  it('renders fiat to crypto conversion', () => {
    render(<AmountInputTypeSwitch {...defaultProps} />);
    expect(screen.getByTestId('ockAmountLine')).toHaveTextContent('0.5 ETH');
  });

  it('renders crypto to fiat conversion', () => {
    render(
      <AmountInputTypeSwitch {...defaultProps} selectedInputType="crypto" />,
    );
    expect(screen.getByTestId('ockAmountLine')).toHaveTextContent('$100');
  });

  it('toggles input type when clicked', () => {
    render(<AmountInputTypeSwitch {...defaultProps} />);

    fireEvent.click(screen.getByTestId('ockAmountTypeSwitch'));
    expect(defaultProps.setSelectedInputType).toHaveBeenCalledWith('crypto');
  });

  it('renders loading skeleton when exchange rate is loading', () => {
    render(
      <AmountInputTypeSwitch {...defaultProps} exchangeRateLoading={true} />,
    );
    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });

  it('renders loading skeleton when exchange rate is zero', () => {
    render(<AmountInputTypeSwitch {...defaultProps} exchangeRate={0} />);
    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <AmountInputTypeSwitch {...defaultProps} className="custom-class" />,
    );
    const container = screen.getByTestId('ockAmountTypeSwitch').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('truncates crypto amount to 8 decimal places', () => {
    render(
      <AmountInputTypeSwitch {...defaultProps} cryptoAmount="0.123456789123" />,
    );
    expect(screen.getByTestId('ockAmountLine')).toHaveTextContent(
      '0.12345678 ETH',
    );
  });

  it('handles empty amounts', () => {
    render(
      <AmountInputTypeSwitch {...defaultProps} fiatAmount="" cryptoAmount="" />,
    );
    expect(screen.getByTestId('ockAmountLine')).toHaveTextContent('0 ETH');
  });

  it('formats fiat amount with currency symbol', () => {
    render(
      <AmountInputTypeSwitch
        {...defaultProps}
        selectedInputType="crypto"
        fiatAmount="1234.56"
      />,
    );
    expect(screen.getByTestId('ockAmountLine')).toHaveTextContent('$1,234.56');
  });

  it('toggles from crypto to fiat when clicked', () => {
    render(
      <AmountInputTypeSwitch {...defaultProps} selectedInputType="crypto" />,
    );

    fireEvent.click(screen.getByTestId('ockAmountTypeSwitch'));
    expect(defaultProps.setSelectedInputType).toHaveBeenCalledWith('fiat');
  });

  it('has correct aria-label for accessibility', () => {
    render(<AmountInputTypeSwitch {...defaultProps} />);
    const button = screen.getByTestId('ockAmountTypeSwitch');
    expect(button).toHaveAttribute('aria-label', 'amount type switch');
  });
});
