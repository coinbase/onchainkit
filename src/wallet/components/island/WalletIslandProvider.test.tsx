import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  WalletIslandProvider,
  useWalletIslandContext,
} from './WalletIslandProvider';

describe('useWalletIslandContext', () => {
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
});
