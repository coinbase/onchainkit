import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TransactionButton } from './TransactionButton';
import { useTransactionContext } from './TransactionProvider';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useShowCallsStatus: vi.fn(),
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

  it('renders try again when error exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: true,
      errorMessage: '123',
    });

    render(<TransactionButton text="Transact" />);

    const text = screen.getByText('Try again');
    expect(text).toBeInTheDocument();
  });

  it('should have disabled attribute when isDisabled is true', () => {
    const { getByRole } = render(
      <TransactionButton disabled={true} text="Submit" />,
    );
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should have disabled attribute when txn is in progress', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: true,
    });

    const { getByRole } = render(<TransactionButton text="Submit" />);
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should have disabled when contracts are missing', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      contracts: undefined,
    });

    const { getByRole } = render(<TransactionButton text="Submit" />);
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should enable button when not in progress, not missing props, and not waiting for receipt', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: false,
      contracts: {},
      address: '0x123',
      transactionId: undefined,
      transactionHash: undefined,
      receipt: undefined,
    });

    const { getByRole } = render(<TransactionButton text="Submit" />);
    const button = getByRole('button');
    expect(button).not.toBeDisabled();
  });
});
