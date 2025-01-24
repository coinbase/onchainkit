import { renderHook } from '@testing-library/react';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { EarnProvider, useEarnContext } from './EarnProvider';

vi.mock('@/wallet/hooks/useGetTokenBalance', () => ({
  useGetTokenBalance: vi.fn(),
}));

vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
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

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <EarnProvider vaultAddress="0x123">{children}</EarnProvider>
  );

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
