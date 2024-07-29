import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTransactionContext } from './TransactionProvider';
import { TransactionToast } from './TransactionToast';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('TransactionToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children correctly', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: true,
      isToastVisible: true,
    });

    render(
      <TransactionToast className="custom-class">
        <span>Transaction Toast Content</span>
      </TransactionToast>,
    );

    const contentElement = screen.getByText('Transaction Toast Content');
    expect(contentElement).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      errorMessage: '',
      isLoading: false,
      isToastVisible: false,
      receipt: null,
      setIsToastVisible: vi.fn(),
      transactionHash: '',
      transactionId: '',
    });

    render(<TransactionToast>Test Message</TransactionToast>);
    expect(screen.queryByText('Test Message')).toBeNull();
  });

  it('closes when the close button is clicked', () => {
    const setIsToastVisible = vi.fn();
    (useTransactionContext as vi.Mock).mockReturnValue({
      errorMessage: '',
      isLoading: false,
      isToastVisible: true,
      receipt: null,
      setIsToastVisible,
      transactionHash: '123',
      transactionId: '',
    });

    render(<TransactionToast>Test Message</TransactionToast>);
    fireEvent.click(screen.getByTestId('ockCloseButton'));

    expect(setIsToastVisible).toHaveBeenCalledWith(false);
  });
});
