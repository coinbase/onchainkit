import { renderHook } from '@testing-library/react';
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

vi.mock('./WalletProvider', () => ({
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
    });
  });
});
