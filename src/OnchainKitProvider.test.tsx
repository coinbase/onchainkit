import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { useConfig } from 'wagmi';
import { mock } from 'wagmi/connectors';
import { setOnchainKitConfig } from './OnchainKitConfig';
import { OnchainKitProvider } from './OnchainKitProvider';
import { COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID } from './identity/constants';
import type { EASSchemaUid } from './identity/types';
import { useOnchainKit } from './useOnchainKit';
import { useProviderDependencies } from './useProviderDependencies';

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useConfig: vi.fn(),
  };
});

vi.mock('./useProviderDependencies', () => ({
  useProviderDependencies: vi.fn(() => ({
    providedWagmiConfig: null,
    providedQueryClient: null,
  })),
}));

vi.mock('./useProviderDependencies', () => ({
  useProviderDependencies: vi.fn(() => ({
    providedWagmiConfig: null,
    providedQueryClient: null,
  })),
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

const TestComponent = () => {
  const { schemaId, apiKey } = useOnchainKit();
  return (
    <>
      <div>{schemaId}</div>
      <div>{apiKey}</div>
    </>
  );
};

vi.mock('./OnchainKitConfig', () => ({
  setOnchainKitConfig: vi.fn(),
  ONCHAIN_KIT_CONFIG: {
    address: null,
    apiKey: null,
    chain: base,
    rpcUrl: null,
    schemaId: null,
    projectId: null,
  },
}));

describe('OnchainKitProvider', () => {
  const schemaId: EASSchemaUid = `0x${'1'.repeat(64)}`;
  const apiKey = 'test-api-key';
  const paymasterUrl =
    'https://api.developer.coinbase.com/rpc/v1/base/test-api-key';
  const appLogo = '';
  const appName = 'Dapp';

  beforeEach(() => {
    vi.clearAllMocks();
    (useConfig as Mock).mockReturnValue(mockConfig);
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: mockConfig,
      providedQueryClient: queryClient,
    });
  });

  it('provides the context value correctly', async () => {
    render(
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider chain={base} schemaId={schemaId} apiKey={apiKey}>
            <TestComponent />
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(schemaId)).toBeInTheDocument();
      expect(screen.getByText(apiKey)).toBeInTheDocument();
    });
  });

  it('provides the context value correctly without WagmiProvider', async () => {
    (useProviderDependencies as Mock).mockReturnValue({
      providedWagmiConfig: null,
      providedQueryClient: null,
    });
    render(
      <OnchainKitProvider chain={base} schemaId={schemaId} apiKey={apiKey}>
        <TestComponent />
      </OnchainKitProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText(schemaId)).toBeInTheDocument();
      expect(screen.getByText(apiKey)).toBeInTheDocument();
    });
  });

  it('throws an error if schemaId does not meet the required length', () => {
    expect(() => {
      render(
        <WagmiProvider config={mockConfig}>
          <QueryClientProvider client={queryClient}>
            <OnchainKitProvider chain={base} schemaId={'0x123'} apiKey={apiKey}>
              <TestComponent />
            </OnchainKitProvider>
          </QueryClientProvider>
        </WagmiProvider>,
      );
    }).toThrow('EAS schemaId must be 64 characters prefixed with "0x"');
  });

  it('does not throw an error if schemaId is not provided', () => {
    expect(() => {
      render(
        <WagmiProvider config={mockConfig}>
          <QueryClientProvider client={queryClient}>
            <OnchainKitProvider chain={base} apiKey={apiKey}>
              <TestComponent />
            </OnchainKitProvider>
          </QueryClientProvider>
        </WagmiProvider>,
      );
    }).not.toThrow();
  });

  it('does not throw an error if api key is not provided', () => {
    expect(() => {
      render(
        <WagmiProvider config={mockConfig}>
          <QueryClientProvider client={queryClient}>
            <OnchainKitProvider chain={base}>
              <TestComponent />
            </OnchainKitProvider>
          </QueryClientProvider>
        </WagmiProvider>,
      );
    }).not.toThrow();
  });

  it('should call setOnchainKitConfig with the correct values', async () => {
    render(
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider chain={base} schemaId={schemaId} apiKey={apiKey}>
            <TestComponent />
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    expect(setOnchainKitConfig).toHaveBeenCalledWith({
      address: null,
      apiKey,
      config: {
        appearance: {
          logo: appLogo,
          name: appName,
          mode: 'auto',
          theme: 'default',
        },
        paymaster: paymasterUrl,
      },
      chain: base,
      rpcUrl: null,
      schemaId,
      projectId: null,
    });
  });

  it('should use default values for config when not provided', async () => {
    render(
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider chain={base} schemaId={schemaId}>
            <TestComponent />
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await waitFor(() => {
      expect(setOnchainKitConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          config: {
            appearance: {
              logo: appLogo,
              name: appName,
              mode: 'auto',
              theme: 'default',
            },
            paymaster: null,
          },
        }),
      );
    });
  });

  it('should use default values for appearance when config is provided', async () => {
    const customConfig = {
      appearance: {},
    };

    render(
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            chain={base}
            apiKey={apiKey}
            config={customConfig}
          >
            <TestComponent />
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await waitFor(() => {
      expect(setOnchainKitConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          address: null,
          apiKey: apiKey,
          chain: base,
          config: {
            appearance: {
              logo: appLogo,
              name: appName,
              mode: 'auto',
              theme: 'default',
            },
            paymaster: paymasterUrl,
          },
          projectId: null,
          rpcUrl: null,
          schemaId: COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
        }),
      );
    });
  });

  it('should use custom values when override in config is provided', async () => {
    const customConfig = {
      appearance: {
        name: 'custom name',
        logo: 'https://example.com/logo.png',
      },
      paymaster: 'https://example.com',
    };

    render(
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            chain={base}
            schemaId={schemaId}
            apiKey={apiKey}
            config={customConfig}
          >
            <TestComponent />
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await waitFor(() => {
      expect(setOnchainKitConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          address: null,
          apiKey: apiKey,
          chain: base,
          config: {
            appearance: {
              name: 'custom name',
              logo: 'https://example.com/logo.png',
              mode: 'auto',
              theme: 'default',
            },
            paymaster: 'https://example.com',
          },
          projectId: null,
          rpcUrl: null,
          schemaId: schemaId,
        }),
      );
    });
  });
});
