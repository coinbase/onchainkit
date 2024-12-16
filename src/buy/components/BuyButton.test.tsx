import { render, screen, fireEvent } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { BuyButton } from './BuyButton';
import { useBuyContext } from './BuyProvider';
import { Spinner } from '../../internal/components/Spinner';
import { checkmarkSvg } from '../../internal/svg/checkmarkSvg';

vi.mock('./BuyProvider', () => ({
  useBuyContext: vi.fn(),
}));

vi.mock('../../internal/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

vi.mock('../../internal/svg/checkmarkSvg', () => ({
  checkmarkSvg: <svg data-testid="checkmarkSvg" />,
}));

describe('BuyButton', () => {
  const mockSetIsDropdownOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useBuyContext as Mock).mockReturnValue({
      setIsDropdownOpen: mockSetIsDropdownOpen,
      from: { loading: false },
      fromETH: { loading: false },
      fromUSDC: { loading: false },
      to: { loading: false, amount: 10, token: 'ETH' },
      lifecycleStatus: { statusName: 'idle' },
    });
  });

  it('renders the button with default content', () => {
    render(<BuyButton />);

    const button = screen.getByTestId('ockBuyButton_Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Buy');
    expect(button).not.toBeDisabled();
  });

  it('shows a spinner when loading', () => {
    (useBuyContext as Mock).mockReturnValue({
      setIsDropdownOpen: mockSetIsDropdownOpen,
      from: { loading: true },
      fromETH: { loading: false },
      fromUSDC: { loading: false },
      to: { loading: false, amount: 10, token: 'ETH' },
      lifecycleStatus: { statusName: 'idle' },
    });

    render(<BuyButton />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays a checkmark when statusName is success', () => {
    (useBuyContext as Mock).mockReturnValue({
      setIsDropdownOpen: mockSetIsDropdownOpen,
      from: { loading: false },
      fromETH: { loading: false },
      fromUSDC: { loading: false },
      to: { loading: false, amount: 10, token: 'ETH' },
      lifecycleStatus: { statusName: 'success' },
    });

    render(<BuyButton />);

    expect(screen.getByTestId('checkmarkSvg')).toBeInTheDocument();
  });

  it('disables the button when required fields are missing', () => {
    (useBuyContext as Mock).mockReturnValue({
      setIsDropdownOpen: mockSetIsDropdownOpen,
      from: { loading: false },
      fromETH: { loading: false },
      fromUSDC: { loading: false },
      to: { loading: false, amount: null, token: null },
      lifecycleStatus: { statusName: 'idle' },
    });

    render(<BuyButton />);

    const button = screen.getByTestId('ockBuyButton_Button');
    expect(button).toBeDisabled();
  });

  it('calls setIsDropdownOpen when clicked', () => {
    render(<BuyButton />);

    const button = screen.getByTestId('ockBuyButton_Button');
    fireEvent.click(button);

    expect(mockSetIsDropdownOpen).toHaveBeenCalledWith(true);
  });
});
