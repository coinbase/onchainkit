import '@testing-library/jest-dom';
import { OnchainKitProvider } from '@/OnchainKitProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { Address, Chain } from 'viem';
import { baseSepolia, optimism, sepolia } from 'viem/chains';
import { describe, expect, it } from 'vitest';
import { WagmiProvider } from 'wagmi';
import { http, createConfig } from 'wagmi';
import { mock } from 'wagmi/connectors';
import { IdentityProvider, useIdentityContext } from './IdentityProvider';

const queryClient = new QueryClient();
const mockConfig = createConfig({
  chains: [sepolia],
  connectors: [
    mock({
      accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
});

describe('IdentityProvider', () => {
  it('provides context values from props', () => {
    const address: Address = '0x1234567890abcdef1234567890abcdef12345678';
    const schemaId: Address = '0xabcdefabcdefabcdefabcdefabcdefabcdef';
    const chain: Chain = baseSepolia;

    const { result } = renderHook(() => useIdentityContext(), {
      wrapper: ({ children }) => (
        <IdentityProvider address={address} schemaId={schemaId} chain={chain}>
          {children}
        </IdentityProvider>
      ),
    });
    expect(result.current.address).toEqual(address);
    expect(result.current.schemaId).toEqual(schemaId);
    expect(result.current.chain?.id).toEqual(chain.id);
  });

  it('should return default context when no props are passed', () => {
    const { result } = renderHook(() => useIdentityContext(), {
      wrapper: IdentityProvider,
    });
    expect(result.current.address).toEqual('');
    expect(result.current.schemaId).toEqual(undefined);
    expect(result.current.chain?.id).toEqual(84532); // defaults to base
  });

  it('use onchainkit context chain if provided', () => {
    const { result } = renderHook(() => useIdentityContext(), {
      wrapper: ({ children }) => (
        <WagmiProvider config={mockConfig}>
          <QueryClientProvider client={queryClient}>
            <OnchainKitProvider chain={optimism}>
              <IdentityProvider>{children}</IdentityProvider>
            </OnchainKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      ),
    });
    expect(result.current.address).toEqual('');
    expect(result.current.schemaId).toEqual(undefined);
    expect(result.current.chain?.id).toEqual(optimism.id);
  });

  it('use identity context chain over onchainkit context if both are provided', () => {
    const { result } = renderHook(() => useIdentityContext(), {
      wrapper: ({ children }) => (
        <WagmiProvider config={mockConfig}>
          <QueryClientProvider client={queryClient}>
            <OnchainKitProvider chain={optimism}>
              <IdentityProvider chain={sepolia}>{children}</IdentityProvider>
            </OnchainKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      ),
    });
    expect(result.current.address).toEqual('');
    expect(result.current.schemaId).toEqual(undefined);
    expect(result.current.chain?.id).toEqual(sepolia.id);
  });
});
