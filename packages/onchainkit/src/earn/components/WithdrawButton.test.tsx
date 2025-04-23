import { MOCK_EARN_CONTEXT } from '@/earn/mocks/mocks.test';
import type { EarnContextType } from '@/earn/types';
import type { MakeRequired } from '@/internal/types';
import type { Call } from '@/transaction/types';
import { render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useAccount, useConnect } from 'wagmi';
import { useEarnContext } from './EarnProvider';
import { WithdrawButton } from './WithdrawButton';

// Address required to avoid connect wallet prompt
const baseContext: MakeRequired<EarnContextType, 'recipientAddress'> = {
  ...MOCK_EARN_CONTEXT,
  recipientAddress: '0x123' as Address,
};

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useConfig: vi.fn(),
  useCapabilities: vi.fn(),
}));

vi.mock('@/transaction', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/transaction')>()),
    TransactionLifecycleStatus: vi.fn(),
    TransactionButton: ({
      text,
      disabled,
    }: {
      text: string;
      disabled: boolean;
    }) => (
      <button type="button" disabled={disabled} data-testid="transactionButton">
        {text}
      </button>
    ),
    Transaction: ({
      onStatus,
      onSuccess,
      children,
      capabilities,
    }: {
      onStatus: (status: { statusName: string }) => void;
      onSuccess: (response: {
        transactionReceipts: Array<{ status: string }>;
      }) => void;
      children: React.ReactNode;
      capabilities: { paymasterService: { url: string } };
    }) => (
      <>
        <div data-testid="transaction">
          <button
            type="button"
            data-testid="transaction-button"
            onClick={() => onStatus({ statusName: 'transactionPending' })}
          >
            TransactionPending
          </button>
          <button
            type="button"
            data-testid="transaction-button"
            onClick={() =>
              onStatus({ statusName: 'transactionLegacyExecuted' })
            }
          >
            TransactionLegacyExecuted
          </button>
          <button
            type="button"
            data-testid="transaction-button"
            onClick={() => {
              onStatus({ statusName: 'success' });
              onSuccess({ transactionReceipts: [{ status: 'success' }] });
            }}
          >
            Success
          </button>

          <button
            type="button"
            data-testid="transaction-button"
            onClick={() => onStatus({ statusName: 'error' })}
          >
            Error
          </button>
          <div>{capabilities?.paymasterService?.url}</div>
        </div>
        {children}
      </>
    ),
    TransactionSponsor: vi.fn(),
    TransactionStatus: vi.fn(),
    TransactionStatusAction: vi.fn(),
    TransactionStatusLabel: vi.fn(),
  };
});

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('WithdrawButton Component', () => {
  it('renders ConnectWallet if no account is connected', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      recipientAddress: undefined,
    });

    vi.mocked(useAccount as Mock).mockReturnValue({
      address: '',
      status: 'disconnected',
    });

    vi.mocked(useConnect as Mock).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: vi.fn(),
      status: 'idle',
    });

    render(<WithdrawButton />);

    const connectWalletButton = screen.getByTestId(
      'ockConnectWallet_Container',
    );
    expect(connectWalletButton).toBeInTheDocument();
  });

  it('renders Transaction with depositCalls from EarnProvider', () => {
    const mockWithdrawCalls = [{ to: '0x123', data: '0x456' }] as Call[];
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      withdrawCalls: mockWithdrawCalls,
    });

    render(<WithdrawButton />);

    const transactionElement = screen.getByTestId('transaction');
    expect(transactionElement).toBeInTheDocument();
  });

  it('renders TransactionButton with the correct text', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      withdrawAmount: '',
      withdrawCalls: [],
    });

    const { container } = render(<WithdrawButton />);

    expect(container).toHaveTextContent('Withdraw');
  });

  it('surfaces Transaction lifecycle statuses', () => {
    const mockUpdateLifecycleStatus = vi.fn();
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      withdrawCalls: [{ to: '0x123', data: '0x456' }],
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });

    render(<WithdrawButton />);

    // Simulate different transaction states using the mock buttons
    screen.getByText('TransactionPending').click();
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionPending',
    });

    screen.getByText('Success').click();
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'success',
    });

    screen.getByText('Error').click();
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
    });
  });

  it('clears the withdraw amount after a successful transaction', async () => {
    const mockSetWithdrawAmount = vi.fn();
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      setWithdrawAmount: mockSetWithdrawAmount,
    });

    render(<WithdrawButton />);

    screen.getByText('Success').click();
    expect(mockSetWithdrawAmount).toHaveBeenCalledWith('');
  });

  it('disables the button and shows an error message when there is an error', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      withdrawAmountError: 'Error',
    });

    render(<WithdrawButton />);

    const transactionButton = screen.getByTestId('transactionButton');
    expect(transactionButton).toBeDisabled();
    expect(transactionButton).toHaveTextContent('Error');
  });
});
