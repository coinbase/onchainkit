import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { base, baseSepolia } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, WagmiProvider, createConfig, mock, useAccount } from 'wagmi';
import { ETH_BY_CHAIN } from '../constants';
import type { BridgeableToken } from '../types';
import { AppchainBridgeInput } from './AppchainBridgeInput';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

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

const mockToken = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: base.id,
  remoteToken: ETH_BY_CHAIN[base.id].address,
} as BridgeableToken;

const mockBridgeContext = {
  balance: '1.5',
  bridgeParams: {
    amount: '',
    amountUSD: '0.00',
    recipient: '0x123',
    token: mockToken,
  },
  to: {
    id: 8453,
    icon: '🔵',
  },
  isPriceLoading: false,
  handleAmountChange: vi.fn(),
  setIsAddressModalOpen: vi.fn(),
  bridgeableTokens: [mockToken],
};

vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
  };
});

vi.mock('./AppchainBridgeProvider', () => ({
  useAppchainBridgeContext: vi.fn(),
}));

vi.mock('@/internal/hooks/usePreferredColorScheme', () => ({
  usePreferredColorScheme: vi.fn().mockReturnValue('light'),
}));

describe('AppchainBridgeInput', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      status: 'connected',
    });

    (useAppchainBridgeContext as Mock).mockReturnValue(mockBridgeContext);
  });

  it('renders correctly with default props', () => {
    render(<AppchainBridgeInput />, { wrapper });

    expect(
      screen.getByTestId('ockBridgeAmountInput_Container'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(screen.getByText('~$0.00')).toBeInTheDocument();
    expect(screen.getByText('Balance: 1.5')).toBeInTheDocument();
  });

  it('handles amount changes', async () => {
    const mockHandleAmountChange = vi.fn();
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...mockBridgeContext,
      handleAmountChange: mockHandleAmountChange,
      resetDepositStatus: vi.fn(),
    });

    render(<AppchainBridgeInput />, { wrapper });
    const input = screen.getByPlaceholderText('0.00');
    await userEvent.type(input, '2');
    await waitFor(() => {
      expect(mockHandleAmountChange).toHaveBeenCalledWith({
        amount: '2',
        token: mockToken,
      });
    });
  });

  it('shows loading state when price is loading', () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...mockBridgeContext,
      isPriceLoading: true,
    });

    render(<AppchainBridgeInput />, { wrapper });
    expect(
      screen
        .getByTestId('ockBridgeAmountInput_Container')
        .querySelector('.animate-pulse'),
    ).toBeInTheDocument();
  });

  it('shows insufficient funds message when balance is too low', async () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...mockBridgeContext,
      balance: '0.5',
      bridgeParams: {
        ...mockBridgeContext.bridgeParams,
        amount: '0.6',
      },
    });

    render(<AppchainBridgeInput />, { wrapper });
    const input = screen.getByPlaceholderText('0.00');
    await userEvent.type(input, '0.6');
    await waitFor(() => {
      expect(input).toHaveValue('0.6');
      expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
    });
  });

  it('handles wallet disconnected state', () => {
    (useAccount as Mock).mockReturnValue({
      address: undefined,
      status: 'disconnected',
    });

    render(<AppchainBridgeInput />, { wrapper });
    expect(screen.queryByText('Balance:')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockBridgeAmountInput_MaxButton'),
    ).not.toBeInTheDocument();
  });

  it('handles custom bridgeable tokens', () => {
    const customToken = {
      ...mockToken,
      symbol: 'CUSTOM',
    };
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...mockBridgeContext,
      bridgeableTokens: [customToken],
    });

    render(<AppchainBridgeInput />, {
      wrapper,
    });
    expect(screen.getByText('CUSTOM')).toBeInTheDocument();
  });

  it('opens address modal when clicking recipient address', async () => {
    const mockSetIsAddressModalOpen = vi.fn();
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...mockBridgeContext,
      setIsAddressModalOpen: mockSetIsAddressModalOpen,
    });

    render(<AppchainBridgeInput />, { wrapper });
    const addressButton = screen.getByText('0x123...x123');

    await userEvent.click(addressButton);
    expect(mockSetIsAddressModalOpen).toHaveBeenCalledWith(true);
  });

  it('displays NaN amount correctly', () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...mockBridgeContext,
      bridgeParams: {
        ...mockBridgeContext.bridgeParams,
        amountUSD: 'NaN',
      },
    });
    render(<AppchainBridgeInput />, { wrapper });
    expect(screen.queryByText(/\$|~\$/)).not.toBeInTheDocument();
  });

  it('handles max button click correctly', async () => {
    const mockHandleAmountChange = vi.fn();
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...mockBridgeContext,
      handleAmountChange: mockHandleAmountChange,
      balance: '1.5',
    });
    render(<AppchainBridgeInput />, { wrapper });
    const maxButton = screen.getByTestId('ockBridgeAmountInput_MaxButton');
    await userEvent.click(maxButton);
    expect(mockHandleAmountChange).toHaveBeenCalledWith({
      amount: '1.5',
      token: mockToken,
    });
  });

  it('formats balance with correct decimal places', () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...mockBridgeContext,
      balance: '1.23456789',
    });
    render(<AppchainBridgeInput />, { wrapper });
    expect(screen.getByText('Balance: 1.23457')).toBeInTheDocument();
  });

  it('formats whole number balance without decimal places', () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...mockBridgeContext,
      balance: '100',
    });
    render(<AppchainBridgeInput />, { wrapper });
    expect(screen.getByText('Balance: 100')).toBeInTheDocument();
  });

  it('shows default address when recipient is not set', () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...mockBridgeContext,
      bridgeParams: {
        ...mockBridgeContext.bridgeParams,
        recipient: '',
      },
    });
    render(<AppchainBridgeInput />, { wrapper });
    expect(screen.getByText('0x0000...0000')).toBeInTheDocument();
  });

  it('handles token selection correctly', async () => {
    const mockHandleAmountChange = vi.fn();
    const mockResetDepositStatus = vi.fn();
    const customToken = {
      ...mockToken,
      symbol: 'CUSTOM',
      address: '0x456',
    } as BridgeableToken;
    (useAppchainBridgeContext as Mock).mockReturnValue({
      ...mockBridgeContext,
      handleAmountChange: mockHandleAmountChange,
      resetDepositStatus: mockResetDepositStatus,
      bridgeParams: {
        ...mockBridgeContext.bridgeParams,
        amount: '1.0',
      },
      bridgeableTokens: [mockToken, customToken],
    });
    render(<AppchainBridgeInput />, { wrapper });

    await waitFor(async () => {
      // Open token dropdown
      const tokenButton = screen.getByText('ETH');
      await userEvent.click(tokenButton);
      // Select new token
      const customTokenOption = screen.getByText('CUSTOM');
      await userEvent.click(customTokenOption);
    });

    // Verify handleAmountChange was called with correct params
    expect(mockHandleAmountChange).toHaveBeenCalledWith({
      amount: '1.0',
      token: customToken,
    });
    expect(mockResetDepositStatus).toHaveBeenCalled();
  });
});
