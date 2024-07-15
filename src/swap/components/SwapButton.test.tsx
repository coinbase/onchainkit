import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { SwapButton } from './SwapButton';
import { useSwapContext } from './SwapProvider';

vi.mock('./SwapProvider', () => ({
  useSwapContext: vi.fn(),
}));

vi.mock('../../internal/loading/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

const useSwapContextMock = useSwapContext as Mock;

describe('SwapButton', () => {
  const mockHandleSubmit = vi.fn();

  beforeEach(() => {
    mockHandleSubmit.mockClear();
  });

  it('renders button with text "Swap" when not loading', () => {
    useSwapContextMock.mockReturnValue({
      to: { loading: false, amount: 1, token: 'ETH' },
      from: { loading: false, amount: 1, token: 'BTC' },
      loading: false,
      handleSubmit: mockHandleSubmit,
    });

    render(<SwapButton />);

    const button = screen.getByTestId('ockSwapButton_Button');
    expect(button).toHaveTextContent('Swap');
    expect(button).not.toBeDisabled();
  });

  it('renders Spinner when loading', () => {
    useSwapContextMock.mockReturnValue({
      to: { loading: true, amount: 1, token: 'ETH' },
      from: { loading: false, amount: 1, token: 'BTC' },
      loading: false,
      handleSubmit: mockHandleSubmit,
    });

    render(<SwapButton />);

    const button = screen.getByTestId('ockSwapButton_Button');
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('button is disabled when required fields are missing', () => {
    useSwapContextMock.mockReturnValue({
      to: { loading: false, amount: 1, token: 'ETH' },
      from: { loading: false, amount: null, token: 'BTC' },
      loading: false,
      handleSubmit: mockHandleSubmit,
    });

    render(<SwapButton />);

    const button = screen.getByTestId('ockSwapButton_Button');
    expect(button).toBeDisabled();
  });

  it('calls handleSubmit with mockHandleSubmit when clicked', () => {
    useSwapContextMock.mockReturnValue({
      to: { loading: false, amount: 1, token: 'ETH' },
      from: { loading: false, amount: 1, token: 'BTC' },
      loading: false,
      handleSubmit: mockHandleSubmit,
    });

    render(<SwapButton />);

    const button = screen.getByTestId('ockSwapButton_Button');
    fireEvent.click(button);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('applies additional className correctly', () => {
    useSwapContextMock.mockReturnValue({
      to: { loading: false, amount: 1, token: 'ETH' },
      from: { loading: false, amount: 1, token: 'BTC' },
      loading: false,
      handleSubmit: mockHandleSubmit,
    });

    const customClass = 'custom-class';
    render(<SwapButton className={customClass} />);

    const button = screen.getByTestId('ockSwapButton_Button');
    expect(button).toHaveClass(customClass);
  });
});
