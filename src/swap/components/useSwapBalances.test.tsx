/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react';
import { useSwapBalances } from './useSwapBalances';
import { Token } from '../../token';
import { useBalance, useReadContract } from 'wagmi';

jest.mock('wagmi', () => {
  return {
    useBalance: jest.fn(),
    useReadContract: jest.fn(),
  };
});

const mockETHToken: Token = {
  name: 'ETH',
  address: '0x123456789',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};

const mockToken: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: 8453,
};

const mockETHBalanceResponse = {
  data: {
    decimals: 18,
    formatted: '0.0002851826238227',
    symbol: 'ETH',
    value: 285182623822700n,
  },
};
const mockETHErrorResponse = {
  error: {
    message: 'Error occurred',
  },
};
const mockTokenErrorResponse = {
  error: {
    shortMessage: 'Error occurred',
  },
};
const mockTokenBalanceResponse = { data: 3304007277394n };

const mockAddress = '0x123';

describe('useSwapBalances', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return ETH balance when fromToken is ETH', () => {
    (useBalance as jest.Mock).mockReturnValue(mockETHBalanceResponse);

    const { result } = renderHook(() =>
      useSwapBalances({ address: mockAddress, fromToken: mockETHToken }),
    );

    expect(result.current.fromBalanceString).toBe('0.0002851826238227');
    expect(result.current.fromTokenBalanceError).toBeUndefined();
  });

  it('should return erc20 balance when fromToken is erc20', () => {
    (useBalance as jest.Mock).mockReturnValue(mockETHBalanceResponse);
    (useReadContract as jest.Mock).mockReturnValue(mockTokenBalanceResponse);

    const { result } = renderHook(() =>
      useSwapBalances({ address: mockAddress, fromToken: mockToken }),
    );

    expect(result.current.fromBalanceString).toBe('3304007.277394');
    expect(result.current.fromTokenBalanceError).toBeUndefined();
  });

  it('should return from and to token balance when fromToken and toToken are passed', () => {
    (useBalance as jest.Mock).mockReturnValue(mockETHBalanceResponse);
    (useReadContract as jest.Mock).mockReturnValue(mockTokenBalanceResponse);

    const { result } = renderHook(() =>
      useSwapBalances({
        address: mockAddress,
        fromToken: mockToken,
        toToken: mockETHToken,
      }),
    );

    expect(result.current.fromBalanceString).toBe('3304007.277394');
    expect(result.current.fromTokenBalanceError).toBeUndefined();
    expect(result.current.toBalanceString).toBe('0.0002851826238227');
    expect(result.current.toTokenBalanceError).toBeUndefined();
  });

  it('should return error when there is an error fetching ETH balance', () => {
    (useBalance as jest.Mock).mockReturnValue(mockETHErrorResponse);

    const { result } = renderHook(() =>
      useSwapBalances({ address: mockAddress, fromToken: mockETHToken }),
    );

    expect(result.current.fromBalanceString).toBe('');
    expect(result.current.fromTokenBalanceError?.error).toBe('Error occurred');
  });

  it('should return error when there is an error fetching erc20 balance', () => {
    (useReadContract as jest.Mock).mockReturnValue(mockTokenErrorResponse);

    const { result } = renderHook(() =>
      useSwapBalances({ address: mockAddress, fromToken: mockToken }),
    );

    expect(result.current.fromBalanceString).toBe('');
    expect(result.current.fromTokenBalanceError?.error).toBe('Error occurred');
  });
});
