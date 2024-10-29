import { encodeFunctionData } from 'viem';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Call } from '../types';
import { sendSingleTransactions } from './sendSingleTransactions';

vi.mock('viem', () => ({
  encodeFunctionData: vi.fn(),
}));

describe('sendSingleTransactions', () => {
  const mockSendCallAsync = vi.fn();
  const transactions: Call[] = [
    { to: '0x123', data: '0x456' },
    { to: '0x789', data: '0xabc' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (encodeFunctionData as Mock).mockReturnValue('123');
  });

  it('should call sendCallAsync for each transaction when type is TRANSACTION_TYPE_CALLS', async () => {
    await sendSingleTransactions({
      sendCallAsync: mockSendCallAsync,
      transactions,
    });
    expect(mockSendCallAsync).toHaveBeenCalledTimes(2);
    expect(mockSendCallAsync).toHaveBeenNthCalledWith(1, transactions[0]);
    expect(mockSendCallAsync).toHaveBeenNthCalledWith(2, transactions[1]);
  });

  it('should call sendCallAsync for each transaction', async () => {
    await sendSingleTransactions({
      sendCallAsync: mockSendCallAsync,
      transactions,
    });
    expect(mockSendCallAsync).toHaveBeenCalled();
  });

  it('should not call any function if transactions array is empty', async () => {
    await sendSingleTransactions({
      sendCallAsync: mockSendCallAsync,
      transactions: [],
    });
    expect(mockSendCallAsync).not.toHaveBeenCalled();
  });

  it('should handle mixed transaction types correctly', async () => {
    await sendSingleTransactions({
      sendCallAsync: mockSendCallAsync,
      transactions,
    });
    await sendSingleTransactions({
      sendCallAsync: mockSendCallAsync,
      transactions,
    });
    expect(mockSendCallAsync).toHaveBeenCalledTimes(4);
  });

  it('should transform contracts to calls', async () => {
    await sendSingleTransactions({
      sendCallAsync: mockSendCallAsync,
      transactions: [{ abi: '123', address: '0x123' }],
    });
    expect(mockSendCallAsync).toHaveBeenCalledWith({
      data: '123',
      to: '0x123',
    });
  });
});
