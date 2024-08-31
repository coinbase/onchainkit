import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useChainId } from 'wagmi';
import { useShowCallsStatus } from 'wagmi/experimental';
import { getChainExplorer } from '../../network/getChainExplorer';
import { TransactionButton } from './TransactionButton';
import { useTransactionContext } from './TransactionProvider';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useChainId: vi.fn(),
  useAccount: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useShowCallsStatus: vi.fn(),
}));

vi.mock('../../network/getChainExplorer', () => ({
  getChainExplorer: vi.fn(),
}));

describe('TransactionButton', () => {
  beforeEach(() => {
    (useChainId as Mock).mockReturnValue(123);
    (useAccount as Mock).mockReturnValue({ address: '123' });
    (useShowCallsStatus as Mock).mockReturnValue({
      showCallsStatus: vi.fn(),
    });
  });

  it('renders correctly', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      lifeCycleStatus: { statusName: 'init', statusData: null },
    });
    render(<TransactionButton text="Transact" />);
    const contentElement = screen.getByText('Transact');
    expect(contentElement).toBeInTheDocument();
  });

  it('renders spinner correctly', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifeCycleStatus: { statusName: 'init', statusData: null },
      isLoading: true,
    });
    render(<TransactionButton text="Transact" />);
    const spinner = screen.getByTestId('ockSpinner');
    expect(spinner).toBeInTheDocument();
  });

  it('renders view txn text when receipt exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: true,
      lifeCycleStatus: { statusName: 'init', statusData: null },
      receipt: '123',
    });
    render(<TransactionButton text="Transact" />);
    const text = screen.getByText('View transaction');
    expect(text).toBeInTheDocument();
  });

  it('renders try again when error exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: true,
      lifeCycleStatus: { statusName: 'init', statusData: null },
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
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: true,
      lifeCycleStatus: { statusName: 'init', statusData: null },
    });
    const { getByRole } = render(<TransactionButton text="Submit" />);
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should have disabled when contracts are missing', () => {
    (useTransactionContext as Mock).mockReturnValue({
      contracts: undefined,
      lifeCycleStatus: { statusName: 'init', statusData: null },
    });
    const { getByRole } = render(<TransactionButton text="Submit" />);
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should call showCallsStatus when receipt and transactionId exist', () => {
    const showCallsStatus = vi.fn();
    (useShowCallsStatus as Mock).mockReturnValue({ showCallsStatus });
    (useTransactionContext as Mock).mockReturnValue({
      lifeCycleStatus: { statusName: 'init', statusData: null },
      receipt: '123',
      transactionId: '456',
    });
    render(<TransactionButton text="Transact" />);
    const button = screen.getByText('View transaction');
    fireEvent.click(button);
    expect(showCallsStatus).toHaveBeenCalledWith({ id: '456' });
  });

  it('should enable button when not in progress, not missing props, and not waiting for receipt', () => {
    (useTransactionContext as Mock).mockReturnValue({
      contracts: {},
      isLoading: false,
      lifeCycleStatus: { statusName: 'init', statusData: null },
      transactionId: undefined,
      transactionHash: undefined,
      receipt: undefined,
    });
    const { getByRole } = render(<TransactionButton text="Submit" />);
    const button = getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should open transaction link when only receipt exists', () => {
    const onSubmit = vi.fn();
    const chainExplorerUrl = 'https://explorer.com';
    (useTransactionContext as Mock).mockReturnValue({
      lifeCycleStatus: { statusName: 'init', statusData: null },
      receipt: 'receipt-123',
      transactionId: undefined,
      transactionHash: 'hash-789',
      onSubmit,
    });
    (getChainExplorer as Mock).mockReturnValue(chainExplorerUrl);
    window.open = vi.fn();
    render(<TransactionButton text="Transact" />);
    const button = screen.getByText('View transaction');
    fireEvent.click(button);
    expect(window.open).toHaveBeenCalledWith(
      `${chainExplorerUrl}/tx/hash-789`,
      '_blank',
      'noopener,noreferrer',
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit when neither receipt nor transactionId exists', () => {
    const onSubmit = vi.fn();
    (useTransactionContext as Mock).mockReturnValue({
      address: '123',
      contracts: [{}],
      lifeCycleStatus: { statusName: 'init', statusData: null },
      onSubmit,
      receipt: undefined,
      transactionId: undefined,
    });
    render(<TransactionButton text="Transact" />);
    const button = screen.getByText('Transact');
    fireEvent.click(button);
    expect(onSubmit).toHaveBeenCalled();
  });
});
