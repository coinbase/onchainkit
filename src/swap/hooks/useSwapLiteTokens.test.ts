import { act, renderHook } from '@testing-library/react';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useValue } from '../../core-react/internal/hooks/useValue';
import type { Token } from '../../token';
import { USDC_TOKEN } from '../mocks';
import { useSwapLiteTokens } from './useSwapLiteTokens';
import { useSwapBalances } from './useSwapBalances';

vi.mock('./useSwapBalances', () => ({
  useSwapBalances: vi.fn(),
}));

vi.mock('../../core-react/internal/hooks/useValue', () => ({
  useValue: vi.fn(),
}));

const toToken: Token = {
  name: 'DEGEN',
  address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
  symbol: 'DEGEN',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
  chainId: base.id,
};

const daiToken: Token = {
  name: 'DAI',
  address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  symbol: 'DAI',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/92/13/9213e31b84c98a693f4c624580fdbe6e4c1cb550efbba15aa9ea68fd25ffb90c-ZTE1NmNjMGUtZGVkYi00ZDliLWI2N2QtNTY2ZWRjMmYwZmMw',
  chainId: base.id,
};

describe('useSwapLiteTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct values', () => {
    (useSwapBalances as Mock).mockReturnValue({
      fromBalanceString: '100',
      fromTokenBalanceError: null,
      fromTokenResponse: { refetch: vi.fn() },
      toBalanceString: '200',
      toTokenBalanceError: null,
      toTokenResponse: { refetch: vi.fn() },
    });
    (useValue as Mock).mockImplementation((props) => ({
      ...props,
      amount: '100',
      amountUSD: '150',
      response: props.response,
      setAmount: vi.fn(),
      setAmountUSD: vi.fn(),
      setLoading: vi.fn(),
      token: USDC_TOKEN,
    }));
    const { result } = renderHook(() =>
      useSwapLiteTokens(toToken, undefined, '0x123'),
    );
    expect(result.current.fromETH).toEqual({
      amount: '100',
      amountUSD: '150',
      balance: '100',
      balanceResponse: { refetch: expect.any(Function) },
      error: null,
      loading: false,
      setAmount: expect.any(Function),
      setAmountUSD: expect.any(Function),
      setLoading: expect.any(Function),
      token: USDC_TOKEN,
    });
    expect(result.current.to).toEqual({
      amount: '100',
      amountUSD: '150',
      balance: '200',
      balanceResponse: { refetch: expect.any(Function) },
      error: null,
      loading: false,
      setAmount: expect.any(Function),
      setAmountUSD: expect.any(Function),
      setLoading: expect.any(Function),
      token: USDC_TOKEN,
    });
  });

  it('should call fromTokenResponse.refetch when fromETH.response.refetch is called', async () => {
    const mockFromRefetch = vi.fn().mockResolvedValue(undefined);
    const mockToRefetch = vi.fn().mockResolvedValue(undefined);
    (useSwapBalances as Mock).mockReturnValue({
      fromTokenResponse: { refetch: mockFromRefetch },
      toTokenResponse: { refetch: mockToRefetch },
    });
    (useValue as Mock).mockImplementation((props) => ({
      ...props,
      response: props.response,
    }));
    const { result } = renderHook(() =>
      useSwapLiteTokens(toToken, undefined, '0x123'),
    );
    await act(async () => {
      await result.current.fromETH.balanceResponse?.refetch();
    });
    expect(mockFromRefetch).toHaveBeenCalledTimes(1);
    expect(mockToRefetch).not.toHaveBeenCalled();
  });

  it('should call toTokenResponse.refetch when to.response.refetch is called', async () => {
    const mockFromRefetch = vi.fn().mockResolvedValue(undefined);
    const mockToRefetch = vi.fn().mockResolvedValue(undefined);
    (useSwapBalances as Mock).mockReturnValue({
      fromTokenResponse: { refetch: mockFromRefetch },
      toTokenResponse: { refetch: mockToRefetch },
    });
    (useValue as Mock).mockImplementation((props) => ({
      ...props,
      response: props.response,
    }));
    const { result } = renderHook(() =>
      useSwapLiteTokens(toToken, undefined, '0x123'),
    );
    await act(async () => {
      await result.current.to.balanceResponse?.refetch();
    });
    expect(mockToRefetch).toHaveBeenCalledTimes(1);
    expect(mockFromRefetch).not.toHaveBeenCalled();
  });
});
