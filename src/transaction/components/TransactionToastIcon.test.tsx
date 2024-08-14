import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTransactionContext } from '../components/TransactionProvider';
import { TransactionToastIcon } from './TransactionToastIcon';

vi.mock('../components/TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('TransactionToastIcon', () => {
  it('renders success icon when receipt exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      receipt: '123',
    });

    render(<TransactionToastIcon className="custom-class" />);

    const iconElement = screen.getByTestId('ockSuccessSvg');
    expect(iconElement).toBeInTheDocument();
  });
  it('renders error icon when error exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      errorMessage: 'error',
    });

    render(<TransactionToastIcon className="custom-class" />);

    const iconElement = screen.getByTestId('ockErrorSvg');
    expect(iconElement).toBeInTheDocument();
  });
  it('renders loading icon when txn is in progress', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<TransactionToastIcon className="custom-class" />);

    const iconElement = screen.getByTestId('ockSpinner');
    expect(iconElement).toBeInTheDocument();
  });
  it('renders null when if no status exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: false,
    });

    const { container } = render(
      <TransactionToastIcon className="test-class" />,
    );

    // Assert that nothing is rendered (container should be empty)
    expect(container.firstChild).toBeNull();
  });
});
