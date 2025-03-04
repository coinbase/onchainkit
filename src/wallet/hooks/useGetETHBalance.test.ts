/**
 * @vitest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useBalance } from 'wagmi';
import { useGetETHBalance } from './useGetETHBalance';

vi.mock('wagmi', () => {
  return {
    useBalance: vi.fn(),
    useReadContract: vi.fn(),
  };
});

const mockEthBalanceResponse = {
  data: {
    decimals: 18,
    formatted: '0.0002851826238227',
    symbol: 'ETH',
    value: 285182623822700n,
  },
};
const mockZeroEthBalanceResponse = {
  data: {
    decimals: 18,
    formatted: '0',
    symbol: 'ETH',
    value: 0n,
  },
};
const mockErrorResponse = {
  error: {
    message: 'Error occurred',
  },
};
const mockAddress = '0x123';

describe('useGetETHBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return converted and rounded balance without error', () => {
    (useBalance as Mock).mockReturnValue(mockEthBalanceResponse);
    const { result } = renderHook(() => useGetETHBalance(mockAddress));
    expect(result.current.convertedBalance).toBe('0.0002851826238227');
    expect(result.current.roundedBalance).toBe('0.00028518');
    expect(result.current.error).toBeUndefined();
    expect(result.current.response).toEqual(mockEthBalanceResponse);
  });

  it('should return an error when useBalance returns an error', () => {
    (useBalance as Mock).mockReturnValue(mockErrorResponse);
    const { result } = renderHook(() => useGetETHBalance(mockAddress));
    expect(result.current.convertedBalance).toBe('');
    expect(result.current.roundedBalance).toBe('');
    expect(result.current.error).toEqual({
      error: mockErrorResponse.error.message,
      code: 'SWAP_BALANCE_ERROR',
      message: '',
    });
    expect(result.current.response).toEqual(mockErrorResponse);
  });

  it('should return zero balance when balance value is 0n', () => {
    (useBalance as Mock).mockReturnValue(mockZeroEthBalanceResponse);
    const { result } = renderHook(() => useGetETHBalance(mockAddress));
    expect(result.current.convertedBalance).toBe('0');
    expect(result.current.roundedBalance).toBe('0');
    expect(result.current.error).toBeUndefined();
    expect(result.current.response).toEqual(mockZeroEthBalanceResponse);
  });

  it('should return empty balance when balance value is not present', () => {
    (useBalance as Mock).mockReturnValue({
      data: { value: null },
      error: null,
    });
    const { result } = renderHook(() => useGetETHBalance(mockAddress));
    expect(result.current.convertedBalance).toBe('');
    expect(result.current.roundedBalance).toBe('');
    expect(result.current.error).toBeUndefined();
    expect(result.current.response).toEqual({
      data: { value: null },
      error: null,
    });
  });
});
