import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { WalletProvider, useWalletContext } from '../WalletProvider';
import {
  WalletIslandProvider,
  useWalletIslandContext,
} from './WalletIslandProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('../WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }) => <>{children}</>,
}));

describe('useWalletIslandContext', () => {
  const mockUseAccount = useAccount as ReturnType<typeof vi.fn>;
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const defaultWalletContext = {
    address: '0x123',
    isClosing: false,
  };

  beforeEach(() => {
    mockUseAccount.mockReturnValue({
      address: '0x123',
    });
    mockUseWalletContext.mockReturnValue(defaultWalletContext);
  });

  it('should provide wallet island context', () => {
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
      tokenHoldings: expect.any(Array),
      animationClasses: {
        content: expect.any(String),
        qr: expect.any(String),
        swap: expect.any(String),
        walletActions: expect.any(String),
        addressDetails: expect.any(String),
        transactionActions: expect.any(String),
        tokenHoldings: expect.any(String),
      },
      setHasContentAnimated: expect.any(Function),
    });
  });

  describe('animation classes', () => {
    it('should show slide out animations when QR is closing', async () => {
      const { result } = renderHook(() => useWalletIslandContext(), {
        wrapper: WalletIslandProvider,
      });

      await act(async () => {
        result.current.setIsQrClosing(true);
      });

      expect(result.current.animationClasses).toEqual({
        content: '',
        qr: 'animate-slideOutToLeft',
        swap: 'animate-slideOutToLeft',
        walletActions: 'animate-slideInFromRight',
        addressDetails: 'animate-slideInFromRight',
        transactionActions: 'animate-slideInFromRight',
        tokenHoldings: 'animate-slideInFromRight',
      });
    });

    it('should show slide out animations when Swap is closing', async () => {
      const { result } = renderHook(() => useWalletIslandContext(), {
        wrapper: WalletIslandProvider,
      });

      await act(async () => {
        result.current.setIsSwapClosing(true);
      });

      expect(result.current.animationClasses).toEqual({
        content: '',
        qr: 'animate-slideOutToLeft',
        swap: 'animate-slideOutToLeft',
        walletActions: 'animate-slideInFromRight',
        addressDetails: 'animate-slideInFromRight',
        transactionActions: 'animate-slideInFromRight',
        tokenHoldings: 'animate-slideInFromRight',
      });
    });

    it('should show wallet container out animation when closing', async () => {
      mockUseAccount.mockReturnValue({
        address: '0x123',
      });
      mockUseWalletContext.mockReturnValue({
        ...defaultWalletContext,
        isClosing: true,
      });

      const { result } = renderHook(() => useWalletIslandContext(), {
        wrapper: ({ children }) => (
          <WalletProvider>
            <WalletIslandProvider>{children}</WalletIslandProvider>
          </WalletProvider>
        ),
      });

      expect(result.current.animationClasses.content).toBe(
        'animate-walletIslandContainerOut',
      );
    });

    it('should show default animations when not closing', () => {
      const { result } = renderHook(() => useWalletIslandContext(), {
        wrapper: WalletIslandProvider,
      });

      expect(result.current.animationClasses).toEqual({
        content: 'animate-walletIslandContainerIn',
        qr: 'animate-slideInFromLeft',
        swap: 'animate-slideInFromRight',
        walletActions: 'animate-walletIslandContainerItem1',
        addressDetails: 'animate-walletIslandContainerItem2',
        transactionActions: 'animate-walletIslandContainerItem3',
        tokenHoldings: 'animate-walletIslandContainerItem4',
      });
    });
  });
});
