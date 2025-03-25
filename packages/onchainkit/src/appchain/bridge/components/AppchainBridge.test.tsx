import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { parseEther } from 'viem';
import { type Chain, base, baseSepolia } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  http,
  WagmiProvider,
  createConfig,
  mock,
  useAccount,
  useConfig,
} from 'wagmi';
import { getBalance, readContract } from 'wagmi/actions';
import { ETH_BY_CHAIN } from '../constants';
import type { Appchain, BridgeableToken } from '../types';
import { AppchainBridge } from './AppchainBridge';
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

const mockChain = {
  id: 1,
  name: 'Ethereum',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
} as Chain;

const mockAppchain = {
  chain: {
    id: 8453,
    name: 'Base',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
} as Appchain;

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

const mockBridgeParams = {
  token: {
    address: '0x123',
    remoteToken: '0x456',
    decimals: 18,
    chainId: 1,
    image: '',
    name: 'Mock Token',
    symbol: 'MOCK',
  },
  amount: '1',
  recipient: '0x789',
  amountUSD: '100',
} as const;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={mockConfig}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </WagmiProvider>
);

vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
    useConfig: vi.fn(),
  };
});

vi.mock('wagmi/actions', () => ({
  getBalance: vi.fn(),
  readContract: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/internal/hooks/useIsMounted', () => ({
  useIsMounted: vi.fn(() => true),
}));

vi.mock('./AppchainBridgeProvider', async () => ({
  useAppchainBridgeContext: vi.fn(),
  AppchainBridgeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('AppchainBridge Component', () => {
  beforeEach(() => {
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });
    (useConfig as Mock).mockReturnValue({});
    (getBalance as ReturnType<typeof vi.fn>).mockResolvedValue({
      value: parseEther('1'),
      decimals: 18,
    });
    (readContract as ReturnType<typeof vi.fn>).mockResolvedValue(
      parseEther('1'),
    );
    (useAppchainBridgeContext as Mock).mockReturnValue({
      withdrawStatus: 'init',
      isWithdrawModalOpen: false,
      from: mockChain,
      to: mockAppchain,
      bridgeParams: mockBridgeParams,
      bridgeableTokens: [mockToken],
    });
  });

  it('renders custom children when provided', async () => {
    const customChildren = <p>Custom Children</p>;
    await act(async () => {
      render(
        <AppchainBridge chain={mockChain} appchain={mockAppchain}>
          {customChildren}
        </AppchainBridge>,
        { wrapper },
      );
    });

    expect(screen.getByText('Custom Children')).toBeInTheDocument();
    expect(
      screen.queryByTestId('ockAppchainBridge_DefaultContent'),
    ).not.toBeInTheDocument();
  });

  it('renders default content when children are not provided', async () => {
    await act(async () => {
      render(<AppchainBridge chain={mockChain} appchain={mockAppchain} />, {
        wrapper,
      });
    });

    expect(
      screen.getByTestId('ockAppchainBridge_DefaultContent'),
    ).toBeInTheDocument();
  });

  it('renders with custom title', async () => {
    await act(async () => {
      render(
        <AppchainBridge
          chain={mockChain}
          appchain={mockAppchain}
          title="Custom Bridge"
        />,
        { wrapper },
      );
    });

    expect(screen.getByText('Custom Bridge')).toBeInTheDocument();
  });

  it('applies custom className', async () => {
    await act(async () => {
      render(
        <AppchainBridge
          chain={mockChain}
          appchain={mockAppchain}
          className="custom-class"
        />,
        { wrapper },
      );
    });

    expect(screen.getByTestId('ockAppchainBridge_Container')).toHaveClass(
      'custom-class',
    );
  });

  it('opens withdrawal modal when isWithdrawModalOpen is true', async () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      isWithdrawModalOpen: true,
    });
    await act(async () => {
      render(<AppchainBridge chain={mockChain} appchain={mockAppchain} />, {
        wrapper,
      });
    });
    expect(screen.getByText('Confirming transaction')).toBeInTheDocument();
  });

  it('renders address input when isAddressModalOpen is true', async () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      isAddressModalOpen: true,
    });
    await act(async () => {
      render(<AppchainBridge chain={mockChain} appchain={mockAppchain} />, {
        wrapper,
      });
    });
    expect(screen.getByTestId('ockAppchainBridge_Address')).toBeInTheDocument();
  });

  it('renders success modal when isSuccessModalOpen is true', async () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      isSuccessModalOpen: true,
    });
    await act(async () => {
      render(<AppchainBridge chain={mockChain} appchain={mockAppchain} />, {
        wrapper,
      });
    });
    expect(screen.getByTestId('ockAppchainBridge_Success')).toBeInTheDocument();
  });

  it('renders resume transaction modal when isResumeTransactionModalOpen is true', async () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      isResumeTransactionModalOpen: true,
    });
    await act(async () => {
      render(<AppchainBridge chain={mockChain} appchain={mockAppchain} />, {
        wrapper,
      });
    });
    expect(
      screen.getByTestId('ockAppchainBridge_ResumeTransaction'),
    ).toBeInTheDocument();
  });

  it('should not render when not mounted', () => {
    (useIsMounted as Mock).mockReturnValueOnce(false);
    const { container } = render(
      <AppchainBridge chain={mockChain} appchain={mockAppchain} />,
      { wrapper },
    );
    expect(container).toBeEmptyDOMElement();
  });
});
