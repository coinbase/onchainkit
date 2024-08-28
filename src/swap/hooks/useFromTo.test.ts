import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useValue } from '../../internal/hooks/useValue';
import { USDC_TOKEN } from '../mocks';
import { useFromTo } from './useFromTo';
import { useSwapBalances } from './useSwapBalances';

vi.mock('./useSwapBalances', () => ({
  useSwapBalances: vi.fn(),
}));

vi.mock('../../internal/hooks/useValue', () => ({
  useValue: vi.fn(),
}));

describe('useFromTo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct values', () => {
    (useSwapBalances as vi.Mock).mockReturnValue({
      fromBalanceString: '100',
      fromTokenBalanceError: null,
      toBalanceString: '200',
      toTokenBalanceError: null,
      fromTokenResponse: { refetch: vi.fn() },
      toTokenResponse: { refetch: vi.fn() },
    });

    (useValue as vi.Mock).mockImplementation((props) => ({
      ...props,
      amount: '100',
      setAmount: vi.fn(),
      token: USDC_TOKEN,
      setToken: vi.fn(),
      setLoading: vi.fn(),
      response: props.response,
    }));

    const { result } = renderHook(() => useFromTo('0x123'));

    expect(result.current.from).toEqual({
      balance: '100',
      amount: '100',
      setAmount: expect.any(Function),
      token: USDC_TOKEN,
      setToken: expect.any(Function),
      loading: false,
      setLoading: expect.any(Function),
      error: null,
      response: { refetch: expect.any(Function) },
    });

    expect(result.current.to).toEqual({
      balance: '200',
      amount: '100',
      setAmount: expect.any(Function),
      token: USDC_TOKEN,
      setToken: expect.any(Function),
      loading: false,
      setLoading: expect.any(Function),
      error: null,
      response: { refetch: expect.any(Function) },
    });
  });

  it('should call fromTokenResponse.refetch when from.response.refetch is called', async () => {
    const mockFromRefetch = vi.fn().mockResolvedValue(undefined);
    const mockToRefetch = vi.fn().mockResolvedValue(undefined);
    (useSwapBalances as vi.Mock).mockReturnValue({
      fromTokenResponse: { refetch: mockFromRefetch },
      toTokenResponse: { refetch: mockToRefetch },
    });
    (useValue as vi.Mock).mockImplementation((props) => ({
      ...props,
      response: props.response,
    }));
    const { result } = renderHook(() => useFromTo('0x123'));
    await act(async () => {
      await result.current.from.response?.refetch();
    });
    expect(mockFromRefetch).toHaveBeenCalledTimes(1);
    expect(mockToRefetch).not.toHaveBeenCalled();
  });

  it('should call toTokenResponse.refetch when to.response.refetch is called', async () => {
    const mockFromRefetch = vi.fn().mockResolvedValue(undefined);
    const mockToRefetch = vi.fn().mockResolvedValue(undefined);
    (useSwapBalances as vi.Mock).mockReturnValue({
      fromTokenResponse: { refetch: mockFromRefetch },
      toTokenResponse: { refetch: mockToRefetch },
    });
    (useValue as vi.Mock).mockImplementation((props) => ({
      ...props,
      response: props.response,
    }));
    const { result } = renderHook(() => useFromTo('0x123'));
    await act(async () => {
      await result.current.to.response?.refetch();
    });
    expect(mockToRefetch).toHaveBeenCalledTimes(1);
    expect(mockFromRefetch).not.toHaveBeenCalled();
  });
});
