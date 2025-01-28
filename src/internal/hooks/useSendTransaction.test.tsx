import { buildSendTransaction } from '@/api/buildSendTransaction';
import type { Token } from '@/token';
import { renderHook } from '@testing-library/react';
import { type Address, parseUnits } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import { useSendTransaction } from './useSendTransaction';

vi.mock('@/api/buildSendTransaction', () => ({
  buildSendTransaction: vi.fn().mockReturnValue(['mockedCall']),
}));

const mockToken: Token = {
  symbol: 'ETH',
  decimals: 18,
  address: '',
  chainId: 8453,
  image: '',
  name: '',
};

describe('useSendTransaction', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockTokenAddress = '0x0987654321098765432109876543210987654321';

  it('returns empty calls when token is null', () => {
    const { result } = renderHook(() =>
      useSendTransaction({
        recipientAddress: mockAddress,
        token: null,
        amount: '1.0',
      }),
    );

    expect(result.current.calls).toEqual([]);
  });

  it('handles ETH transfers correctly', () => {
    const { result } = renderHook(() =>
      useSendTransaction({
        recipientAddress: mockAddress,
        token: mockToken,
        amount: '1.0',
      }),
    );

    expect(buildSendTransaction).toHaveBeenCalledWith({
      recipientAddress: mockAddress,
      tokenAddress: null,
      amount: parseUnits('1.0', 18),
    });
    expect(result.current.calls).toEqual(['mockedCall']);
  });

  it('returns empty calls for non-ETH token without address', () => {
    const { result } = renderHook(() =>
      useSendTransaction({
        recipientAddress: mockAddress,
        token: {
          ...mockToken,
          symbol: 'INVALID',
          address: undefined as unknown as Address, // type assertion okay because we're testing the case where address is undefined
        },
        amount: '1.0',
      }),
    );

    expect(result.current.calls).toEqual([]);
  });

  it('handles ERC20 token transfers correctly', () => {
    const { result } = renderHook(() =>
      useSendTransaction({
        recipientAddress: mockAddress,
        token: {
          ...mockToken,
          symbol: 'USDC',
          address: mockTokenAddress,
          decimals: 6,
        },
        amount: '100',
      }),
    );

    expect(buildSendTransaction).toHaveBeenCalledWith({
      recipientAddress: mockAddress,
      tokenAddress: mockTokenAddress,
      amount: parseUnits('100', 6),
    });
    expect(result.current.calls).toEqual(['mockedCall']);
  });

  it('handles different decimal places correctly', () => {
    const { result } = renderHook(() =>
      useSendTransaction({
        recipientAddress: mockAddress,
        token: {
          ...mockToken,
          symbol: 'TEST',
          decimals: 12,
          address: mockTokenAddress,
        },
        amount: '0.5',
      }),
    );

    expect(buildSendTransaction).toHaveBeenCalledWith({
      recipientAddress: mockAddress,
      tokenAddress: mockTokenAddress,
      amount: parseUnits('0.5', 12),
    });
    expect(result.current.calls).toEqual(['mockedCall']);
  });
});
