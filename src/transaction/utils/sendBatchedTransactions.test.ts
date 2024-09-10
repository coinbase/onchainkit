import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import { sendBatchedTransactions } from './sendBatchedTransactions';

describe('sendBatchedTransactions', () => {
  const mockWriteContractsAsync = vi.fn();
  const mockSendCallsAsync = vi.fn();
  const mockTransactions = [];
  const mockCapabilities = { paymasterService: '' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call writeContractsAsync for contract transactions', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: mockTransactions,
      transactionType: TRANSACTION_TYPE_CONTRACTS,
      writeContractsAsync: mockWriteContractsAsync,
    });
    expect(mockWriteContractsAsync).toHaveBeenCalledWith({
      contracts: mockTransactions,
      capabilities: mockCapabilities,
    });
    expect(mockSendCallsAsync).not.toHaveBeenCalled();
  });

  it('should call sendCallsAsync for call transactions', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: mockTransactions,
      transactionType: TRANSACTION_TYPE_CALLS,
      writeContractsAsync: mockWriteContractsAsync,
    });
    expect(mockSendCallsAsync).toHaveBeenCalledWith({
      calls: mockTransactions,
      capabilities: mockCapabilities,
    });
    expect(mockWriteContractsAsync).not.toHaveBeenCalled();
  });

  it('should not call any function if transactions are undefined', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: undefined,
      transactionType: TRANSACTION_TYPE_CONTRACTS,
      writeContractsAsync: mockWriteContractsAsync,
    });
    expect(mockWriteContractsAsync).not.toHaveBeenCalled();
    expect(mockSendCallsAsync).not.toHaveBeenCalled();
  });

  it('should not call any function if transaction type is invalid', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: mockTransactions,
      transactionType: 'INVALID_TYPE',
      writeContractsAsync: mockWriteContractsAsync,
    });
    expect(mockWriteContractsAsync).not.toHaveBeenCalled();
    expect(mockSendCallsAsync).not.toHaveBeenCalled();
  });
});
