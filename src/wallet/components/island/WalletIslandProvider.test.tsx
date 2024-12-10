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
      showQr: false,
      setShowQr: expect.any(Function),
      tokenHoldings: expect.any(Array),
    });
  });
});
