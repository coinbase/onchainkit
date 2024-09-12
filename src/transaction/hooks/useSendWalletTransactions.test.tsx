import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import { sendBatchedTransactions } from '../utils/sendBatchedTransactions';
import { sendSingleTransactions } from '../utils/sendSingleTransactions';
import { useSendWalletTransactions } from './useSendWalletTransactions';

// Mock the utility functions
vi.mock('../utils/sendBatchedTransactions');
vi.mock('../utils/sendSingleTransactions');

describe('useSendWalletTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle batched transactions', async () => {
    const transactions = [{ to: '0x123', data: '0x456' }];
    const capabilities = {};
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        transactions,
        transactionType: TRANSACTION_TYPE_CONTRACTS,
        capabilities,
        writeContractsAsync: vi.fn(),
        writeContractAsync: vi.fn(),
        sendCallsAsync: vi.fn(),
        sendCallAsync: vi.fn(),
        walletCapabilities: {
          atomicBatch: {
            supported: true,
          },
        },
      }),
    );
    await result.current();
    expect(sendBatchedTransactions).toHaveBeenCalledWith({
      capabilities,
      sendCallsAsync: expect.any(Function),
      transactions,
      transactionType: TRANSACTION_TYPE_CONTRACTS,
      writeContractsAsync: expect.any(Function),
    });
  });

  it('should handle non-batched transactions', async () => {
    const transactions = [
      { to: '0x123', data: '0x456' },
      { to: '0x789', data: '0xabc' },
    ];
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        transactions,
        transactionType: TRANSACTION_TYPE_CALLS,
        capabilities: undefined,
        writeContractsAsync: vi.fn(),
        writeContractAsync: vi.fn(),
        sendCallsAsync: vi.fn(),
        sendCallAsync: vi.fn(),
        walletCapabilities: {
          atomicBatch: {
            supported: false,
          },
        },
      }),
    );
    await result.current();
    expect(sendSingleTransactions).toHaveBeenCalledWith({
      sendCallAsync: expect.any(Function),
      transactions,
      transactionType: TRANSACTION_TYPE_CALLS,
      writeContractAsync: expect.any(Function),
    });
  });

  it('should handle no transactions', async () => {
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        transactions: undefined,
        transactionType: TRANSACTION_TYPE_CONTRACTS,
        capabilities: undefined,
        writeContractsAsync: vi.fn(),
        writeContractAsync: vi.fn(),
        sendCallsAsync: vi.fn(),
        sendCallAsync: vi.fn(),
        walletCapabilities: { hasAtomicBatch: false },
      }),
    );
    await result.current();
    expect(sendBatchedTransactions).not.toHaveBeenCalled();
    expect(sendSingleTransactions).not.toHaveBeenCalled();
  });

  it('should handle empty walletCapabilities', async () => {
    const transactions = [
      { to: '0x123', data: '0x456' },
      { to: '0x789', data: '0xabc' },
    ];
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        transactions,
        transactionType: TRANSACTION_TYPE_CALLS,
        capabilities: undefined,
        writeContractsAsync: vi.fn(),
        writeContractAsync: vi.fn(),
        sendCallsAsync: vi.fn(),
        sendCallAsync: vi.fn(),
        walletCapabilities: {},
      }),
    );
    await result.current();
    expect(sendSingleTransactions).toHaveBeenCalledWith({
      sendCallAsync: expect.any(Function),
      transactions,
      transactionType: TRANSACTION_TYPE_CALLS,
      writeContractAsync: expect.any(Function),
    });
  });
});
