import { usePortfolioTokenBalances } from '@/core-react/wallet/hooks/usePortfolioTokenBalances';
import { render, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import {
  WalletIslandProvider,
  useWalletIslandContext,
} from './WalletIslandProvider';
import { useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('../../core-react/wallet/hooks/usePortfolioTokenBalances', () => ({
  usePortfolioTokenBalances: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('useWalletIslandContext', () => {
  const mockUseAccount = useAccount as ReturnType<typeof vi.fn>;
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const defaultWalletContext = {
    address: '0x123',
    isClosing: false,
  };

  const mockUsePortfolioTokenBalances = usePortfolioTokenBalances as ReturnType<
    typeof vi.fn
  >;

  beforeEach(() => {
    mockUseAccount.mockReturnValue({
      address: '0x123',
    });
    mockUseWalletContext.mockReturnValue(defaultWalletContext);
    mockUsePortfolioTokenBalances.mockReturnValue({
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

  it('should provide wallet island context when used within provider', () => {
    const { result } = renderHook(() => useWalletIslandContext(), {
      wrapper: WalletIslandProvider,
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

  it('should throw an error when used outside of WalletIslandProvider', () => {
    const TestComponent = () => {
      useWalletIslandContext();
      return null;
    };
    // Suppress console.error for this test to avoid noisy output
    const originalError = console.error;
    console.error = vi.fn();
    expect(() => {
      render(<TestComponent />);
    }).toThrow(
      'useWalletIslandContext must be used within a WalletIslandProvider',
    );
    // Restore console.error
    console.error = originalError;
  });

  it('should call usePortfolioTokenBalances with the correct address', () => {
    mockUseWalletContext.mockReturnValue({
      address: null,
      isClosing: false,
    });

    const { rerender } = renderHook(() => useWalletIslandContext(), {
      wrapper: WalletIslandProvider,
    });

    expect(mockUsePortfolioTokenBalances).toHaveBeenCalledWith({
      address: '0x000',
    });

    mockUseWalletContext.mockReturnValue({
      address: '0x123',
      isClosing: false,
    });

    rerender();

    expect(mockUsePortfolioTokenBalances).toHaveBeenCalledWith({
      address: '0x123',
    });
  });
});
