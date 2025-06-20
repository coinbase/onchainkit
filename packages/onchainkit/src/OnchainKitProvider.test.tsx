import '@testing-library/jest-dom';
import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import type { AppConfig } from '@/core/types';
import type { EASSchemaUid } from '@/identity/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { base } from 'viem/chains';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { useConfig } from 'wagmi';
import { mock } from 'wagmi/connectors';
import { OnchainKitProvider } from './OnchainKitProvider';
import { useProviderDependencies } from './internal/hooks/useProviderDependencies';
import { useOnchainKit } from './useOnchainKit';

vi.mock('wagmi', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('wagmi');
  return {
    ...actual,
    useConfig: vi.fn(),
  };
});

vi.mock('@/internal/hooks/useProviderDependencies', () => ({
  useProviderDependencies: vi.fn(() => ({
    providedWagmiConfig: null,
    providedQueryClient: null,
  })),
}));

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    context: Promise.resolve({
      client: {
        clientFid: null,
      },
    }),
  },
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

vi.mock('@/core/OnchainKitConfig', () => ({
  setOnchainKitConfig: vi.fn(),
  ONCHAIN_KIT_CONFIG: {
    address: null,
    apiKey: null,
    chain: { name: 'base', id: 8453 },
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

    await waitFor(() => {
      expect(setOnchainKitConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          address: null,
          apiKey,
          config: {
            analytics: true,
            analyticsUrl: null,
            appearance: {
              logo: appLogo,
              name: appName,
              mode: 'auto',
              theme: 'default',
            },
            paymaster: paymasterUrl,
            wallet: {
              display: 'classic',
              preference: 'all',
              signUpEnabled: true,
              termsUrl: 'https://base.org/terms-of-service',
              privacyUrl: 'https://base.org/privacy-policy',
              supportedWallets: {
                rabby: false,
                trust: false,
                frame: false,
              },
            },
          },
          chain: base,
          rpcUrl: null,
          schemaId,
          projectId: null,
          sessionId: expect.any(String),
        }),
      );
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
            analytics: true,
            analyticsUrl: null,
            appearance: {
              logo: appLogo,
              name: appName,
              mode: 'auto',
              theme: 'default',
            },
            paymaster: null,
            wallet: {
              display: 'classic',
              preference: 'all',
              signUpEnabled: true,
              termsUrl: 'https://base.org/terms-of-service',
              privacyUrl: 'https://base.org/privacy-policy',
              supportedWallets: {
                rabby: false,
                trust: false,
                frame: false,
              },
            },
          },
        }),
      );
    });
  });

  it('should respect analytics override when provided', async () => {
    render(
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            chain={base}
            schemaId={schemaId}
            analytics={false}
          >
            <TestComponent />
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await waitFor(() => {
      expect(setOnchainKitConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({
            analytics: false,
          }),
        }),
      );
    });
  });

  it('should use custom values when override in config is provided', async () => {
    const customConfig = {
      analyticsUrl: 'https://example.com',
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
            analytics={false}
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
            analytics: false,
            analyticsUrl: 'https://example.com',
            appearance: {
              name: 'custom name',
              logo: 'https://example.com/logo.png',
              mode: 'auto',
              theme: 'default',
            },
            paymaster: 'https://example.com',
            wallet: {
              display: 'classic',
              preference: 'all',
              signUpEnabled: true,
              termsUrl: 'https://base.org/terms-of-service',
              privacyUrl: 'https://base.org/privacy-policy',
              supportedWallets: {
                rabby: false,
                trust: false,
                frame: false,
              },
            },
          },
          projectId: null,
          rpcUrl: null,
          schemaId: schemaId,
          sessionId: expect.any(String),
        }),
      );
    });
  });

  it('should set default supportedWallets configuration when not provided', async () => {
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
          config: expect.objectContaining({
            wallet: expect.objectContaining({
              supportedWallets: {
                rabby: false,
                trust: false,
                frame: false,
              },
            }),
          }),
        }),
      );
    });
  });

  it('should use custom supportedWallets configuration when provided', async () => {
    const customConfig: AppConfig = {
      wallet: {
        supportedWallets: {
          rabby: true,
          trust: true,
          frame: true,
        },
      },
    };

    render(
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            chain={base}
            schemaId={schemaId}
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
          config: expect.objectContaining({
            wallet: expect.objectContaining({
              supportedWallets: {
                rabby: true,
                trust: true,
                frame: true,
              },
            }),
          }),
        }),
      );
    });
  });

  it('should use partial supportedWallets configuration when provided', async () => {
    const customConfig: AppConfig = {
      wallet: {
        supportedWallets: {
          trust: true,
        },
      },
    };

    render(
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            chain={base}
            schemaId={schemaId}
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
          config: expect.objectContaining({
            wallet: expect.objectContaining({
              supportedWallets: expect.objectContaining({
                trust: true,
                frame: false,
                rabby: false,
              }),
            }),
          }),
          chain: expect.any(Object),
          schemaId: schemaId,
          sessionId: expect.any(String),
          address: null,
          apiKey: null,
          projectId: null,
          rpcUrl: null,
        }),
      );
    });
  });

  it('should use custom wallet config when provided', async () => {
    const customConfig: AppConfig = {
      wallet: {
        display: 'modal',
        preference: 'eoaOnly',
        signUpEnabled: false,
        termsUrl: 'https://example.com/terms',
        privacyUrl: 'https://example.com/privacy',
        supportedWallets: {
          rabby: true,
          trust: true,
          frame: true,
        },
      },
    };

    render(
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            chain={base}
            schemaId={schemaId}
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
          config: expect.objectContaining({
            wallet: {
              display: 'modal',
              preference: 'eoaOnly',
              signUpEnabled: false,
              termsUrl: 'https://example.com/terms',
              privacyUrl: 'https://example.com/privacy',
              supportedWallets: {
                rabby: true,
                trust: true,
                frame: true,
              },
            },
          }),
        }),
      );
    });
  });

  afterEach(() => {
    vi.resetModules();
  });
});
