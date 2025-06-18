import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useChainId } from 'wagmi';
import { getChainExplorer } from '../../core/network/getChainExplorer';
import { TransactionButton } from './TransactionButton';
import { useTransactionContext } from './TransactionProvider';
import { TransactionButtonRenderParams } from '../types';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useChainId: vi.fn(),
  useAccount: vi.fn(),
}));

vi.mock('../../core/network/getChainExplorer', () => ({
  getChainExplorer: vi.fn(),
}));

function customRender({
  status,
  onSuccess,
  onSubmit,
}: TransactionButtonRenderParams) {
  if (status === 'pending') {
    return <div>loading</div>;
  }
  if (status === 'success') {
    return <div onClick={onSuccess}>yay</div>;
  }
  if (status === 'error') {
    return <div onClick={onSubmit}>oops</div>;
  }
  return <div onClick={onSubmit}>Transact</div>;
}

const mockCustomErrorHandler = vi.fn();
function customRenderWithErrorHandler({
  status,
  onSuccess,
  onSubmit,
}: TransactionButtonRenderParams) {
  if (status === 'pending') {
    return <div>Transaction in progress</div>;
  }
  if (status === 'success') {
    return <div onClick={onSuccess}>yay</div>;
  }
  if (status === 'error') {
    return <div onClick={mockCustomErrorHandler}>oops</div>;
  }
  return <div onClick={onSubmit}>Transact</div>;
}

const mockCustomSuccessHandler = vi.fn();
function customRenderWithSuccessHandler({
  status,
  onSubmit,
}: TransactionButtonRenderParams) {
  if (status === 'pending') {
    return <div>Transaction in progress</div>;
  }
  if (status === 'success') {
    return <div onClick={mockCustomSuccessHandler}>yay</div>;
  }
  if (status === 'error') {
    return <div onClick={onSubmit}>oops</div>;
  }
  return <div onClick={onSubmit}>Transact</div>;
}

describe('TransactionButton', () => {
  beforeEach(() => {
    (useChainId as Mock).mockReturnValue(123);
    (useAccount as Mock).mockReturnValue({ address: '123' });
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      lifecycleStatus: { statusName: 'init', statusData: null },
    });
    render(<TransactionButton text="Transact" />);
    const contentElement = screen.getByText('Transact');
    expect(contentElement).toBeInTheDocument();
  });

  it('renders spinner correctly', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      isLoading: true,
    });
    render(<TransactionButton text="Transact" />);
    const spinner = screen.getByTestId('ockSpinner');
    expect(spinner).toBeInTheDocument();
  });

  it('renders view txn text when receipt exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: true,
      lifecycleStatus: { statusName: 'init', statusData: null },
      receipt: '123',
    });
    render(<TransactionButton text="Transact" />);
    const text = screen.getByText('View transaction');
    expect(text).toBeInTheDocument();
  });

  it('renders try again when error exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: true,
      lifecycleStatus: { statusName: 'init', statusData: null },
      errorMessage: '123',
    });
    render(<TransactionButton text="Transact" />);
    const text = screen.getByText('Try again');
    expect(text).toBeInTheDocument();
  });

  it('renders custom error text when error exists', () => {
    const mockErrorFunc = vi.fn();
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      errorMessage: 'blah blah',
      isLoading: false,
      address: '123',
      transactions: [{}],
      onSubmit: mockErrorFunc,
    });
    render(<TransactionButton text="Transact" render={customRender} />);
    const text = screen.getByText('oops');
    expect(text).toBeInTheDocument();
    const button = screen.getByText('oops');
    fireEvent.click(button);
    expect(mockErrorFunc).toHaveBeenCalled();
  });

  it('should call custom error handler when error exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      errorMessage: 'blah blah',
      isLoading: false,
      address: '123',
      transactions: [{}],
    });
    render(
      <TransactionButton
        text="Transact"
        render={customRenderWithErrorHandler}
      />,
    );
    const button = screen.getByText('oops');
    fireEvent.click(button);
    expect(mockCustomErrorHandler).toHaveBeenCalled();
  });

  it('should recall onSubmit when error exists and no custom handler provided', () => {
    const mockOnSubmit = vi.fn();
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      errorMessage: 'blah blah',
      isLoading: false,
      address: '123',
      transactions: [{}],
      onSubmit: mockOnSubmit,
    });
    render(<TransactionButton text="Transact" />);
    const button = screen.getByTestId('ockTransactionButton_Button');
    fireEvent.click(button);
    expect(mockOnSubmit).toHaveBeenCalled();
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
      lifecycleStatus: { statusName: 'init', statusData: null },
    });
    const { getByRole } = render(<TransactionButton text="Submit" />);
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should have disabled when transactions are missing', () => {
    (useTransactionContext as Mock).mockReturnValue({
      transactions: undefined,
      lifecycleStatus: { statusName: 'init', statusData: null },
    });
    const { getByRole } = render(<TransactionButton text="Submit" />);
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should open wallet.coinbase.com for smart wallets', () => {
    const onSubmit = vi.fn();
    const chainExplorerUrl = 'https://explorer.com';
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      receipt: 'receipt-123',
      transactionId: '123',
      transactionHash: 'hash',
      chainId: 1,
      onSubmit,
    });

    const url = new URL('https://wallet.coinbase.com/assets/transactions');
    url.searchParams.set('contentParams[txHash]', 'hash');
    url.searchParams.set('contentParams[chainId]', '1');
    url.searchParams.set('contentParams[fromAddress]', '123');

    (getChainExplorer as Mock).mockReturnValue(chainExplorerUrl);
    window.open = vi.fn();
    render(<TransactionButton text="Transact" />);
    const button = screen.getByText('View transaction');
    fireEvent.click(button);
    expect(window.open).toHaveBeenCalledWith(
      url,
      '_blank',
      'noopener,noreferrer',
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should render custom success text when it exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      receipt: '123',
      transactionId: '456',
    });
    render(<TransactionButton text="Transact" render={customRender} />);
    const button = screen.getByText('yay');
    fireEvent.click(button);
    expect(window.open).toHaveBeenCalled();
  });

  it('should render custom pending text when it exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      transactionId: '456',
      isLoading: true,
    });
    render(<TransactionButton text="Transact" render={customRender} />);
    const button = screen.getByText('loading');
    fireEvent.click(button);
    expect(button).toBeDefined();
  });

  it('should call custom success handler when it exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      receipt: '123',
      transactionId: '456',
    });
    render(
      <TransactionButton
        text="Transact"
        render={customRenderWithSuccessHandler}
      />,
    );
    const button = screen.getByText('yay');
    fireEvent.click(button);
    expect(mockCustomSuccessHandler).toHaveBeenCalled();
  });

  it('should enable button when not in progress, not missing props, and not waiting for receipt', () => {
    (useTransactionContext as Mock).mockReturnValue({
      isLoading: false,
      lifecycleStatus: { statusName: 'init', statusData: null },
      transactions: [],
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
      lifecycleStatus: { statusName: 'init', statusData: null },
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
      transactions: [{}],
      lifecycleStatus: { statusName: 'init', statusData: null },
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
