import { renderHook } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { useGetETHBalance } from '../../wallet/hooks/useGetETHBalance';
import { useGetTokenBalance } from '../../wallet/hooks/useGetTokenBalance';
import { ETH_TOKEN, USDC_TOKEN } from '../mocks';
import { useSwapBalances } from './useSwapBalances';

vi.mock('../../wallet/hooks/useGetETHBalance', () => ({
  useGetETHBalance: vi.fn(),
}));

vi.mock('../../wallet/hooks/useGetTokenBalance', () => ({
  useGetTokenBalance: vi.fn(),
}));

describe('useSwapBalances', () => {
  const address: Address = '0x123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns ETH balance when fromToken is ETH', () => {
    (useGetETHBalance as Mock).mockReturnValue({
      convertedBalance: '10.0',
      error: null,
    });
    (useGetTokenBalance as Mock).mockReturnValue({
      convertedBalance: '0.0',
      error: null,
    });
    const { result } = renderHook(() =>
      useSwapBalances({ address, fromToken: ETH_TOKEN, toToken: USDC_TOKEN }),
    );
    expect(result.current.fromBalanceString).toBe('10.0');
    expect(result.current.fromTokenBalanceError).toBe(null);
  });

  it('returns USDC balance when toToken is USDC', () => {
    (useGetETHBalance as Mock).mockReturnValue({
      convertedBalance: '0.0',
      error: null,
    });
    (useGetTokenBalance as Mock).mockReturnValue({
      convertedBalance: '1000.0',
      error: null,
    });
    const { result } = renderHook(() =>
      useSwapBalances({ address, toToken: USDC_TOKEN }),
    );
    expect(result.current.toBalanceString).toBe('1000.0');
    expect(result.current.toTokenBalanceError).toBe(null);
  });

  it('handles ETH balance error', () => {
    (useGetETHBalance as Mock).mockReturnValue({
      convertedBalance: '0.0',
      error: 'ETH balance error',
    });
    (useGetTokenBalance as Mock).mockReturnValue({
      convertedBalance: '5.0',
      error: null,
    });
    const { result } = renderHook(() =>
      useSwapBalances({ address, fromToken: ETH_TOKEN, toToken: USDC_TOKEN }),
    );
    expect(result.current.fromTokenBalanceError).toBe('ETH balance error');
  });

  it('handles USDC balance error', () => {
    (useGetETHBalance as Mock).mockReturnValue({
      convertedBalance: '10.0',
      error: null,
    });
    (useGetTokenBalance as Mock).mockReturnValue({
      convertedBalance: '0.0',
      error: 'USDC balance error',
    });
    const { result } = renderHook(() =>
      useSwapBalances({ address, toToken: USDC_TOKEN }),
    );
    expect(result.current.toTokenBalanceError).toBe('USDC balance error');
  });
});
