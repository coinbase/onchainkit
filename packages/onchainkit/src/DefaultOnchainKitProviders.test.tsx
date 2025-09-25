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

// Mock the base account connector
const mockBaseAccount = vi.fn();

// Mock the farcaster frame connector
const mockFarcasterMiniApp = vi.fn();

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
    baseAccount: (params: { appName?: string; appLogoUrl?: string }) => {
      mockBaseAccount(params);
      // Return a connector function that satisfies the CreateConnectorFn interface
      return createMockConnector('baseAccount');
    },
  };
});

// Mock @farcaster/miniapp-wagmi-connector
vi.mock('@farcaster/miniapp-wagmi-connector', () => ({
  farcasterMiniApp: () => {
    mockFarcasterMiniApp();
    return createMockConnector('farcasterMiniApp');
  },
}));

describe('DefaultOnchainKitProviders', () => {
  beforeEach(() => {
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: null,
      providedQueryClient: null,
    });
    mockMiniKitContext.mockReturnValue({ context: null });
    mockCoinbaseWallet.mockClear();
    mockBaseAccount.mockClear();
    mockFarcasterMiniApp.mockClear();
    mockCreateWagmiConfig.mockClear();
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

  it('should use baseAccount connector when MiniKit context is not available', () => {
    mockMiniKitContext.mockReturnValue({ context: null });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    // Verify baseAccount was called
    expect(mockBaseAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: 'Mock App',
        appLogoUrl: 'https://example.com/logo.png',
      }),
    );

    // Verify farcasterFrame was not called
    expect(mockFarcasterMiniApp).not.toHaveBeenCalled();

    // Verify coinbaseWallet was not called
    expect(mockCoinbaseWallet).not.toHaveBeenCalled();
  });

  it('should use farcasterFrame connector when MiniKit context is available', () => {
    mockMiniKitContext.mockReturnValue({ context: { isFrame: true } });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    // Verify farcasterFrame was called
    expect(mockFarcasterMiniApp).toHaveBeenCalled();

    // Verify baseAccount was not called
    expect(mockBaseAccount).not.toHaveBeenCalled();

    // Verify coinbaseWallet was not called
    expect(mockCoinbaseWallet).not.toHaveBeenCalled();
  });

  it('should pass app details to the baseAccount connector', () => {
    // Mock useOnchainKit to return app details
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

    // Verify baseAccount was called with the app details
    expect(mockBaseAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: 'Mock App',
        appLogoUrl: 'https://example.com/logo.png',
      }),
    );
  });

  it('should pass app details when no preference is specified', () => {
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

    // Verify baseAccount was called with app details
    expect(mockBaseAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: 'Mock App',
        appLogoUrl: 'https://example.com/logo.png',
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

    // Verify baseAccount was called with undefined app name and logo
    expect(mockBaseAccount).toHaveBeenCalledWith(
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
    expect(mockBaseAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: undefined,
        appLogoUrl: undefined,
      }),
    );
  });

  // Yeni Test Senaryoları - Wallet Preference Tests
  it('should handle wallet preference "smartWalletOnly"', () => {
    (useOnchainKit as Mock).mockReturnValue({
      apiKey: 'mock-api-key',
      config: {
        appearance: {
          name: 'Test App',
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

    // Bu durumda baseAccount kullanılıyor (wallet preference henüz desteklenmiyor)
    expect(mockBaseAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: 'Test App',
        appLogoUrl: 'https://example.com/logo.png',
      }),
    );
  });

  it('should handle wallet preference "eoaOnly"', () => {
    (useOnchainKit as Mock).mockReturnValue({
      apiKey: 'mock-api-key',
      config: {
        appearance: {
          name: 'Test App',
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

    // eoaOnly preference'da coinbaseWallet kullanılmalı
    expect(mockCoinbaseWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: 'Test App',
        appLogoUrl: 'https://example.com/logo.png',
        preference: 'eoaOnly',
      }),
    );
    expect(mockBaseAccount).not.toHaveBeenCalled();
  });

  it('should handle wallet preference "all" (default)', () => {
    (useOnchainKit as Mock).mockReturnValue({
      apiKey: 'mock-api-key',
      config: {
        appearance: {
          name: 'Test App',
          logo: 'https://example.com/logo.png',
        },
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

    // 'all' preference'da baseAccount kullanılmalı (default davranış)
    expect(mockBaseAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: 'Test App',
        appLogoUrl: 'https://example.com/logo.png',
      }),
    );
    expect(mockCoinbaseWallet).not.toHaveBeenCalled();
  });

  // API Key Tests
  it('should handle null API key', () => {
    (useOnchainKit as Mock).mockReturnValue({
      apiKey: null,
      config: {
        appearance: {
          name: 'Test App',
        },
      },
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(mockCreateWagmiConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: undefined,
        appName: 'Test App',
      }),
    );
  });

  it('should handle empty string API key', () => {
    (useOnchainKit as Mock).mockReturnValue({
      apiKey: '',
      config: {
        appearance: {
          name: 'Test App',
        },
      },
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    expect(mockCreateWagmiConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: '',
        appName: 'Test App',
      }),
    );
  });

  // MiniKit Error Handling Tests
  it('should handle MiniKit context error gracefully', () => {
    // MiniKit context'de null/undefined durumu simüle et
    mockMiniKitContext.mockReturnValue(null);

    // Hata durumunda bile component render olmalı
    expect(() => {
      render(
        <DefaultOnchainKitProviders>
          <div>Test Child</div>
        </DefaultOnchainKitProviders>,
      );
    }).not.toThrow();
    
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  // QueryClient Error Handling Tests
  it('should handle QueryClient creation with custom configuration', () => {
    const customQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 0,
        },
      },
    });

    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: null,
      providedQueryClient: customQueryClient,
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    // Custom QueryClient kullanıldığı için yeni provider oluşturulmamalı
    expect(screen.queryAllByTestId('query-client-provider')).toHaveLength(0);
  });

  // Edge Case Tests
  it('should handle extremely long app name and logo URL', () => {
    const longAppName = 'A'.repeat(1000);
    const longLogoUrl = 'https://example.com/' + 'very-long-path/'.repeat(100) + 'logo.png';

    (useOnchainKit as Mock).mockReturnValue({
      apiKey: 'test-api-key',
      config: {
        appearance: {
          name: longAppName,
          logo: longLogoUrl,
        },
      },
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    expect(mockBaseAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: longAppName,
        appLogoUrl: longLogoUrl,
      }),
    );
  });

  it('should handle special characters in app name and logo URL', () => {
    const specialAppName = 'Test App 🚀 & <script>alert("test")</script>';
    const specialLogoUrl = 'https://example.com/logo with spaces & special chars.png';

    (useOnchainKit as Mock).mockReturnValue({
      apiKey: 'test-api-key',
      config: {
        appearance: {
          name: specialAppName,
          logo: specialLogoUrl,
        },
      },
    });

    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>,
    );

    expect(mockBaseAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: specialAppName,
        appLogoUrl: specialLogoUrl,
      }),
    );
  });
});
