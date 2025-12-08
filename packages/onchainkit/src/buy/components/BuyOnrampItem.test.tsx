import type { SwapUnit } from '@/swap/types';
import type { Token } from '@/token';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { BuyOnrampItem } from './BuyOnrampItem';
import { useBuyContext } from './BuyProvider';

vi.mock('./BuyProvider', () => ({
  useBuyContext: vi.fn(),
}));

vi.mock('../../internal/svg', () => ({
  appleSvg: <svg data-testid="appleSvg" />,
  cardSvg: <svg data-testid="cardSvg" />,
  coinbaseLogoSvg: <svg data-testid="coinbaseLogoSvg" />,
}));

const mockTo = {
  amountUSD: '5',
  amount: '5',
  token: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
};

describe('BuyOnrampItem', () => {
  const mockSetIsDropdownOpen = vi.fn();
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useBuyContext as Mock).mockReturnValue({
      setIsDropdownOpen: mockSetIsDropdownOpen,
    });
  });

  it('renders correctly with provided props', () => {
    render(
      <BuyOnrampItem
        name="Apple Pay"
        description="Fast and secure payments."
        onClick={mockOnClick}
        icon="applePay"
        to={mockTo as SwapUnit}
      />,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('ock-applePayOnrampItem')).toBeInTheDocument();
    expect(screen.getByText('Fast and secure payments.')).toBeInTheDocument();
    expect(screen.getByTestId('ock-applePaySvg')).toBeInTheDocument();
  });

  it('handles icon rendering based on the icon prop', () => {
    render(
      <BuyOnrampItem
        name="Credit Card"
        description="Use your card to pay."
        onClick={mockOnClick}
        icon="creditCard"
        to={mockTo as SwapUnit}
      />,
    );

    expect(screen.getByTestId('cardSvg')).toBeInTheDocument();
  });

  it('triggers onClick and closes dropdown on button click', () => {
    render(
      <BuyOnrampItem
        name="Coinbase Pay"
        description="Pay using your Coinbase account."
        onClick={mockOnClick}
        icon="coinbasePay"
        to={mockTo as SwapUnit}
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetIsDropdownOpen).toHaveBeenCalledWith(false);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct styling and attributes to the button', () => {
    render(
      <BuyOnrampItem
        name="Apple Pay"
        description="Fast and secure payments."
        onClick={mockOnClick}
        icon="applePay"
        to={mockTo as SwapUnit}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('flex items-center gap-2 rounded-lg p-2');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should disables and shows message if amount is less than 5', () => {
    const { getByText, queryByText } = render(
      <BuyOnrampItem
        name="Apple Pay"
        description="Fast and secure payments."
        onClick={mockOnClick}
        icon="applePay"
        to={
          {
            amount: '5',
            amountUSD: '4',
            token: { address: 'DEGEN' as Address } as Token,
          } as SwapUnit
        }
      />,
    );

    expect(getByText('Minimum purchase amount is $5')).toBeInTheDocument();

    expect(queryByText('Only on mobile and Safari')).toBeNull();
  });
});
