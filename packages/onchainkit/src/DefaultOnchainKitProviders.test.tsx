import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, createConfig } from 'wagmi';
import { DefaultOnchainKitProviders } from './DefaultOnchainKitProviders';
import { useProviderDependencies } from './internal/hooks/useProviderDependencies';
import { useOnchainKit } from './useOnchainKit';

// Mock the coinbase wallet connector
const mockCoinbaseWallet = vi.fn();

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
    WagmiProvider: vi.fn(({ children }) => (
      <div data-testid="wagmi-provider">{children}</div>
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

// Mock wagmi/connectors
vi.mock('wagmi/connectors', () => {
  return {
    coinbaseWallet: (params: {
      preference?: string;
      appName?: string;
      appLogoUrl?: string;
    }) => {
      mockCoinbaseWallet(params);
      // Return a connector function that Wagmi expects
      return () => ({ id: 'coinbaseWalletSDK' });
    },
  };
});

describe('DefaultOnchainKitProviders', () => {
  beforeEach(() => {
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: null,
      providedQueryClient: null,
    });
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
