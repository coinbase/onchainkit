import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { baseSepolia } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, WagmiProvider, createConfig, mock, useAccount } from 'wagmi';
import { EarnProvider, useEarnContext } from './EarnProvider';

const queryClient = new QueryClient();

const mockConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    mock({
      accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={mockConfig}>
    <QueryClientProvider client={queryClient}>
      <EarnProvider vaultAddress="0x123">{children}</EarnProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

vi.mock('@/wallet/hooks/useGetTokenBalance', () => ({
  useGetTokenBalance: vi.fn(),
}));

vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
    useConfig: vi.fn(),
  };
});

describe('EarnProvider', () => {
  beforeEach(() => {
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });
    (useGetTokenBalance as Mock).mockReturnValue({
      convertedBalance: '0.0',
      error: null,
    });
  });

  it('throws an error when vaultAddress is not provided', () => {
    expect(() =>
      renderHook(() => useEarnContext(), {
        wrapper: ({ children }) => (
          // @ts-expect-error - vaultAddress is not provided
          <EarnProvider vaultAddress={undefined}>{children}</EarnProvider>
        ),
      }),
    ).toThrow('vaultAddress is required');
  });

  it('provides vault address through context', () => {
    const { result } = renderHook(() => useEarnContext(), { wrapper });

    expect(result.current.vaultAddress).toBe('0x123');
  });

  it('throws error when useEarnContext is used outside of provider', () => {
    expect(() => renderHook(() => useEarnContext())).toThrow(
      'useEarnContext must be used within an EarnProvider',
    );
  });
});
