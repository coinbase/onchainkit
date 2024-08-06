import { renderHook } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import type { Token } from '../../token';
import { useGetETHBalance } from '../../wallet/hooks/useGetETHBalance';
import { useGetTokenBalance } from '../../wallet/hooks/useGetTokenBalance';
import { useSwapBalances } from './useSwapBalances';

vi.mock('../../wallet/hooks/useGetETHBalance', () => ({
  useGetETHBalance: vi.fn(),
}));

vi.mock('../../wallet/hooks/useGetTokenBalance', () => ({
  useGetTokenBalance: vi.fn(),
}));

describe('useSwapBalances', () => {
  const address: Address = '0x123';

  const ethToken: Token = {
    name: 'ETH',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image: 'test.png',
    chainId: 8453,
  };

  const usdcToken: Token = {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image: 'test.png',
    chainId: 8453,
  };

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
      useSwapBalances({ address, fromToken: ethToken, toToken: usdcToken }),
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
      useSwapBalances({ address, toToken: usdcToken }),
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
      useSwapBalances({ address, fromToken: ethToken, toToken: usdcToken }),
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
      useSwapBalances({ address, toToken: usdcToken }),
    );

    expect(result.current.toTokenBalanceError).toBe('USDC balance error');
  });
});
