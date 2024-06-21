/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { useGetTokenBalance } from './useGetTokenBalance';
import { useReadContract } from 'wagmi';
import type { Token } from '../../token';

jest.mock('wagmi', () => {
  return {
    useReadContract: jest.fn(),
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
const mockToken: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: 8453,
};

describe('useGetTokenBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return converted and rounded balance without error', () => {
    (require('wagmi').useReadContract as jest.Mock).mockReturnValue(
      mockTokenBalanceResponse,
    );
    const { result } = renderHook(() =>
      useGetTokenBalance(mockAddress, mockToken),
    );

    expect(result.current.convertedBalance).toBe('3304007.277394');
    expect(result.current.roundedBalance).toBe('3304007.277394');
    expect(result.current.error).toBeUndefined();
    expect(result.current.response).toEqual(mockTokenBalanceResponse);
  });

  it('should return an error when useReadContract returns an error', () => {
    (useReadContract as jest.Mock).mockReturnValue(mockErrorResponse);

    const { result } = renderHook(() =>
      useGetTokenBalance(mockAddress, mockToken),
    );

    expect(result.current.convertedBalance).toBe('');
    expect(result.current.roundedBalance).toBe('');
    expect(result.current.error).toEqual({
      error: mockErrorResponse.error.shortMessage,
      code: 'SWAP_BALANCE_ERROR',
    });
    expect(result.current.response).toEqual(mockErrorResponse);
  });

  it('should return zero balance when balance value is 0n', () => {
    (useReadContract as jest.Mock).mockReturnValue(mockZeroBalanceResponse);

    const { result } = renderHook(() =>
      useGetTokenBalance(mockAddress, mockToken),
    );

    expect(result.current.convertedBalance).toBe('0');
    expect(result.current.roundedBalance).toBe('0');
    expect(result.current.error).toBeUndefined();
    expect(result.current.response).toEqual(mockZeroBalanceResponse);
  });

  it('should return empty balance when balance value is not present', () => {
    (useReadContract as jest.Mock).mockReturnValue({
      data: null,
      error: null,
    });

    const { result } = renderHook(() =>
      useGetTokenBalance(mockAddress, mockToken),
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
