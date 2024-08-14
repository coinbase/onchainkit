import { renderHook } from '@testing-library/react';
import type { Hex } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import { useSendSCWTransactions } from './useSendSCWTransactions';

describe('useSendSCWTransactions', () => {
  it('should call writeContractsAsync when transactionType is TRANSACTION_TYPE_CONTRACTS', async () => {
    const writeContractsAsync = vi.fn().mockResolvedValue(undefined);
    const sendCallsAsync = vi.fn();
    const contracts = [
      { address: '0x789' as Hex, abi: [], functionName: 'test' },
    ];
    const capabilities = {};

    const { result } = renderHook(() =>
      useSendSCWTransactions({
        transactionType: TRANSACTION_TYPE_CONTRACTS,
        contracts,
        capabilities,
        writeContractsAsync,
        sendCallsAsync,
      }),
    );

    await result.current();

    expect(writeContractsAsync).toHaveBeenCalledWith({
      contracts,
      capabilities,
    });
    expect(sendCallsAsync).not.toHaveBeenCalled();
  });

  it('should call sendCallsAsync when transactionType is TRANSACTION_TYPE_CALLS', async () => {
    const writeContractsAsync = vi.fn();
    const sendCallsAsync = vi.fn().mockResolvedValue(undefined);
    const calls = [{ to: '0x123' as Hex, data: '0x456' as Hex }];
    const capabilities = {
      /* mock capabilities */
    };

    const { result } = renderHook(() =>
      useSendSCWTransactions({
        transactionType: TRANSACTION_TYPE_CALLS,
        calls,
        capabilities,
        writeContractsAsync,
        sendCallsAsync,
      }),
    );

    await result.current();

    expect(sendCallsAsync).toHaveBeenCalledWith({
      calls,
      capabilities,
    });
    expect(writeContractsAsync).not.toHaveBeenCalled();
  });

  it('should not call either function when transactionType is unknown', async () => {
    const writeContractsAsync = vi.fn();
    const sendCallsAsync = vi.fn();

    const { result } = renderHook(() =>
      useSendSCWTransactions({
        transactionType: 'UNKNOWN_TYPE',
        writeContractsAsync,
        sendCallsAsync,
      }),
    );

    await result.current();

    expect(writeContractsAsync).not.toHaveBeenCalled();
    expect(sendCallsAsync).not.toHaveBeenCalled();
  });

  it('should not call writeContractsAsync when contracts are not provided', async () => {
    const writeContractsAsync = vi.fn();
    const sendCallsAsync = vi.fn();

    const { result } = renderHook(() =>
      useSendSCWTransactions({
        transactionType: TRANSACTION_TYPE_CONTRACTS,
        writeContractsAsync,
        sendCallsAsync,
      }),
    );

    await result.current();

    expect(writeContractsAsync).not.toHaveBeenCalled();
    expect(sendCallsAsync).not.toHaveBeenCalled();
  });

  it('should not call sendCallsAsync when calls are not provided', async () => {
    const writeContractsAsync = vi.fn();
    const sendCallsAsync = vi.fn();

    const { result } = renderHook(() =>
      useSendSCWTransactions({
        transactionType: TRANSACTION_TYPE_CALLS,
        writeContractsAsync,
        sendCallsAsync,
      }),
    );

    await result.current();

    expect(writeContractsAsync).not.toHaveBeenCalled();
    expect(sendCallsAsync).not.toHaveBeenCalled();
  });
});
