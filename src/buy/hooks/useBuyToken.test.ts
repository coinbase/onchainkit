import { act, renderHook } from '@testing-library/react';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useValue } from '../../internal/hooks/useValue';
import { useSwapBalances } from '../../swap/hooks/useSwapBalances';
import type { Token } from '../../token';
import { usdcToken } from '../../token/constants';
import { useBuyToken } from './useBuyToken';

vi.mock('../../swap/hooks/useSwapBalances', () => ({
  useSwapBalances: vi.fn(),
}));

vi.mock('@/internal/hooks/useValue', () => ({
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

describe('useBuyToken', () => {
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
    }));
    const { result } = renderHook(() =>
      useBuyToken(toToken, usdcToken, '0x123'),
    );
    expect(result.current).toEqual({
      amount: '',
      amountUSD: '',
      balance: '100',
      balanceResponse: { refetch: expect.any(Function) },
      error: null,
      loading: false,
      setAmount: expect.any(Function),
      setAmountUSD: expect.any(Function),
      setLoading: expect.any(Function),
      token: usdcToken,
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
      useBuyToken(toToken, usdcToken, '0x123'),
    );
    await act(async () => {
      await result.current.balanceResponse?.refetch();
    });
    expect(mockFromRefetch).toHaveBeenCalledTimes(1);
    expect(mockToRefetch).not.toHaveBeenCalled();
  });
});
