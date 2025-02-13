import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { baseSepolia } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  http,
  WagmiProvider,
  createConfig,
  mock,
  useAccount,
  useConnect,
} from 'wagmi';
import { useDepositButton } from '../hooks/useDepositButton';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';
import { AppchainBridgeTransactionButton } from './AppchainBridgeTransactionButton';

const queryClient = new QueryClient();

const mockConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    mock({
      accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={mockConfig}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </WagmiProvider>
);

vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
    useConnect: vi.fn(),
  };
});

vi.mock('./AppchainBridgeProvider', () => ({
  useAppchainBridgeContext: vi.fn(),
}));

vi.mock('../hooks/useDepositButton', () => ({
  useDepositButton: vi.fn(),
}));

describe('AppchainBridgeTransactionButton', () => {
  const mockHandleDeposit = vi.fn();
  const mockHandleWithdraw = vi.fn();
  const mockConnect = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    (useAccount as Mock).mockReturnValue({
      isConnected: true,
    });

    (useConnect as Mock).mockReturnValue({
      connect: mockConnect,
    });

    (useAppchainBridgeContext as Mock).mockReturnValue({
      handleDeposit: mockHandleDeposit,
      handleWithdraw: mockHandleWithdraw,
      depositStatus: 'idle',
      withdrawStatus: 'idle',
      direction: 'deposit',
      bridgeParams: {
        amount: '1',
        token: {
          symbol: 'ETH',
        },
      },
    });

    (useDepositButton as Mock).mockReturnValue({
      isRejected: false,
      buttonContent: 'Confirm',
      isDisabled: false,
    });
  });

  it('renders with default state', () => {
    render(<AppchainBridgeTransactionButton />, { wrapper });
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('handles deposit direction correctly', async () => {
    render(<AppchainBridgeTransactionButton />, { wrapper });
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockHandleDeposit).toHaveBeenCalled();
  });

  it('handles withdraw direction correctly', () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...useAppchainBridgeContext(),
      direction: 'withdraw',
    });
    render(<AppchainBridgeTransactionButton />, { wrapper });
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockHandleWithdraw).toHaveBeenCalled();
  });

  it('disables button when isDisabled is true', () => {
    (useDepositButton as Mock).mockReturnValue({
      isRejected: false,
      buttonContent: 'Confirm',
      isDisabled: true,
    });

    render(<AppchainBridgeTransactionButton />, { wrapper });
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows error message when transaction is rejected', () => {
    (useDepositButton as Mock).mockReturnValue({
      isRejected: true,
      buttonContent: 'Confirm',
      isDisabled: false,
    });

    render(<AppchainBridgeTransactionButton />, { wrapper });
    expect(screen.getByText('Transaction denied')).toBeInTheDocument();
  });

  it('shows loading state during transaction', () => {
    (useDepositButton as Mock).mockReturnValue({
      isRejected: false,
      buttonContent: 'Processing...',
      isDisabled: true,
    });

    render(<AppchainBridgeTransactionButton />, { wrapper });
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });
});
