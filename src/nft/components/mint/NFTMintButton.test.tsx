import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNFTLifecycleContext } from '@/nft/components/NFTLifecycleProvider';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { NFTMintButton } from '@/nft/components/mint/NFTMintButton';
import { useMintAnalytics } from '@/nft/hooks/useMintAnalytics';
import { useOnchainKit } from '@/useOnchainKit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  http,
  WagmiProvider,
  createConfig,
  useAccount,
  useChainId,
} from 'wagmi';
import { mock } from 'wagmi/connectors';


vi.mock('@/nft/components/NFTProvider');
vi.mock('@/nft/components/NFTLifecycleProvider');
vi.mock('@/nft/hooks/useMintAnalytics');
vi.mock('@/useOnchainKit');
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useChainId: vi.fn(),
  http: vi.fn(),
  WagmiProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  createConfig: vi.fn(),
}));
vi.mock('@/wallet', () => ({
  ConnectWallet: () => <div>ConnectWallet</div>,
}));

const queryClient = new QueryClient();

const mockConfig = createConfig({
  chains: [base],
  connectors: [
    mock({
      accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

const TestProviders = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={mockConfig}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </WagmiProvider>
);

describe('NFTMintButton', () => {
  let mockUpdateLifecycleStatus: Mock;
  let mockSetTransactionState: Mock;

  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    (useNFTContext as Mock).mockReturnValue({
      contractAddress: '0x123',
      name: 'name',
      tokenId: '1',
      quantity: 1,
      isEligibleToMint: true,
      buildMintTransaction: vi
        .fn()
        .mockResolvedValue({ to: '0x123', data: '0x123', value: BigInt(2) }),
    });
    mockUpdateLifecycleStatus = vi.fn();
    mockSetTransactionState = vi.fn();
    (useNFTLifecycleContext as Mock).mockReturnValue({
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });
    (useMintAnalytics as Mock).mockReturnValue({
      setTransactionState: mockSetTransactionState,
    });
    (useAccount as Mock).mockReturnValue({ address: '0xabc' });
    (useChainId as Mock).mockReturnValue(1);
    (useOnchainKit as Mock).mockReturnValue({
      config: undefined,
    });
  });

  it('should render the mint button with default label', async () => {
    const { findByText } = render(
      <TestProviders>
        <NFTMintButton />
      </TestProviders>,
    );

    expect(await findByText('Mint')).toBeInTheDocument();
  });

  it('should render the mint button with custom label', async () => {
    const { findByText } = render(
      <TestProviders>
        <NFTMintButton label="Custom Mint" />
      </TestProviders>,
    );
    expect(await findByText('Custom Mint')).toBeInTheDocument();
  });

  it('should call updateLifecycleStatus with transactionPending status when transactionStatus is transactionPending', () => {
    const { getByText } = render(
      <TestProviders>
        <NFTMintButton />
      </TestProviders>,
    );

    getByText('TransactionPending').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionPending',
    });
    expect(mockSetTransactionState).toHaveBeenCalledWith('transactionPending');
  });

  it('should call updateLifecycleStatus with transaction status when transactionStatus is transactionLegacyExecuted', () => {
    const { getByText } = render(
      <TestProviders>
        <NFTMintButton />
      </TestProviders>,
    );

    getByText('TransactionLegacyExecuted').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionLegacyExecuted',
    });
    expect(mockSetTransactionState).toHaveBeenCalledWith(
      'transactionLegacyExecuted',
    );
  });

  it('should call updateLifecycleStatus with transaction status when transactionStatus is success', () => {
    const { getByText } = render(
      <TestProviders>
        <NFTMintButton />
      </TestProviders>,
    );

    getByText('Success').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'success',
    });
    expect(mockSetTransactionState).toHaveBeenCalledWith('success');
  });

  it('should call updateLifecycleStatus with transaction status when transactionStatus is error', () => {
    const { getByText } = render(
      <TestProviders>
        <NFTMintButton />
      </TestProviders>,
    );

    getByText('Error').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
    });
    expect(mockSetTransactionState).toHaveBeenCalledWith('error');
  });

  it('should render ConnectWallet when address is not available', () => {
    (useAccount as Mock).mockReturnValue({ address: null });
    const { getByText } = render(
      <TestProviders>
        <NFTMintButton />
      </TestProviders>,
    );
    expect(getByText('ConnectWallet')).toBeInTheDocument();
  });

  it('should not render when buildMintTransaction is undefined', () => {
    (useNFTContext as Mock).mockReturnValue({
      contractAddress: '0x123',
      tokenId: '1',
      quantity: 1,
      isEligibleToMint: true,
    });
    const { container } = render(
      <TestProviders>
        <NFTMintButton />
      </TestProviders>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should disable button if disabled props is true', async () => {
    const { findByText } = render(
      <TestProviders>
        <NFTMintButton disabled={true} />
      </TestProviders>,
    );
    expect(await findByText('Mint')).toBeDisabled();
  });

  it('should show minting not available when isEligibleToMint is false', () => {
    (useNFTContext as Mock).mockReturnValue({
      contractAddress: '0x123',
      tokenId: '1',
      quantity: 1,
      isEligibleToMint: false,
      buildMintTransaction: vi
        .fn()
        .mockResolvedValue({ to: '0x123', data: '0x123', value: BigInt(2) }),
    });
    const { getByText } = render(
      <TestProviders>
        <NFTMintButton />
      </TestProviders>,
    );
    expect(getByText('Minting not available')).toBeInTheDocument();
  });

  it('calls buildMintTransaction when quantity changes', async () => {
    const buildMintTransactionMock = vi.fn().mockResolvedValue([]);
    (useNFTContext as Mock).mockReturnValueOnce({
      contractAddress: '0x123',
      tokenId: '1',
      name: 'name',
      isEligibleToMint: true,
      buildMintTransaction: buildMintTransactionMock,
      quantity: 1,
    });

    const { rerender } = render(
      <TestProviders>
        <NFTMintButton />
      </TestProviders>,
    );
    expect(buildMintTransactionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: '0x123',
        tokenId: '1',
        takerAddress: '0xabc',
        quantity: 1,
      }),
    );

    (useNFTContext as Mock).mockReturnValueOnce({
      contractAddress: '0x123',
      tokenId: '1',
      name: 'name',
      isEligibleToMint: true,
      buildMintTransaction: buildMintTransactionMock,
      quantity: 2,
    });

    rerender(
      <TestProviders>
        <NFTMintButton />
      </TestProviders>,
    );

    expect(buildMintTransactionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: '0x123',
        tokenId: '1',
        takerAddress: '0xabc',
        quantity: 2,
      }),
    );
  });

  it('calls updateLifecycleStatus on buildMintTransaction error', async () => {
    const buildMintTransactionMock = vi.fn().mockRejectedValue('error');
    (useNFTContext as Mock).mockReturnValueOnce({
      contractAddress: '0x123',
      tokenId: '1',
      name: 'name',
      isEligibleToMint: true,
      buildMintTransaction: buildMintTransactionMock,
      quantity: 1,
    });

    await render(
      <TestProviders>
        <NFTMintButton />
      </TestProviders>,
    );

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: expect.objectContaining({ message: 'error' }),
    });
  });
});
