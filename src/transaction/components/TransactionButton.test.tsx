import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTransactionContext } from './TransactionProvider';
import { TransactionButton } from './TransactionButton';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('TransactionButton', () => {
  it('renders correctly', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: false,
    });

    render(<TransactionButton text="Transact" />);

    const contentElement = screen.getByText('Transact');
    expect(contentElement).toBeInTheDocument();
  });

  it('renders spinner correctly', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<TransactionButton text="Transact" />);

    const spinner = screen.getByTestId('ockSpinner');
    expect(spinner).toBeInTheDocument();
  });

  it('renders checkmark svg correctly when receipt exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: true,
      receipt: '123',
    });

    render(<TransactionButton text="Transact" />);

    const checkmark = screen.getByTestId('ockCheckmarkSvg');
    expect(checkmark).toBeInTheDocument();
  });
});
