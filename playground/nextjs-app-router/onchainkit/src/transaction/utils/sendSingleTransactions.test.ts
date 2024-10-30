import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TRANSACTION_TYPE_CALLS } from '../constants';
import type { Call } from '../types';
import { sendSingleTransactions } from './sendSingleTransactions';

describe('sendSingleTransactions', () => {
  const mockSendCallAsync = vi.fn();
  const mockWriteContractAsync = vi.fn();
  const transactions: Call[] = [
    { to: '0x123', data: '0x456' },
    { to: '0x789', data: '0xabc' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call sendCallAsync for each transaction when type is TRANSACTION_TYPE_CALLS', async () => {
    await sendSingleTransactions({
      sendCallAsync: mockSendCallAsync,
      transactions,
      transactionType: TRANSACTION_TYPE_CALLS,
      writeContractAsync: mockWriteContractAsync,
    });
    expect(mockSendCallAsync).toHaveBeenCalledTimes(2);
    expect(mockSendCallAsync).toHaveBeenNthCalledWith(1, transactions[0]);
    expect(mockSendCallAsync).toHaveBeenNthCalledWith(2, transactions[1]);
    expect(mockWriteContractAsync).not.toHaveBeenCalled();
  });

  it('should call writeContractAsync for each transaction when type is not TRANSACTION_TYPE_CALLS', async () => {
    await sendSingleTransactions({
      sendCallAsync: mockSendCallAsync,
      transactions,
      transactionType: 'SOME_OTHER_TYPE',
      writeContractAsync: mockWriteContractAsync,
    });
    expect(mockWriteContractAsync).toHaveBeenCalledTimes(2);
    expect(mockWriteContractAsync).toHaveBeenNthCalledWith(1, transactions[0]);
    expect(mockWriteContractAsync).toHaveBeenNthCalledWith(2, transactions[1]);
    expect(mockSendCallAsync).not.toHaveBeenCalled();
  });

  it('should not call any function if transactions array is empty', async () => {
    await sendSingleTransactions({
      sendCallAsync: mockSendCallAsync,
      transactions: [],
      transactionType: TRANSACTION_TYPE_CALLS,
      writeContractAsync: mockWriteContractAsync,
    });
    expect(mockSendCallAsync).not.toHaveBeenCalled();
    expect(mockWriteContractAsync).not.toHaveBeenCalled();
  });

  it('should handle mixed transaction types correctly', async () => {
    await sendSingleTransactions({
      sendCallAsync: mockSendCallAsync,
      transactions,
      transactionType: TRANSACTION_TYPE_CALLS,
      writeContractAsync: mockWriteContractAsync,
    });
    expect(mockSendCallAsync).toHaveBeenCalledTimes(2);
    await sendSingleTransactions({
      sendCallAsync: mockSendCallAsync,
      transactions,
      transactionType: 'CONTRACT_TYPE',
      writeContractAsync: mockWriteContractAsync,
    });
    expect(mockWriteContractAsync).toHaveBeenCalledTimes(2);
  });
});
