import { fireEvent, render, screen } from '@testing-library/react';
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
      />,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Apple Pay')).toBeInTheDocument();
    expect(screen.getByText('Fast and secure payments.')).toBeInTheDocument();
    expect(screen.getByTestId('appleSvg')).toBeInTheDocument();
  });

  it('handles icon rendering based on the icon prop', () => {
    render(
      <BuyOnrampItem
        name="Credit Card"
        description="Use your card to pay."
        onClick={mockOnClick}
        icon="creditCard"
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
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('flex items-center gap-2 rounded-lg p-2');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should show overlay on mouse enter', () => {
    const { getByTestId, getByText, queryByText } = render(
      <BuyOnrampItem
        name="Apple Pay"
        description="Fast and secure payments."
        onClick={mockOnClick}
        icon="applePay"
      />,
    );

    fireEvent.mouseEnter(getByTestId('ockBuyApplePayInfo'));

    expect(getByText('Only on mobile and Safari')).toBeInTheDocument();

    fireEvent.mouseLeave(getByTestId('ockBuyApplePayInfo'));

    expect(queryByText('Only on mobile and Safari')).toBeNull();
  });
});
