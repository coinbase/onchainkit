import '@testing-library/jest-dom';
import { useBreakpoints } from '@/internal/hooks/useBreakpoints';
import { usePortfolio } from '@/wallet/hooks/usePortfolio';
import { act, render, renderHook } from '@testing-library/react';
import { useEffect } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { type Config, WagmiProvider } from 'wagmi';
import { WalletProvider, useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn().mockReturnValue({ address: null }),
  WagmiProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@/internal/hooks/useBreakpoints', () => ({
  useBreakpoints: vi.fn(),
}));

vi.mock('@/wallet/hooks/usePortfolio', () => ({
  usePortfolio: vi.fn(),
}));

describe('useWalletContext', () => {
  const mockUseBreakpoints = useBreakpoints as Mock;
  const mockUsePortfolio = usePortfolio as ReturnType<typeof vi.fn>;
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBreakpoints.mockReturnValue('md');
    mockUsePortfolio.mockReturnValue({
      data: {
        address: '0x123',
        tokenBalances: [],
        portfolioBalanceInUsd: 0,
      },
      refetch: vi.fn(),
      isFetching: false,
      dataUpdatedAt: new Date(),
    });
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
    expect(result.current.isSubComponentOpen).toEqual(false);
    expect(result.current.address).toEqual(null);
    expect(result.current.isSubComponentClosing).toEqual(false);
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

    expect(result.current.isSubComponentClosing).toBe(false);
    expect(result.current.isSubComponentOpen).toBe(false);
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
      result.current.setIsSubComponentOpen(true);
    });

    // Then close it
    act(() => {
      result.current.handleClose();
    });

    // Verify states
    expect(result.current.isSubComponentOpen).toBe(true);
    expect(result.current.isSubComponentClosing).toBe(true);
  });

  it('should keep alignSubComponentRight default value when there is enough space on the right', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    const mockRef = {
      getBoundingClientRect: () => ({
        bottom: 100,
        left: 100,
        right: 200,
        top: 0,
        width: 100,
        height: 100,
      }),
    };

    const TestComponent = () => {
      const { connectRef, setIsSubComponentOpen } = useWalletContext();
      useEffect(() => {
        // @ts-expect-error - Assigning to read-only ref property for testing
        connectRef.current = mockRef;
        setIsSubComponentOpen(true);
      }, [connectRef, setIsSubComponentOpen]);
      return null;
    };

    const { result } = renderHook(() => useWalletContext(), {
      wrapper: ({ children }) => (
        <WalletProvider>
          <TestComponent />
          {children}
        </WalletProvider>
      ),
    });

    expect(result.current.alignSubComponentRight).toBe(false);
  });

  it('should set alignSubComponentRight to true when there is not enough space on the right', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const mockRef = {
      getBoundingClientRect: () => ({
        bottom: 100,
        left: 400,
        right: 500,
        top: 0,
        width: 100,
        height: 100,
      }),
    };

    const TestComponent = () => {
      const { connectRef, setIsSubComponentOpen } = useWalletContext();
      useEffect(() => {
        // @ts-expect-error - Assigning to read-only ref property for testing
        connectRef.current = mockRef;
        setIsSubComponentOpen(true);
      }, [connectRef, setIsSubComponentOpen]);
      return null;
    };

    const { result } = renderHook(() => useWalletContext(), {
      wrapper: ({ children }) => (
        <WalletProvider>
          <TestComponent />
          {children}
        </WalletProvider>
      ),
    });

    expect(result.current.alignSubComponentRight).toBe(true);
  });

  it('should keep showSubComponentAbove default value when there is enough space below', () => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    const mockRef = {
      getBoundingClientRect: () => ({
        bottom: 100,
        left: 100,
        right: 200,
        top: 0,
        width: 100,
        height: 100,
      }),
    };

    const TestComponent = () => {
      const { connectRef, setIsSubComponentOpen } = useWalletContext();
      useEffect(() => {
        // @ts-expect-error - Assigning to read-only ref property for testing
        connectRef.current = mockRef;
        setIsSubComponentOpen(true);
      }, [connectRef, setIsSubComponentOpen]);
      return null;
    };

    const { result } = renderHook(() => useWalletContext(), {
      wrapper: ({ children }) => (
        <WalletProvider>
          <TestComponent />
          {children}
        </WalletProvider>
      ),
    });

    expect(result.current.showSubComponentAbove).toBe(false);
  });

  it('should set showSubComponentAbove to true when there is not enough space below', () => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const mockRef = {
      getBoundingClientRect: () => ({
        bottom: 200,
        left: 100,
        right: 200,
        top: 100,
        width: 100,
        height: 100,
      }),
    };

    const TestComponent = () => {
      const { connectRef, setIsSubComponentOpen } = useWalletContext();
      useEffect(() => {
        // @ts-expect-error - Assigning to read-only ref property for testing
        connectRef.current = mockRef;
        setIsSubComponentOpen(true);
      }, [connectRef, setIsSubComponentOpen]);
      return null;
    };

    const { result } = renderHook(() => useWalletContext(), {
      wrapper: ({ children }) => (
        <WalletProvider>
          <TestComponent />
          {children}
        </WalletProvider>
      ),
    });

    expect(result.current.showSubComponentAbove).toBe(true);
  });
});
