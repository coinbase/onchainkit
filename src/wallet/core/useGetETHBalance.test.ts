/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { useGetETHBalance } from './useGetETHBalance';
import { useBalance } from 'wagmi';

jest.mock('wagmi', () => {
  return {
    useBalance: jest.fn(),
    useReadContract: jest.fn(),
  };
});

const mockETHBalanceResponse = {
  data: {
    decimals: 18,
    formatted: '0.0002851826238227',
    symbol: 'ETH',
    value: 285182623822700n,
  },
};
const mockZeroETHBalanceResponse = {
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
    jest.clearAllMocks();
  });

  it('should return converted and rounded balance without error', () => {
    (require('wagmi').useBalance as jest.Mock).mockReturnValue(
      mockETHBalanceResponse,
    );
    const { result } = renderHook(() => useGetETHBalance(mockAddress));

    expect(result.current.convertedBalance).toBe('0.0002851826238227');
    expect(result.current.roundedBalance).toBe('0.00028518');
    expect(result.current.error).toBeUndefined();
    expect(result.current.response).toEqual(mockETHBalanceResponse);
  });

  it('should return an error when useBalance returns an error', () => {
    (useBalance as jest.Mock).mockReturnValue(mockErrorResponse);

    const { result } = renderHook(() => useGetETHBalance(mockAddress));

    expect(result.current.convertedBalance).toBe('');
    expect(result.current.roundedBalance).toBe('');
    expect(result.current.error).toEqual({
      error: mockErrorResponse.error.message,
      code: 'SWAP_BALANCE_ERROR',
    });
    expect(result.current.response).toEqual(mockErrorResponse);
  });

  it('should return zero balance when balance value is 0n', () => {
    (useBalance as jest.Mock).mockReturnValue(mockZeroETHBalanceResponse);

    const { result } = renderHook(() => useGetETHBalance(mockAddress));

    expect(result.current.convertedBalance).toBe('0');
    expect(result.current.roundedBalance).toBe('0');
    expect(result.current.error).toBeUndefined();
    expect(result.current.response).toEqual(mockZeroETHBalanceResponse);
  });

  it('should return empty balance when balance value is not present', () => {
    (useBalance as jest.Mock).mockReturnValue({
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
