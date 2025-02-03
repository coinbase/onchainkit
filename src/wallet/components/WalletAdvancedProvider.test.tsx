import { RequestContext } from '@/core/network/constants';
import { usePortfolio } from '@/wallet/hooks/usePortfolio';
import { render, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import {
  WalletAdvancedProvider,
  useWalletAdvancedContext,
} from './WalletAdvancedProvider';
import { useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/wallet/hooks/usePortfolio', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('useWalletAdvancedContext', () => {
  const mockUseAccount = useAccount as ReturnType<typeof vi.fn>;
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const defaultWalletContext = {
    address: '0x123',
    isSubComponentClosing: false,
  };

  const mockUsePortfolio = usePortfolio as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUseAccount.mockReturnValue({
      address: '0x123',
    });
    mockUseWalletContext.mockReturnValue(defaultWalletContext);
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

  it('should provide wallet advanced context when used within provider', () => {
    const { result } = renderHook(() => useWalletAdvancedContext(), {
      wrapper: WalletAdvancedProvider,
    });

    expect(result.current).toEqual({
      showSwap: false,
      setShowSwap: expect.any(Function),
      isSwapClosing: false,
      setIsSwapClosing: expect.any(Function),
      showQr: false,
      setShowQr: expect.any(Function),
      isQrClosing: false,
      setIsQrClosing: expect.any(Function),
      tokenBalances: expect.any(Array),
      portfolioFiatValue: expect.any(Number),
      refetchPortfolioData: expect.any(Function),
      isFetchingPortfolioData: false,
      portfolioDataUpdatedAt: expect.any(Date),
      animations: {
        container: expect.any(String),
        content: expect.any(String),
      },
    });
  });

  it('should throw an error when used outside of WalletAdvancedProvider', () => {
    const TestComponent = () => {
      useWalletAdvancedContext();
      return null;
    };
    // Suppress console.error for this test to avoid noisy output
    const originalError = console.error;
    console.error = vi.fn();
    expect(() => {
      render(<TestComponent />);
    }).toThrow(
      'useWalletAdvancedContext must be used within a WalletAdvancedProvider',
    );
    // Restore console.error
    console.error = originalError;
  });

  it('should call usePortfolio with the correct address', () => {
    mockUseWalletContext.mockReturnValue({
      address: null,
      isSubComponentClosing: false,
    });

    const { rerender } = renderHook(() => useWalletAdvancedContext(), {
      wrapper: WalletAdvancedProvider,
    });

    expect(mockUsePortfolio).toHaveBeenCalledWith(
      {
        address: null,
      },
      RequestContext.Wallet,
    );

    mockUseWalletContext.mockReturnValue({
      address: '0x123',
      isSubComponentClosing: false,
    });

    rerender();

    expect(mockUsePortfolio).toHaveBeenCalledWith(
      {
        address: '0x123',
      },
      RequestContext.Wallet,
    );
  });

  describe('getAnimations', () => {
    it('should return closing animations with top slide when isSubComponentClosing is true and showSubComponentAbove is false', () => {
      mockUseWalletContext.mockReturnValue({
        address: '0x123',
        isSubComponentClosing: true,
        showSubComponentAbove: false,
      });

      const { result } = renderHook(() => useWalletAdvancedContext(), {
        wrapper: WalletAdvancedProvider,
      });

      expect(result.current.animations).toEqual({
        container:
          'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out',
        content: '',
      });
    });

    it('should return closing animations with bottom slide when isSubComponentClosing is true and showSubComponentAbove is true', () => {
      mockUseWalletContext.mockReturnValue({
        address: '0x123',
        isSubComponentClosing: true,
        showSubComponentAbove: true,
      });

      const { result } = renderHook(() => useWalletAdvancedContext(), {
        wrapper: WalletAdvancedProvider,
      });

      expect(result.current.animations).toEqual({
        container:
          'fade-out slide-out-to-bottom-1.5 animate-out fill-mode-forwards ease-in-out',
        content: '',
      });
    });

    it('should return opening animations with top slide when isSubComponentClosing is false and showSubComponentAbove is false', () => {
      mockUseWalletContext.mockReturnValue({
        address: '0x123',
        isSubComponentClosing: false,
        showSubComponentAbove: false,
      });

      const { result } = renderHook(() => useWalletAdvancedContext(), {
        wrapper: WalletAdvancedProvider,
      });

      expect(result.current.animations).toEqual({
        container:
          'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
        content:
          'fade-in slide-in-from-top-2.5 animate-in fill-mode-forwards duration-300 ease-out',
      });
    });

    it('should return opening animations with bottom slide when isSubComponentClosing is false and showSubComponentAbove is true', () => {
      mockUseWalletContext.mockReturnValue({
        address: '0x123',
        isSubComponentClosing: false,
        showSubComponentAbove: true,
      });

      const { result } = renderHook(() => useWalletAdvancedContext(), {
        wrapper: WalletAdvancedProvider,
      });

      expect(result.current.animations).toEqual({
        container:
          'fade-in slide-in-from-bottom-1.5 animate-in duration-300 ease-out',
        content:
          'fade-in slide-in-from-bottom-2.5 animate-in fill-mode-forwards duration-300 ease-out',
      });
    });
  });
});
