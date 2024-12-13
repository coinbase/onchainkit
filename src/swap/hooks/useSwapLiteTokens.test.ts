import { act, renderHook } from '@testing-library/react';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useValue } from '../../core-react/internal/hooks/useValue';
import type { Token } from '../../token';
import { useSwapBalances } from './useSwapBalances';
import { useSwapLiteTokens } from './useSwapLiteTokens';
import { useSwapLiteToken } from './useSwapLiteToken';
import {
  daiToken,
  degenToken,
  ethToken,
  usdcToken,
} from '../../token/constants';

vi.mock('./useSwapLiteToken');
vi.mock('./useSwapBalances');
vi.mock('../../core-react/internal/hooks/useValue');

const toToken: Token = {
  name: 'DEGEN',
  address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
  symbol: 'DEGEN',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
  chainId: base.id,
};

const mockFromETH = {
  balance: '100',
  balanceResponse: { refetch: vi.fn() },
  error: null,
  loading: false,
  setAmount: vi.fn(),
  setAmountUSD: vi.fn(),
  setLoading: vi.fn(),
  token: ethToken,
};

const mockFromUSDC = {
  balance: '50',
  balanceResponse: { refetch: vi.fn() },
  error: null,
  loading: false,
  setAmount: vi.fn(),
  setAmountUSD: vi.fn(),
  setLoading: vi.fn(),
  token: usdcToken,
};

const mockFrom = {
  balance: '50',
  balanceResponse: { refetch: vi.fn() },
  error: null,
  loading: false,
  setAmount: vi.fn(),
  setAmountUSD: vi.fn(),
  setLoading: vi.fn(),
  token: degenToken,
};

const mockTo = {
  balance: '1000',
  balanceResponse: { refetch: vi.fn() },
  error: null,
  loading: false,
  setAmount: vi.fn(),
  setAmountUSD: vi.fn(),
  setLoading: vi.fn(),
  token: daiToken,
};

const address = '0x123';

describe('useSwapLiteTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSwapLiteToken as Mock).mockImplementation((toToken, fromToken) => {
      if (fromToken === ethToken) return mockFromETH;
      if (fromToken === usdcToken) return mockFromUSDC;
      return mockFrom;
    });

    (useSwapBalances as Mock).mockReturnValue({
      toBalanceString: '1000',
      toTokenBalanceError: null,
      toTokenResponse: { balance: '1000' },
    });

    (useValue as Mock).mockReturnValue(mockTo);
  });

  it('should return expected swap tokens', () => {
    const { result } = renderHook(() =>
      useSwapLiteTokens(toToken, daiToken, address),
    );

    expect(useSwapLiteToken).toHaveBeenCalledWith(toToken, ethToken, address);
    expect(useSwapLiteToken).toHaveBeenCalledWith(toToken, usdcToken, address);
    expect(useSwapLiteToken).toHaveBeenCalledWith(toToken, daiToken, address);
    expect(useSwapBalances).toHaveBeenCalledWith({
      address,
      fromToken: ethToken,
      toToken,
    });
    expect(useValue).toHaveBeenCalledWith({
      balance: '1000',
      balanceResponse: { balance: '1000' },
      amount: '',
      setAmount: expect.any(Function),
      amountUSD: '',
      setAmountUSD: expect.any(Function),
      token: toToken,
      loading: false,
      setLoading: expect.any(Function),
      error: null,
    });

    expect(result.current).toEqual({
      fromETH: mockFromETH,
      fromUSDC: mockFromUSDC,
      from: mockFrom,
      to: mockTo,
    });
  });

  it('should handle toToken.symbol === ETH', () => {
    renderHook(() => useSwapLiteTokens(ethToken, degenToken, address));

    expect(useSwapBalances).toHaveBeenCalledWith({
      address,
      fromToken: usdcToken,
      toToken: ethToken,
    });
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
