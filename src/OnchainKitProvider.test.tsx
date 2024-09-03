import { act, render, screen, waitFor } from '@testing-library/react';
import { base } from 'viem/chains';
import '@testing-library/jest-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { describe, expect, it, vi } from 'vitest';
import { WagmiProvider } from 'wagmi';
import { http, createConfig } from 'wagmi';
import { mock } from 'wagmi/connectors';
import { setOnchainKitConfig } from './OnchainKitConfig';
import { OnchainKitProvider } from './OnchainKitProvider';
import type { EASSchemaUid } from './identity/types';
import { useCapabilitiesSafe } from './useCapabilitiesSafe';
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
vi.mock('./useCapabilitiesSafe');

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
    walletCapabilities: {
      paymasterServiceEnabled: false,
      atomicBatchEnabled: false,
      auxiliaryFundsEnabled: false,
    },
  },
}));
describe('OnchainKitProvider', () => {
  const schemaId: EASSchemaUid = `0x${'1'.repeat(64)}`;
  const apiKey = 'test-api-key';

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

  it('should call setOnchainKitConfig with the correct default values', async () => {
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
      chain: base,
      rpcUrl: null,
      schemaId,
      walletCapabilities: {
        paymasterServiceEnabled: false,
        atomicBatchEnabled: false,
        auxiliaryFundsEnabled: false,
      },
    });
  });

  it('should call setOnchainKitConfig when capabilities are found', async () => {
    const walletCapabilities = {
      paymasterServiceEnabled: true,
      atomicBatchEnabled: true,
      auxiliaryFundsEnabled: true,
    };
    vi.mocked(useCapabilitiesSafe).mockReturnValue(walletCapabilities);
    await act(async () => {
      render(
        <WagmiProvider config={mockConfig}>
          <QueryClientProvider client={queryClient}>
            <OnchainKitProvider
              chain={base}
              schemaId={schemaId}
              apiKey={apiKey}
            >
              <TestComponent />
            </OnchainKitProvider>
          </QueryClientProvider>
        </WagmiProvider>,
      );
    });
    expect(setOnchainKitConfig).toHaveBeenCalledWith({
      address: null,
      apiKey,
      chain: base,
      rpcUrl: null,
      schemaId,
      walletCapabilities,
    });
  });

  it('should call setOnchainKitConfig when capabilities are not found', async () => {
    const walletCapabilities = {
      paymasterServiceEnabled: false,
      atomicBatchEnabled: false,
      auxiliaryFundsEnabled: false,
    };
    vi.mocked(useCapabilitiesSafe).mockReturnValue(walletCapabilities);
    await act(async () => {
      render(
        <WagmiProvider config={mockConfig}>
          <QueryClientProvider client={queryClient}>
            <OnchainKitProvider
              chain={base}
              schemaId={schemaId}
              apiKey={apiKey}
            >
              <TestComponent />
            </OnchainKitProvider>
          </QueryClientProvider>
        </WagmiProvider>,
      );
    });
    expect(setOnchainKitConfig).toHaveBeenCalledWith({
      address: null,
      apiKey,
      chain: base,
      rpcUrl: null,
      schemaId,
      walletCapabilities,
    });
  });
});
