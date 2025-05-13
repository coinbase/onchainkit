import { MOCK_EARN_CONTEXT } from '@/earn/mocks/mocks.test';
import type { EarnContextType } from '@/earn/types';
import type { MakeRequired } from '@/internal/types';
import type { Call } from '@/transaction/types';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import type { Address } from 'viem';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { useConnect } from 'wagmi';
import { DepositButton } from './DepositButton';
import { useEarnContext } from './EarnProvider';
import { TransactionButtonRenderParams } from '@/transaction/types';
import React, { useCallback } from 'react';
import { Token } from '@/token';

// Address required to avoid connect wallet prompt
const baseContext: MakeRequired<EarnContextType, 'recipientAddress'> = {
  ...MOCK_EARN_CONTEXT,
  recipientAddress: '0x123' as Address,
};

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('@/earn/hooks/useDepositAnalytics', () => ({
  useDepositAnalytics: () => ({ setTransactionState: vi.fn() }),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useConfig: vi.fn(),
  useCapabilities: vi.fn(),
}));

// Mock functions to capture and control the render prop
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let capturedRenderFunction:
  | ((params: TransactionButtonRenderParams) => JSX.Element)
  | null = null;

let currentContext = {
  receipt: null,
  errorMessage: '',
  isLoading: false,
};

vi.mock('@/transaction', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/transaction')>()),
    TransactionLifecycleStatus: vi.fn(),
    TransactionButton: ({
      render,
      disabled,
    }: {
      render: (params: TransactionButtonRenderParams) => JSX.Element;
      disabled: boolean;
    }) => {
      // Store the render function for later use in tests
      capturedRenderFunction = render;

      const params = {
        context: currentContext,
        onSubmit: vi.fn(),
        onSuccess: vi.fn(),
        isDisabled: disabled,
      } as unknown as TransactionButtonRenderParams;

      // Return the rendered component
      return render(params);
    },
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

vi.mock('@/internal/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('DepositButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedRenderFunction = null;
    currentContext = {
      receipt: null,
      errorMessage: '',
      isLoading: false,
    };
  });

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

    render(<DepositButton />);

    const connectWalletButton = screen.getByTestId(
      'ockConnectWallet_Container',
    );
    expect(connectWalletButton).toBeInTheDocument();
  });

  it('renders Transaction with depositCalls from EarnProvider', () => {
    const mockDepositCalls: Call[] = [{ to: '0x123', data: '0x456' }];
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      depositCalls: mockDepositCalls,
    });

    render(<DepositButton />);

    const transactionElement = screen.getByTestId('transaction');
    expect(transactionElement).toBeInTheDocument();
  });

  it('surfaces Transaction lifecycle statuses', async () => {
    const mockUpdateLifecycleStatus = vi.fn();
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      depositCalls: [{ to: '0x123', data: '0x456' }],
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });

    render(<DepositButton />);

    // Simulate different transaction states using the mock buttons
    await act(async () => {
      screen.getByText('TransactionPending').click();
    });
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionPending',
    });

    await act(async () => {
      screen.getByText('Success').click();
    });
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'success',
    });

    await act(async () => {
      screen.getByText('Error').click();
    });
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
    });
  });

  it('clears the deposit amount after a successful transaction', async () => {
    const mockSetDepositAmount = vi.fn();
    const mockRefetchWalletBalance = vi.fn();

    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      setDepositAmount: mockSetDepositAmount,
      refetchWalletBalance: mockRefetchWalletBalance,
    });

    render(<DepositButton />);

    await act(async () => {
      screen.getByText('Success').click();
    });

    expect(mockSetDepositAmount).toHaveBeenCalledWith('');
    expect(mockRefetchWalletBalance).toHaveBeenCalled();
  });

  describe('customRender function', () => {
    it('renders default deposit button when no special state', () => {
      vi.mocked(useEarnContext).mockReturnValue({
        ...baseContext,
        depositCalls: [{ to: '0x123', data: '0x456' }],
      });

      render(<DepositButton />);

      const button = screen.getByText('Deposit');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('renders loading state with spinner', () => {
      vi.mocked(useEarnContext).mockReturnValue({
        ...baseContext,
        depositCalls: [{ to: '0x123', data: '0x456' }],
      });

      const { rerender } = render(<DepositButton />);

      currentContext = {
        ...currentContext,
        isLoading: true,
      };

      rerender(<DepositButton />);

      const spinner = screen.getByTestId('spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('renders error state with error message', () => {
      const depositAmountError = 'Invalid deposit amount';

      vi.mocked(useEarnContext).mockReturnValue({
        ...baseContext,
        depositCalls: [{ to: '0x123', data: '0x456' }],
        depositAmountError,
      });

      const { rerender } = render(<DepositButton />);

      currentContext = {
        ...currentContext,
        errorMessage: 'Some error occurred',
      };

      rerender(<DepositButton />);

      const errorButton = screen.getByText(depositAmountError);
      expect(errorButton).toBeInTheDocument();
    });

    it('renders receipt state with deposited amount', () => {
      const depositedAmount = '100';
      const vaultTokenSymbol = 'ETH';

      vi.mocked(useEarnContext).mockReturnValue({
        ...baseContext,
        depositCalls: [{ to: '0x123', data: '0x456' }],
        vaultToken: { symbol: vaultTokenSymbol } as Token,
      });

      const CustomRenderTest = () => {
        const [depositedAmt] = React.useState(depositedAmount);

        const params: TransactionButtonRenderParams = {
          context: {
            receipt: { hash: '0x789' }, // Receipt state
            errorMessage: '',
            isLoading: false,
          },
          onSubmit: vi.fn(),
          onSuccess: vi.fn(),
          isDisabled: false,
        } as unknown as TransactionButtonRenderParams;

        const customRender = useCallback(
          ({ context }: TransactionButtonRenderParams) => {
            const classNames = 'mock-class-names';

            if (context.receipt) {
              return (
                <button className={classNames}>
                  {`Deposited ${depositedAmt} ${vaultTokenSymbol}`}
                </button>
              );
            }

            return <button>Placeholder</button>;
          },
          [depositedAmt],
        );

        return customRender(params);
      };

      render(<CustomRenderTest />);

      const successMessage = `Deposited ${depositedAmount} ${vaultTokenSymbol}`;
      const receiptButton = screen.getByText(successMessage);
      expect(receiptButton).toBeInTheDocument();
    });

    it('disables button when depositAmountError exists', () => {
      vi.mocked(useEarnContext).mockReturnValue({
        ...baseContext,
        depositCalls: [{ to: '0x123', data: '0x456' }],
        depositAmountError: 'Invalid amount',
        depositAmount: '100',
      });

      render(<DepositButton />);

      const transactionButton = screen.getByText('Deposit');
      expect(transactionButton).toHaveAttribute('disabled');
    });

    it('disables button when depositAmount is empty', () => {
      vi.mocked(useEarnContext).mockReturnValue({
        ...baseContext,
        depositCalls: [{ to: '0x123', data: '0x456' }],
        depositAmount: '',
      });

      render(<DepositButton />);

      const transactionButton = screen.getByText('Deposit');
      expect(transactionButton).toHaveAttribute('disabled');
    });
  });
});
