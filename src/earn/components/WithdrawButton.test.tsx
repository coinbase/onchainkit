import type { Call } from '@/transaction/types';
import { render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import { useEarnContext } from './EarnProvider';
import { WithdrawButton } from './WithdrawButton';

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConfig: vi.fn(),
  useCapabilities: vi.fn(),
}));

const baseContext = {
  convertedBalance: '1000',
  setDepositAmount: vi.fn(),
  vaultAddress: '0x123' as Address,
  depositAmount: '0',
  depositedAmount: '0',
  withdrawAmount: '0',
  setWithdrawAmount: vi.fn(),
  depositCalls: [],
  withdrawCalls: [],
};

vi.mock('@/transaction', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/transaction')>()),
    TransactionLifecycleStatus: vi.fn(),
    TransactionButton: ({
      text,
      disabled,
    }: { text: string; disabled: boolean }) => (
      <button type="button" disabled={disabled} data-testid="transactionButton">
        {text}
      </button>
    ),
    Transaction: ({
      onStatus,
      children,
      capabilities,
    }: {
      onStatus: (status: { statusName: string }) => void;
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
            onClick={() => onStatus({ statusName: 'success' })}
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
  it('renders Transaction with depositCalls from EarnProvider', () => {
    const mockDepositCalls = [{ to: '0x123', data: '0x456' }] as Call[];
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      depositCalls: mockDepositCalls,
    });

    render(<WithdrawButton />);

    const transactionElement = screen.getByTestId('transaction');
    expect(transactionElement).toBeInTheDocument();
  });

  it('renders TransactionButton with the correct text', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      depositCalls: [],
    });

    const { container } = render(<WithdrawButton />);

    expect(container).toHaveTextContent('Withdraw');
  });
});
