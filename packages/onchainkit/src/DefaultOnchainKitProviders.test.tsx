import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, createConfig } from 'wagmi';
import { DefaultOnchainKitProviders } from './DefaultOnchainKitProviders';
import { useProviderDependencies } from './internal/hooks/useProviderDependencies';

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

describe('DefaultOnchainKitProviders', () => {
  beforeEach(() => {
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: null,
      providedQueryClient: null,
    });
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
});
