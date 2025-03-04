/**
 * @vitest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useReadContract } from 'wagmi';
import { USDC_TOKEN } from '../../swap/mocks';
import { useGetTokenBalance } from './useGetTokenBalance';

vi.mock('wagmi', () => {
  return {
    useReadContract: vi.fn(),
  };
});

const mockTokenBalanceResponse = { data: 3304007277394n };
const mockZeroBalanceResponse = {
  data: 0n,
};
const mockErrorResponse = {
  error: {
    shortMessage: 'Error occurred',
  },
};
const mockAddress = '0x123';

describe('useGetTokenBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return converted and rounded balance without error', () => {
    (useReadContract as Mock).mockReturnValue(mockTokenBalanceResponse);
    const { result } = renderHook(() =>
      useGetTokenBalance(mockAddress, USDC_TOKEN),
    );
    expect(result.current.convertedBalance).toBe('3304007.277394');
    expect(result.current.roundedBalance).toBe('3304007.277394');
    expect(result.current.error).toBeUndefined();
    expect(result.current.response).toEqual(mockTokenBalanceResponse);
  });

  it('should return an error when useReadContract returns an error', () => {
    (useReadContract as Mock).mockReturnValue(mockErrorResponse);
    const { result } = renderHook(() =>
      useGetTokenBalance(mockAddress, USDC_TOKEN),
    );
    expect(result.current.convertedBalance).toBe('');
    expect(result.current.roundedBalance).toBe('');
    expect(result.current.error).toEqual({
      error: mockErrorResponse.error.shortMessage,
      code: 'SWAP_BALANCE_ERROR',
      message: '',
    });
    expect(result.current.response).toEqual(mockErrorResponse);
  });

  it('should return zero balance when balance value is 0n', () => {
    (useReadContract as Mock).mockReturnValue(mockZeroBalanceResponse);
    const { result } = renderHook(() =>
      useGetTokenBalance(mockAddress, USDC_TOKEN),
    );
    expect(result.current.convertedBalance).toBe('0');
    expect(result.current.roundedBalance).toBe('0');
    expect(result.current.error).toBeUndefined();
    expect(result.current.response).toEqual(mockZeroBalanceResponse);
  });

  it('should return empty balance when balance value is not present', () => {
    (useReadContract as Mock).mockReturnValue({
      data: null,
      error: null,
    });
    const { result } = renderHook(() =>
      useGetTokenBalance(mockAddress, USDC_TOKEN),
    );
    expect(result.current.convertedBalance).toBe('');
    expect(result.current.roundedBalance).toBe('');
    expect(result.current.error).toBeUndefined();
    expect(result.current.response).toEqual({
      data: null,
      error: null,
    });
  });

  it('should return empty balance when address is undefined', () => {
    (useReadContract as Mock).mockReturnValue({
      data: null,
      error: null,
    });
    const { result } = renderHook(() =>
      useGetTokenBalance(undefined, USDC_TOKEN),
    );
    expect(result.current.convertedBalance).toBe('');
    expect(result.current.roundedBalance).toBe('');
    expect(result.current.error).toBeUndefined();
    expect(result.current.response).toEqual({
      data: null,
      error: null,
    });
  });
});
