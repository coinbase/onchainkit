import { describe, it, expect } from 'vitest';
import { type Address, encodeFunctionData, erc20Abi } from 'viem';
import { buildSendTransaction } from './buildSendTransaction';

describe('buildSendTransaction', () => {
  const mockRecipient = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  const mockToken = '0x1234567890123456789012345678901234567890';
  const mockAmount = 1000000000000000000n; // 1 ETH/token in wei

  it('should build native ETH transfer transaction', () => {
    const result = buildSendTransaction({
      recipientAddress: mockRecipient,
      tokenAddress: undefined as unknown as Address, // type assertion okay because we're testing the case where tokenAddress is undefined
      amount: mockAmount,
    });

    expect(result).toEqual([
      {
        to: mockRecipient,
        data: '0x',
        value: mockAmount,
      },
    ]);
  });

  it('should build ERC20 token transfer transaction', () => {
    const expectedCallData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [mockRecipient, mockAmount],
    });

    const result = buildSendTransaction({
      recipientAddress: mockRecipient,
      tokenAddress: mockToken,
      amount: mockAmount,
    });

    expect(result).toEqual([
      {
        to: mockToken,
        data: expectedCallData,
      },
    ]);
  });

  it('should handle errors and return error object', () => {
    // Force an error by passing invalid args
    const result = buildSendTransaction({
      recipientAddress: 'invalid-address' as unknown as Address, // type assertion okay because we're testing the case where recipientAddress is invalid
      tokenAddress: mockToken,
      amount: mockAmount,
    });

    expect(result).toMatchObject({
      code: 'AmBSeTa01',
      message: 'Could not build transfer transaction',
      error: expect.stringContaining('Something went wrong'),
    });
  });
});
