import { render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useTransactionContext } from '../components/TransactionProvider';
import { TransactionToastIcon } from './TransactionToastIcon';

vi.mock('../components/TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('TransactionToastIcon', () => {
  it('renders success icon when receipt exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      receipt: '123',
    });

    render(<TransactionToastIcon className="custom-class" />);

    const iconElement = screen.getByTestId('ock-successSvg');
    expect(iconElement).toBeInTheDocument();
  });
  it('renders error icon when error exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      errorMessage: 'error',
    });

    render(<TransactionToastIcon className="custom-class" />);

    const iconElement = screen.getByTestId('ock-errorSvg');
    expect(iconElement).toBeInTheDocument();
  });
  it('renders loading icon when txn is in progress', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: true,
    });

    render(<TransactionToastIcon className="custom-class" />);

    const iconElement = screen.getByTestId('ockSpinner');
    expect(iconElement).toBeInTheDocument();
  });
  it('renders null when if no status exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
    });

    const { container } = render(
      <TransactionToastIcon className="test-class" />,
    );

    // Assert that nothing is rendered (container should be empty)
    expect(container.firstChild).toBeNull();
  });
});
