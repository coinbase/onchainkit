import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { type Config, type UseAccountReturnType, useAccount } from 'wagmi';
import { useSwapContext } from './SwapProvider';
import { SwapToast } from './SwapToast';

vi.mock('./SwapProvider', () => ({
  useSwapContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

describe('SwapToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // TODO: set up proper mock data
    vi.mocked(useAccount).mockReturnValue({
      chainId: 8453,
    } as unknown as UseAccountReturnType<Config>);
  });

  it('does not render when not visible', () => {
    (useSwapContext as Mock).mockReturnValue({
      isToastVisible: false,
    });

    render(<SwapToast />);
    expect(screen.queryByTestId('ockSwapToast')).not.toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    const setIsToastVisible = vi.fn();
    const setTransactionHash = vi.fn();
    (useSwapContext as Mock).mockReturnValue({
      isToastVisible: true,
      setIsToastVisible,
      setTransactionHash,
    });

    render(<SwapToast />);
    fireEvent.click(screen.getByTestId('ockCloseButton'));

    expect(setIsToastVisible).toHaveBeenCalledWith(false);
    expect(setTransactionHash).toHaveBeenCalledWith('');
  });

  it('displays transaction hash when available', () => {
    const mockTransactionHash = '0x123';
    (useSwapContext as Mock).mockReturnValue({
      isToastVisible: true,
      transactionHash: mockTransactionHash,
    });

    render(<SwapToast />);

    expect(screen.getByText('Successful')).toBeInTheDocument();
  });

  it('applies correct position class for bottom-right', () => {
    (useSwapContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '0x123',
      errorMessage: '',
      receipt: null,
      transactionId: 'test-id',
    });

    const { container } = render(<SwapToast position="bottom-right" />);

    const toastElement = container.firstChild as HTMLElement;
    expect(toastElement).toHaveClass('bottom-5 left-3/4');
  });

  it('applies correct position class for top-right', () => {
    (useSwapContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '0x123',
      errorMessage: '',
      receipt: null,
      transactionId: 'test-id',
    });

    const { container } = render(<SwapToast position="top-right" />);

    const toastElement = container.firstChild as HTMLElement;
    expect(toastElement).toHaveClass('top-[100px] left-3/4');
  });

  it('applies correct position class for top-center', () => {
    (useSwapContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '0x123',
      errorMessage: '',
      receipt: null,
      transactionId: 'test-id',
    });

    const { container } = render(<SwapToast position="top-center" />);

    const toastElement = container.firstChild as HTMLElement;
    expect(toastElement).toHaveClass('top-[100px] left-2/4');
  });

  it('applies default position class when not specified', () => {
    (useSwapContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '0x123',
      errorMessage: '',
      receipt: null,
      transactionId: 'test-id',
    });

    const { container } = render(<SwapToast />);

    const toastElement = container.firstChild as HTMLElement;
    expect(toastElement).toHaveClass('bottom-5 left-2/4');
  });

  it('hides toast after specified duration', () => {
    vi.useFakeTimers();
    const setIsToastVisible = vi.fn();
    const setTransactionHash = vi.fn();
    (useSwapContext as Mock).mockReturnValue({
      isToastVisible: true,
      transactionHash: '',
      setIsToastVisible,
      setTransactionHash,
    });

    render(<SwapToast durationMs={2000} />);

    vi.advanceTimersByTime(2000);
    expect(setIsToastVisible).toHaveBeenCalledWith(false);
    expect(setTransactionHash).toHaveBeenCalledWith('');
    vi.useRealTimers();
  });

  it('resets transactionhash after specified duration', () => {
    vi.useFakeTimers();
    const setIsToastVisible = vi.fn();
    const setTransactionHash = vi.fn();
    (useSwapContext as Mock).mockReturnValue({
      isToastVisible: true,
      transactionHash: '',
      setIsToastVisible,
      setTransactionHash,
    });

    render(<SwapToast durationMs={2000} />);

    vi.advanceTimersByTime(2000);
    expect(setIsToastVisible).toHaveBeenCalledWith(false);
    expect(setTransactionHash).toHaveBeenCalledWith('');
    vi.useRealTimers();
  });

  it('hides toast after specified duration when error message is present', () => {
    vi.useFakeTimers();
    const setIsToastVisible = vi.fn();
    const setTransactionHash = vi.fn();
    (useSwapContext as Mock).mockReturnValue({
      isToastVisible: true,
      transactionHash: '',
      setIsToastVisible,
      setTransactionHash,
    });

    render(<SwapToast durationMs={2000} />);

    vi.advanceTimersByTime(2000);
    expect(setIsToastVisible).toHaveBeenCalledWith(false);
    expect(setTransactionHash).toHaveBeenCalledWith('');
    vi.useRealTimers();
  });
});
