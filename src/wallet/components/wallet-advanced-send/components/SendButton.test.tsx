import { Transaction } from '@/transaction/components/Transaction';
import { TransactionButton } from '@/transaction/components/TransactionButton';
import { useTransactionContext } from '@/transaction/components/TransactionProvider';
import { render, screen } from '@testing-library/react';
import { type Address, type Chain, parseUnits } from 'viem';
import { base } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import { useWalletContext } from '../../WalletProvider';
import { defaultSendTxSuccessHandler } from '../utils/defaultSendTxSuccessHandler';
import { getSendTransaction } from '../utils/getSendTransaction';
import { SendButton } from './SendButton';
import { useSendContext } from './SendProvider';

vi.mock('viem', () => ({
  parseUnits: vi.fn(),
}));

vi.mock('../../WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('../../WalletAdvancedProvider', () => ({
  useWalletAdvancedContext: vi.fn(),
}));

vi.mock('../utils/getSendTransaction', () => ({
  getSendTransaction: vi.fn(),
}));

vi.mock('./SendProvider', () => ({
  useSendContext: vi.fn(),
}));

vi.mock('@/transaction/components/TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('@/transaction/components/Transaction', () => ({
  Transaction: vi.fn(({ children }) => (
    <div data-testid="mock-transaction">{children}</div>
  )),
}));

vi.mock('@/transaction/components/TransactionButton', () => ({
  TransactionButton: vi.fn(() => (
    <button type="button" data-testid="mock-transaction-button">
      Send
    </button>
  )),
}));

vi.mock('@/transaction/components/TransactionStatus', () => ({
  TransactionStatus: vi.fn(({ children }) => (
    <div data-testid="mock-transaction-status">{children}</div>
  )),
}));

vi.mock('@/transaction/components/TransactionStatusLabel', () => ({
  TransactionStatusLabel: vi.fn(() => (
    <div data-testid="mock-transaction-status-label">Status</div>
  )),
}));

vi.mock('@/transaction/components/TransactionStatusAction', () => ({
  TransactionStatusAction: vi.fn(() => (
    <div data-testid="mock-transaction-status-action">Action</div>
  )),
}));

vi.mock('../utils/defaultSendTxSuccessHandler', () => ({
  defaultSendTxSuccessHandler: vi.fn(() => vi.fn()),
}));

const mockChain = {
  id: 8453,
  name: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
} as Chain;

const mockSelectedtoken = {
  name: 'USD Coin',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address,
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjMZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: 8453,
  cryptoBalance: 69000000,
  fiatBalance: 69000000,
};

describe('SendButton', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseWalletAdvancedContext = useWalletAdvancedContext as ReturnType<
    typeof vi.fn
  >;
  const mockUseSendContext = useSendContext as ReturnType<typeof vi.fn>;
  const mockUseTransactionContext = useTransactionContext as ReturnType<
    typeof vi.fn
  >;
  const mockDefaultSendTxSuccessHandler =
    defaultSendTxSuccessHandler as ReturnType<typeof vi.fn>;
  const mockGetSendTransaction = getSendTransaction as ReturnType<typeof vi.fn>;

  const mockWalletContext = {
    chain: mockChain,
    address: '0x1234567890123456789012345678901234567890',
  };

  const mockWalletAdvancedContext = {
    setActiveFeature: vi.fn(),
  };

  const mockSendContext = {
    selectedRecipientAddress: {
      value: '0x9876543210987654321098765432109876543210',
    },
    cryptoAmount: '1.0',
    selectedToken: mockSelectedtoken,
    updateLifecycleStatus: vi.fn(),
  };

  const mockTransactionData = {
    calldata: { to: '0x9876543210987654321098765432109876543210', data: '0x' },
    error: null,
  };

  const mockTransactionContext = {
    transactionHash: '0xabcdef',
    transactionId: '123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletContext.mockReturnValue(mockWalletContext);
    mockUseWalletAdvancedContext.mockReturnValue(mockWalletAdvancedContext);
    mockUseSendContext.mockReturnValue(mockSendContext);
    mockUseTransactionContext.mockReturnValue(mockTransactionContext);
    mockGetSendTransaction.mockReturnValue(mockTransactionData);
  });

  it('renders with default props', () => {
    render(<SendButton />);

    expect(Transaction).toHaveBeenCalledWith(
      expect.objectContaining({
        isSponsored: false,
        chainId: mockChain.id,
        calls: [mockTransactionData.calldata],
      }),
      {},
    );

    expect(screen.getByTestId('mock-transaction')).toBeInTheDocument();
    expect(screen.getByTestId('mock-transaction-button')).toBeInTheDocument();
    expect(screen.getByTestId('mock-transaction-status')).toBeInTheDocument();
    expect(
      screen.getByTestId('mock-transaction-status-label'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('mock-transaction-status-action'),
    ).toBeInTheDocument();
  });

  it('passes custom label to TransactionButton', () => {
    render(<SendButton label="Custom Send" />);

    expect(TransactionButton).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Custom Send',
      }),
      {},
    );
  });

  it('passes isSponsored prop to Transaction', () => {
    render(<SendButton isSponsored={true} />);

    expect(Transaction).toHaveBeenCalledWith(
      expect.objectContaining({
        isSponsored: true,
      }),
      {},
    );
  });

  it('passes className to TransactionButton', () => {
    render(<SendButton className="custom-button-class" />);

    expect(TransactionButton).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'custom-button-class',
      }),
      {},
    );
  });

  it('disables button when input amount is invalid', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      cryptoAmount: '3.0', // More than balance
    });

    render(<SendButton />);

    expect(TransactionButton).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
      }),
      {},
    );
  });

  it('disables button when disabled prop is true', () => {
    render(<SendButton disabled={true} />);

    expect(TransactionButton).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
      }),
      {},
    );
  });

  it('uses default chain when wallet chain is null', () => {
    mockUseWalletContext.mockReturnValue({
      ...mockWalletContext,
      chain: null,
    });

    render(<SendButton />);

    expect(Transaction).toHaveBeenCalledWith(
      expect.objectContaining({
        chainId: base.id,
      }),
      {},
    );
  });

  it('uses empty calls array when callData is null', () => {
    mockGetSendTransaction.mockReturnValue({
      ...mockTransactionData,
      calldata: null,
    });

    render(<SendButton />);

    expect(Transaction).toHaveBeenCalledWith(
      expect.objectContaining({
        calls: [],
      }),
      {},
    );
  });

  it('sets button label to "Input amount" when cryptoAmount is null', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      cryptoAmount: null,
    });

    render(<SendButton />);

    expect(TransactionButton).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Input amount',
      }),
      {},
    );
  });

  it('sets button label to "Select token" when selectedToken is null', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      selectedToken: null,
    });

    render(<SendButton />);

    expect(TransactionButton).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Select token',
      }),
      {},
    );
  });

  it('sets button label to "Insufficient balance" when amount exceeds balance', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      cryptoAmount: '3.0', // More than the 2 ETH balance
    });

    vi.mocked(parseUnits).mockImplementation(() => {
      return 3000000000000000000n;
    });

    render(<SendButton />);

    expect(TransactionButton).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Insufficient balance',
      }),
      {},
    );
  });

  it('sets button label to "Continue" when all conditions are met', () => {
    vi.mocked(parseUnits).mockImplementation(() => {
      return 1000000n;
    });

    render(<SendButton />);

    expect(TransactionButton).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Continue',
      }),
      {},
    );
  });

  it('calls updateLifecycleStatus when transaction status changes', () => {
    render(<SendButton />);

    const { onStatus } = vi.mocked(Transaction).mock.calls[0][0];

    onStatus?.({ statusName: 'transactionPending', statusData: null });

    expect(mockSendContext.updateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionPending',
      statusData: null,
    });
  });

  it('does not call updateLifecycleStatus for non-tracked statuses', () => {
    render(<SendButton />);

    const { onStatus } = vi.mocked(Transaction).mock.calls[0][0];

    // @ts-expect-error - setting invalid status name for testing
    onStatus?.({ statusName: 'someOtherStatus', statusData: null });

    expect(mockSendContext.updateLifecycleStatus).not.toHaveBeenCalled();
  });

  it('passes custom overrides to TransactionButton', () => {
    const pendingOverride = { text: 'Sending...' };
    const successOverride = { text: 'Sent!' };
    const errorOverride = { text: 'Failed!' };

    render(
      <SendButton
        pendingOverride={pendingOverride}
        successOverride={successOverride}
        errorOverride={errorOverride}
      />,
    );

    expect(TransactionButton).toHaveBeenCalledWith(
      expect.objectContaining({
        pendingOverride,
        successOverride,
        errorOverride,
      }),
      {},
    );
  });

  it('handles null wallet address correctly', () => {
    mockUseWalletContext.mockReturnValue({
      ...mockWalletContext,
      address: null,
    });

    render(<SendButton />);

    expect(defaultSendTxSuccessHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        address: undefined,
      }),
    );
  });

  it('configures defaultSuccessOverride with correct parameters', () => {
    render(<SendButton />);

    expect(defaultSendTxSuccessHandler).toHaveBeenCalledWith({
      transactionId: '123',
      transactionHash: '0xabcdef',
      senderChain: mockWalletContext.chain,
      address: mockWalletContext.address,
      onComplete: expect.any(Function),
    });
  });

  it('calls setActiveFeature when completionHandler is triggered', () => {
    const setActiveFeature = vi.fn();
    mockUseWalletAdvancedContext.mockReturnValue({
      setActiveFeature,
    });

    render(<SendButton label="Send" />);

    const { onComplete } = mockDefaultSendTxSuccessHandler.mock.calls[0][0];

    // Call the callback
    onComplete();

    expect(setActiveFeature).toHaveBeenCalledWith(null);
  });
});
