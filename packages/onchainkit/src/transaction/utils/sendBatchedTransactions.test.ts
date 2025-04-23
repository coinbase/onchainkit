import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendBatchedTransactions } from './sendBatchedTransactions';

import type { SendBatchedTransactionsParams } from '@/transaction/types';
import { erc20Abi } from 'viem';

describe('sendBatchedTransactions', () => {
  const mockSendCallsAsync = vi.fn();
  const mockTransactions: SendBatchedTransactionsParams['transactions'] = [];
  const mockCapabilities: SendBatchedTransactionsParams['capabilities'] = {
    paymasterService: { url: '' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call sendCallsAsync for contract transactions', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: mockTransactions,
    });
    expect(mockSendCallsAsync).toHaveBeenCalled();
  });

  it('should call sendCallsAsync for call transactions', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: mockTransactions,
    });
    expect(mockSendCallsAsync).toHaveBeenCalledWith({
      calls: mockTransactions,
      capabilities: mockCapabilities,
    });
  });

  it('should not call any function if transactions are undefined', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: undefined,
    });
    expect(mockSendCallsAsync).not.toHaveBeenCalled();
  });

  it('should transform contracts address prop', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: [
        { address: '0x123', abi: erc20Abi, functionName: 'transfer' },
      ],
    });
    expect(mockSendCallsAsync).toHaveBeenCalledWith({
      capabilities: mockCapabilities,
      calls: [{ to: '0x123', abi: erc20Abi, functionName: 'transfer' }],
    });
  });

  it('should not transform calls', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: [{ to: '0x123', data: '0x123' }],
    });
    expect(mockSendCallsAsync).toHaveBeenCalledWith({
      capabilities: mockCapabilities,
      calls: [{ to: '0x123', data: '0x123' }],
    });
  });
});
