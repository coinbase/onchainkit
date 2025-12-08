import { act, renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { useValue } from '@/internal/hooks/useValue';
import { USDC_TOKEN } from '../mocks';
import { useFromTo } from './useFromTo';
import { useSwapBalances } from './useSwapBalances';

vi.mock('./useSwapBalances', () => ({
  useSwapBalances: vi.fn(),
}));

vi.mock('@/internal/hooks/useValue', () => ({
  useValue: vi.fn(),
}));

describe('useFromTo', () => {
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
      setToken: vi.fn(),
      token: USDC_TOKEN,
    }));
    const { result } = renderHook(() => useFromTo('0x123'));
    expect(result.current.from).toEqual({
      amount: '100',
      amountUSD: '150',
      balance: '100',
      balanceResponse: { refetch: expect.any(Function) },
      error: null,
      loading: false,
      setAmount: expect.any(Function),
      setAmountUSD: expect.any(Function),
      setLoading: expect.any(Function),
      setToken: expect.any(Function),
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
      setToken: expect.any(Function),
      token: USDC_TOKEN,
    });
  });

  it('should call fromTokenResponse.refetch when from.response.refetch is called', async () => {
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
    const { result } = renderHook(() => useFromTo('0x123'));
    await act(async () => {
      await result.current.from.balanceResponse?.refetch();
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
    const { result } = renderHook(() => useFromTo('0x123'));
    await act(async () => {
      await result.current.to.balanceResponse?.refetch();
    });
    expect(mockToRefetch).toHaveBeenCalledTimes(1);
    expect(mockFromRefetch).not.toHaveBeenCalled();
  });
});
