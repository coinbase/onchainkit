import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useShowCallsStatus } from 'wagmi/experimental';
import { useTransactionContext } from './TransactionProvider';
import { TransactionToast } from './TransactionToast';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useConfig: vi.fn(),
  useChainId: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useShowCallsStatus: vi.fn(),
}));

describe('TransactionToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useShowCallsStatus as Mock).mockReturnValue({
      showCallsStatus: vi.fn(),
    });
  });

  it('renders children correctly', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: true,
      isToastVisible: true,
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    render(
      <TransactionToast className="custom-class">
        <span>Transaction Toast Content</span>
      </TransactionToast>,
    );

    const contentElement = screen.getByText('Transaction Toast Content');
    expect(contentElement).toBeInTheDocument();
  });

  it('renders default children correctly', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: true,
      isToastVisible: true,
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    render(<TransactionToast className="custom-class" />);

    expect(screen.getByText('Transaction in progress')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    (useTransactionContext as Mock).mockReturnValue({
      errorMessage: '',
      isLoading: false,
      isToastVisible: false,
      receipt: null,
      setIsToastVisible: vi.fn(),
      transactionHash: '',
      transactionId: '',
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    render(<TransactionToast>Test Message</TransactionToast>);
    expect(screen.queryByText('Test Message')).toBeNull();
  });

  it('closes when the close button is clicked', () => {
    const setIsToastVisible = vi.fn();
    (useTransactionContext as Mock).mockReturnValue({
      errorMessage: '',
      isLoading: false,
      isToastVisible: true,
      receipt: null,
      setIsToastVisible,
      transactionHash: '0x123',
      transactionId: '',
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    render(<TransactionToast>Test Message</TransactionToast>);
    fireEvent.click(screen.getByTestId('ockCloseButton'));

    expect(setIsToastVisible).toHaveBeenCalledWith(false);
  });

  it('displays loading state correctly', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: true,
      isToastVisible: true,
      transactionHash: '',
      errorMessage: '',
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    render(<TransactionToast>Transaction in progress</TransactionToast>);

    expect(screen.getByText('Transaction in progress')).toBeInTheDocument();
  });

  it('displays transaction hash when available', () => {
    const mockTransactionHash = '0x123';
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: mockTransactionHash,
      errorMessage: '',
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    render(<TransactionToast>Transaction completed</TransactionToast>);

    expect(screen.getByText('Transaction completed')).toBeInTheDocument();
  });

  it('displays error message when present', () => {
    const setIsToastVisible = vi.fn();
    const mockErrorMessage = 'Transaction failed';
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '',
      errorMessage: mockErrorMessage,
      setIsToastVisible,
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    render(<TransactionToast>Error occurred</TransactionToast>);

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('does not render when in progress', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '',
      errorMessage: '',
      receipt: null,
      transactionId: '',
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    render(<TransactionToast>In Progress</TransactionToast>);

    expect(screen.queryByText('In Progress')).not.toBeInTheDocument();
  });

  it('applies correct position class for bottom-right', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '0x123',
      errorMessage: '',
      receipt: null,
      transactionId: 'test-id',
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    const { container } = render(
      <TransactionToast position="bottom-right">Test</TransactionToast>,
    );

    const toastElement = container.firstChild as HTMLElement;
    expect(toastElement).toHaveClass('bottom-5 left-3/4');
  });

  it('applies correct position class for top-right', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '0x123',
      errorMessage: '',
      receipt: null,
      transactionId: 'test-id',
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    const { container } = render(
      <TransactionToast position="top-right">Test</TransactionToast>,
    );

    const toastElement = container.firstChild as HTMLElement;
    expect(toastElement).toHaveClass('top-[100px] left-3/4');
  });

  it('applies correct position class for top-center', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '0x123',
      errorMessage: '',
      receipt: null,
      transactionId: 'test-id',
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    const { container } = render(
      <TransactionToast position="top-center">Test</TransactionToast>,
    );

    const toastElement = container.firstChild as HTMLElement;
    expect(toastElement).toHaveClass('top-[100px] left-2/4');
  });

  it('applies default position class when not specified', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '0x123',
      errorMessage: '',
      receipt: null,
      transactionId: 'test-id',
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    const { container } = render(<TransactionToast>Test</TransactionToast>);

    const toastElement = container.firstChild as HTMLElement;
    expect(toastElement).toHaveClass('bottom-5 left-2/4');
  });

  it('hides toast after specified duration when receipt is available', () => {
    vi.useFakeTimers();
    const setIsToastVisible = vi.fn();
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '',
      errorMessage: '',
      receipt: {},
      setIsToastVisible,
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    render(<TransactionToast durationMs={2000}>Test</TransactionToast>);

    vi.advanceTimersByTime(2000);
    expect(setIsToastVisible).toHaveBeenCalledWith(false);
    vi.useRealTimers();
  });

  it('hides toast after specified duration when error message is present', () => {
    vi.useFakeTimers();
    const setIsToastVisible = vi.fn();
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      isToastVisible: true,
      transactionHash: '',
      errorMessage: 'Error',
      receipt: null,
      setIsToastVisible,
      lifecycleStatus: {
        statusName: 'test-status',
      },
    });

    render(<TransactionToast durationMs={2000}>Test</TransactionToast>);

    vi.advanceTimersByTime(2000);
    expect(setIsToastVisible).toHaveBeenCalledWith(false);
    vi.useRealTimers();
  });
});
