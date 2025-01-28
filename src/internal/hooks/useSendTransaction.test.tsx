import { buildSendTransaction } from '@/api/buildSendTransaction';
import type { Token } from '@/token';
import { renderHook } from '@testing-library/react';
import { type Address, parseUnits } from 'viem';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSendTransaction } from './useSendTransaction';

vi.mock('@/api/buildSendTransaction', () => ({
  buildSendTransaction: vi.fn(),
}));

describe('useSendTransaction', () => {
  const mockToken: Token = {
    symbol: 'TOKEN',
    decimals: 18,
    address: '0x0987654321098765432109876543210987654321',
    chainId: 8453,
    image: '',
    name: '',
  };
  const mockRecipientAddress = '0x1234567890123456789012345678901234567890';
  const mockCallData = {
    to: mockRecipientAddress,
    data: mockToken.address,
    value: parseUnits('1.0', 18),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns empty calls when token is null', () => {
    const { result } = renderHook(() =>
      useSendTransaction({
        recipientAddress: mockRecipientAddress,
        token: null,
        amount: '1.0',
      }),
    );

    expect(result.current).toEqual({
      code: 'AmBSeTx01', // Api Module Build Send Transaction Error 01
      error: 'No token provided',
      message: 'Could not build send transaction',
    });
  });

  it('handles ETH transfers correctly', () => {
    (buildSendTransaction as Mock).mockReturnValue({
      ...mockCallData,
      data: '',
    });
    const { result } = renderHook(() =>
      useSendTransaction({
        recipientAddress: mockRecipientAddress,
        token: { ...mockToken, address: '', symbol: 'ETH' },
        amount: '1.0',
      }),
    );

    expect(buildSendTransaction).toHaveBeenCalledWith({
      recipientAddress: mockRecipientAddress,
      tokenAddress: null,
      amount: parseUnits('1.0', 18),
    });
    expect(result.current).toEqual({
      to: mockRecipientAddress,
      data: '',
      value: parseUnits('1.0', 18),
    });
  });

  it('returns error for non-ETH token without address', () => {
    const { result } = renderHook(() =>
      useSendTransaction({
        recipientAddress: mockRecipientAddress,
        token: {
          ...mockToken,
          symbol: 'INVALID',
          address: undefined as unknown as Address, // type assertion okay because we're testing the case where address is undefined
        },
        amount: '1.0',
      }),
    );

    expect(result.current).toEqual({
      code: 'AmBSeTx02', // Api Module Build Send Transaction Error 02
      error: 'No token address provided for non-ETH token',
      message: 'Could not build send transaction',
    });
  });

  it('handles ERC20 token transfers correctly', () => {
    const mockDecimals = 6;
    const expectedCallData = {
      to: mockRecipientAddress,
      data: mockToken.address,
      value: parseUnits('100', mockDecimals),
    };
    (buildSendTransaction as Mock).mockReturnValue(expectedCallData);

    renderHook(() =>
      useSendTransaction({
        recipientAddress: mockRecipientAddress,
        token: {
          ...mockToken,
          symbol: 'USDC',
          address: mockToken.address,
          decimals: 6,
        },
        amount: '100',
      }),
    );
    expect(buildSendTransaction).toHaveBeenCalledWith({
      recipientAddress: mockRecipientAddress,
      tokenAddress: mockToken.address,
      amount: parseUnits('100', 6),
    });
  });

  it('handles different decimal places correctly', () => {
    const mockDecimals = 12;
    const expectedCallData = {
      to: mockRecipientAddress,
      data: mockToken.address,
      value: parseUnits('0.5', mockDecimals),
    };
    (buildSendTransaction as Mock).mockReturnValue(expectedCallData);

    renderHook(() =>
      useSendTransaction({
        recipientAddress: mockRecipientAddress,
        token: {
          ...mockToken,
          symbol: 'TEST',
          address: mockToken.address,
          decimals: mockDecimals,
        },
        amount: '0.5',
      }),
    );
    expect(buildSendTransaction).toHaveBeenCalledWith({
      recipientAddress: mockRecipientAddress,
      tokenAddress: mockToken.address,
      amount: parseUnits('0.5', mockDecimals),
    });
  });
});
