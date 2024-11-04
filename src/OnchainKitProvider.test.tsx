import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { base } from 'viem/chains';
import { describe, expect, it, vi } from 'vitest';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { mock } from 'wagmi/connectors';
import { setOnchainKitConfig } from './OnchainKitConfig';
import { OnchainKitProvider } from './OnchainKitProvider';
import { useOnchainKit } from './useOnchainKit';

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
  const { apiKey } = useOnchainKit();
  return (
    <>
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
    projectId: null,
  },
}));

describe('OnchainKitProvider', () => {
  const apiKey = 'test-api-key';
  const paymasterUrl =
    'https://api.developer.coinbase.com/rpc/v1/base/test-api-key';
  const appLogo = undefined;
  const appName = undefined;

  it('provides the context value correctly', async () => {
    render(
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider chain={base} apiKey={apiKey}>
            <TestComponent />
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(apiKey)).toBeInTheDocument();
    });
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
          <OnchainKitProvider chain={base} apiKey={apiKey}>
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
      projectId: null,
    });
  });

  it('should use default values for config when not provided', async () => {
    render(
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider chain={base}>
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
        }),
      );
    });
  });
});
