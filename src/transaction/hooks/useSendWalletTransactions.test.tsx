import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import { useSendWalletTransactions } from './useSendWalletTransactions';

describe('useSendWalletTransactions', () => {
  it('should handle batched contract transactions', async () => {
    const writeContractsAsync = vi.fn();
    const transactions = [{ to: '0x123', data: '0x456' }];
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        transactions,
        transactionType: TRANSACTION_TYPE_CONTRACTS,
        writeContractsAsync,
        writeContractAsync: vi.fn(),
        sendCallsAsync: vi.fn(),
        sendCallAsync: vi.fn(),
        walletCapabilities: { hasAtomicBatch: true },
      }),
    );
    await result.current();
    expect(writeContractsAsync).toHaveBeenCalledWith({
      contracts: transactions,
      capabilities: undefined,
    });
  });

  it('should handle batched call transactions', async () => {
    const sendCallsAsync = vi.fn();
    const transactions = [{ to: '0x123', data: '0x456' }];
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        transactions,
        transactionType: TRANSACTION_TYPE_CALLS,
        writeContractsAsync: vi.fn(),
        writeContractAsync: vi.fn(),
        sendCallsAsync,
        sendCallAsync: vi.fn(),
        walletCapabilities: { hasAtomicBatch: true },
      }),
    );
    await result.current();
    expect(sendCallsAsync).toHaveBeenCalledWith({
      calls: transactions,
      capabilities: undefined,
    });
  });

  it('should handle non-batched contract transactions', async () => {
    const writeContractAsync = vi.fn();
    const transactions = [
      { to: '0x123', data: '0x456' },
      { to: '0x789', data: '0xabc' },
    ];
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        transactions,
        transactionType: TRANSACTION_TYPE_CONTRACTS,
        writeContractsAsync: vi.fn(),
        writeContractAsync,
        sendCallsAsync: vi.fn(),
        sendCallAsync: vi.fn(),
        walletCapabilities: { hasAtomicBatch: false },
      }),
    );
    await result.current();
    expect(writeContractAsync).toHaveBeenCalledTimes(2);
    expect(writeContractAsync).toHaveBeenNthCalledWith(1, transactions[0]);
    expect(writeContractAsync).toHaveBeenNthCalledWith(2, transactions[1]);
  });

  it('should handle non-batched call transactions', async () => {
    const sendCallAsync = vi.fn();
    const transactions = [
      { to: '0x123', data: '0x456' },
      { to: '0x789', data: '0xabc' },
    ];
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        transactions,
        transactionType: TRANSACTION_TYPE_CALLS,
        writeContractsAsync: vi.fn(),
        writeContractAsync: vi.fn(),
        sendCallsAsync: vi.fn(),
        sendCallAsync,
        walletCapabilities: { hasAtomicBatch: false },
      }),
    );
    await result.current();
    expect(sendCallAsync).toHaveBeenCalledTimes(2);
    expect(sendCallAsync).toHaveBeenNthCalledWith(1, transactions[0]);
    expect(sendCallAsync).toHaveBeenNthCalledWith(2, transactions[1]);
  });

  it('should handle no transactions', async () => {
    const writeContractsAsync = vi.fn();
    const writeContractAsync = vi.fn();
    const sendCallsAsync = vi.fn();
    const sendCallAsync = vi.fn();
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        transactions: undefined,
        transactionType: TRANSACTION_TYPE_CONTRACTS,
        writeContractsAsync,
        writeContractAsync,
        sendCallsAsync,
        sendCallAsync,
        walletCapabilities: { hasAtomicBatch: false },
      }),
    );
    await result.current();
    expect(writeContractsAsync).not.toHaveBeenCalled();
    expect(writeContractAsync).not.toHaveBeenCalled();
    expect(sendCallsAsync).not.toHaveBeenCalled();
    expect(sendCallAsync).not.toHaveBeenCalled();
  });
});
