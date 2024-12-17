import '@testing-library/jest-dom';
import { act, render, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Config, WagmiProvider } from 'wagmi';
import { WalletProvider, useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn().mockReturnValue({ address: null }),
  WagmiProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('useWalletContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return default context', () => {
    render(
      <WagmiProvider config={{} as Config}>
        <WalletProvider>
          <div />
        </WalletProvider>
      </WagmiProvider>,
    );

    const { result } = renderHook(() => useWalletContext(), {
      wrapper: ({ children }) => (
        <WagmiProvider config={{} as Config}>
          <WalletProvider>{children}</WalletProvider>
        </WagmiProvider>
      ),
    });
    expect(result.current.isOpen).toEqual(false);
    expect(result.current.address).toEqual(null);
    expect(result.current.isClosing).toEqual(false);
  });

  it('should not update visibility state if handleClose is called when wallet is not open', () => {
    const { result } = renderHook(() => useWalletContext(), {
      wrapper: ({ children }) => (
        <WagmiProvider config={{} as Config}>
          <WalletProvider>{children}</WalletProvider>
        </WagmiProvider>
      ),
    });

    render(
      <WalletProvider>
        <div>Child</div>
      </WalletProvider>,
    );

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.isClosing).toBe(false);
    expect(result.current.isOpen).toBe(false);
  });

  it('should update visibility state if handleClose is called when wallet is open', () => {
    const { result } = renderHook(() => useWalletContext(), {
      wrapper: ({ children }) => (
        <WagmiProvider config={{} as Config}>
          <WalletProvider>{children}</WalletProvider>
        </WagmiProvider>
      ),
    });

    // Open the wallet first
    act(() => {
      result.current.setIsOpen(true);
    });

    // Then close it
    act(() => {
      result.current.handleClose();
    });

    // Verify states
    expect(result.current.isOpen).toBe(true);
    expect(result.current.isClosing).toBe(true);
  });
});
