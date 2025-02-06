import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { DefaultOnchainKitProviders } from './DefaultOnchainKitProviders';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProviderDependencies } from "./internal/hooks/useProviderDependencies";

const queryClient = new QueryClient();
const wagmiConfig = createConfig({
  chains: [{ 
    id: 1, 
    name: 'Mock Chain', 
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, 
    rpcUrls: { default: { http: ['http://localhost'] } } 
  }],
  connectors: [],
  transports: { [1]: http() },
});

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    WagmiProvider: vi.fn(({ children }) => <div data-testid="wagmi-provider">{children}</div>),
  };
});

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    QueryClientProvider: vi.fn(({ children }) => <div data-testid="query-client-provider">{children}</div>),
  };
});

vi.mock('./internal/hooks/useProviderDependencies', () => ({
  useProviderDependencies: vi.fn(() => ({
    providedWagmiConfig: vi.fn(),
    providedQueryClient: vi.fn(),
  })),
}));

describe('DefaultOnchainKitProviders', () => {
  beforeEach(() => {
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: false,
      providedQueryClient: false,
    });
  });

  it('should wrap children in default providers', () => {
    render(
      <DefaultOnchainKitProviders>
        <div>Test Child</div>
      </DefaultOnchainKitProviders>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.queryAllByTestId('wagmi-provider')).toHaveLength(1);
    expect(screen.queryAllByTestId('query-client-provider')).toHaveLength(1);
  });

  it('should not render duplicate default providers when a wagmi provider already exists', () => {
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: wagmiConfig,
      providedQueryClient: null,
    });

    render(
      <WagmiProvider config={wagmiConfig}>
        <DefaultOnchainKitProviders>
          <div>Test Child</div>
        </DefaultOnchainKitProviders>
      </WagmiProvider>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.queryAllByTestId('wagmi-provider')).toHaveLength(1);
  });

  it('should not render duplicate default providers when a query client already exists', () => {
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: null,
      providedQueryClient: queryClient,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <DefaultOnchainKitProviders>
          <div>Test Child</div>
        </DefaultOnchainKitProviders>
      </QueryClientProvider>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.queryAllByTestId('query-client-provider')).toHaveLength(1);
  });
});
