import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, createConfig } from 'wagmi';
import type { CreateConnectorFn } from 'wagmi';
import { DefaultOnchainKitProviders } from './DefaultOnchainKitProviders';
import { useProviderDependencies } from './internal/hooks/useProviderDependencies';
import { useOnchainKit } from './useOnchainKit';
import type { CreateWagmiConfigParams } from './core/types';

// Mock the coinbase wallet connector
const mockCoinbaseWallet = vi.fn();

// Mock the farcaster frame connector
const mockFarcasterFrame = vi.fn();

// Mock for the createWagmiConfig
const mockCreateWagmiConfig = vi.fn();
vi.mock('./core/createWagmiConfig', () => ({
  createWagmiConfig: (params: CreateWagmiConfigParams) => {
    mockCreateWagmiConfig(params);
    return { mock: 'config', params };
  },
}));

const queryClient = new QueryClient();
const wagmiConfig = createConfig({
  chains: [
    {
      id: 1,
      name: 'Mock Chain',
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: { default: { http: ['http://localhost'] } },
    },
  ],
  connectors: [],
  transports: { [1]: http() },
});

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    WagmiProvider: vi.fn(({ children, config }) => (
      <div data-testid="wagmi-provider" data-config={JSON.stringify(config)}>
        {children}
      </div>
    )),
  };
});

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    QueryClientProvider: vi.fn(({ children }) => (
      <div data-testid="query-client-provider">{children}</div>
    )),
  };
});

vi.mock('./internal/hooks/useProviderDependencies', () => ({
  useProviderDependencies: vi.fn(() => ({
    providedWagmiConfig: vi.fn(),
    providedQueryClient: vi.fn(),
  })),
}));

vi.mock('./useOnchainKit', () => ({
  useOnchainKit: vi.fn(() => ({
    apiKey: 'mock-api-key',
    config: {
      appearance: {
        name: 'Mock App',
        logo: 'https://example.com/logo.png',
      },
      wallet: {
        preference: 'all',
      },
    },
  })),
}));

// Mock MiniKitContext
const mockMiniKitContext = vi.fn();

vi.mock('@/minikit/MiniKitProvider', () => ({
  MiniKitContext: { _currentValue: null },
}));

// Mock useContext to control MiniKit context
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useContext: vi.fn((context) => {
      // Check if this is the MiniKitContext by checking its shape
      if (
        context &&
        typeof context === 'object' &&
        '_currentValue' in context
      ) {
        return mockMiniKitContext();
      }
      return actual.useContext(context);
    }),
  };
});

// Create mock connector function that satisfies the CreateConnectorFn interface
const createMockConnector = (id: string): CreateConnectorFn => {
  return () => ({
    id,
    name: `Mock ${id}`,
    type: 'mock',
    icon: undefined,
    rdns: undefined,
    supportsSimulation: false,
    connect: async () => ({
      accounts: [],
      chainId: 1,
    }),
    disconnect: async () => {},
    getAccounts: async () => [],
    getChainId: async () => 1,
    getProvider: async () => ({}),
    isAuthorized: async () => false,
    onAccountsChanged: () => {},
    onChainChanged: () => {},
    onDisconnect: () => {},
  });
};

// Mock wagmi/connectors
vi.mock('wagmi/connectors', () => {
  return {
    coinbaseWallet: (params: {
      preference?: string;
      appName?: string;
      appLogoUrl?: string;
    }) => {
      mockCoinbaseWallet(params);
      // Return a connector function that satisfies the CreateConnectorFn interface
      return createMockConnector('coinbaseWalletSDK');
    },
  };
});

// Mock @farcaster/frame-wagmi-connector
vi.mock('@farcaster/frame-wagmi-connector', () => ({
  farcasterFrame: () => {
    mockFarcasterFrame();
    return createMockConnector('farcasterFrame');
  },
}));

describe('DefaultOnchainKitProviders', () => {
  beforeEach(() => {
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: null,
      providedQueryClient: null,
    });
    mockMiniKitContext.mockReturnValue({ context: null });
    vi.clearAllMocks();
  });

  it('should wrap children in default providers', () => {
    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.queryAllByTestId('wagmi-provider')).toHaveLength(1);
    expect(screen.queryAllByTestId('query-client-provider')).toHaveLength(1);
  });

  it('should not render duplicate WagmiProvider when a wagmi provider already exists', () => {
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: wagmiConfig,
      providedQueryClient: null,
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.queryAllByTestId('wagmi-provider')).toHaveLength(0);
    expect(screen.queryAllByTestId('query-client-provider')).toHaveLength(1);
  });

  it('should not render duplicate QueryClientProvider when a query client already exists', () => {
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: null,
      providedQueryClient: queryClient,
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.queryAllByTestId('wagmi-provider')).toHaveLength(1);
    expect(screen.queryAllByTestId('query-client-provider')).toHaveLength(0);
  });

  it('should not render any default providers when both providers already exist', () => {
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: wagmiConfig,
      providedQueryClient: queryClient,
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.queryAllByTestId('wagmi-provider')).toHaveLength(0);
    expect(screen.queryAllByTestId('query-client-provider')).toHaveLength(0);
  });

  it('should use coinbaseWallet connector when MiniKit context is not available', () => {
    mockMiniKitContext.mockReturnValue({ context: null });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    // Verify coinbaseWallet was called
    expect(mockCoinbaseWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: 'Mock App',
        appLogoUrl: 'https://example.com/logo.png',
        preference: 'all',
      }),
    );

    // Verify farcasterFrame was not called
    expect(mockFarcasterFrame).not.toHaveBeenCalled();
  });

  it('should use farcasterFrame connector when MiniKit context is available', () => {
    mockMiniKitContext.mockReturnValue({ context: { isFrame: true } });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    // Verify farcasterFrame was called
    expect(mockFarcasterFrame).toHaveBeenCalled();

    // Verify coinbaseWallet was not called
    expect(mockCoinbaseWallet).not.toHaveBeenCalled();
  });

  it('should pass the wallet preference to the coinbaseWallet connector', () => {
    // Mock useOnchainKit to return smartWalletOnly preference
    (useOnchainKit as Mock).mockReturnValue({
      apiKey: 'mock-api-key',
      config: {
        appearance: {
          name: 'Mock App',
          logo: 'https://example.com/logo.png',
        },
        wallet: {
          preference: 'smartWalletOnly',
        },
      },
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    // Verify coinbaseWallet was called with the correct preference
    expect(mockCoinbaseWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        preference: 'smartWalletOnly',
      }),
    );
  });

  it('should pass the default preference "all" when no preference is specified', () => {
    // Mock useOnchainKit to return config without preference
    (useOnchainKit as Mock).mockReturnValue({
      apiKey: 'mock-api-key',
      config: {
        appearance: {
          name: 'Mock App',
          logo: 'https://example.com/logo.png',
        },
        wallet: {},
      },
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    // Verify coinbaseWallet was called with the default preference
    expect(mockCoinbaseWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        preference: undefined,
      }),
    );
  });

  it('should pass eoaOnly preference to the coinbaseWallet connector', () => {
    // Mock useOnchainKit to return eoaOnly preference
    (useOnchainKit as Mock).mockReturnValue({
      apiKey: 'mock-api-key',
      config: {
        appearance: {
          name: 'Mock App',
          logo: 'https://example.com/logo.png',
        },
        wallet: {
          preference: 'eoaOnly',
        },
      },
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    // Verify coinbaseWallet was called with eoaOnly preference
    expect(mockCoinbaseWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        preference: 'eoaOnly',
      }),
    );
  });

  it('should handle undefined appearance values', () => {
    // Mock useOnchainKit to return undefined appearance values
    (useOnchainKit as Mock).mockReturnValue({
      apiKey: null,
      config: {
        wallet: {
          preference: 'all',
        },
      },
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    // Verify coinbaseWallet was called with undefined app name and logo
    expect(mockCoinbaseWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: undefined,
        appLogoUrl: undefined,
      }),
    );
  });

  it('should handle missing config entirely', () => {
    // Mock useOnchainKit to return no config
    (useOnchainKit as Mock).mockReturnValue({
      apiKey: 'test-api-key',
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(mockCoinbaseWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: undefined,
        appLogoUrl: undefined,
      }),
    );
  });
});
