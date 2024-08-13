import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import { useTransactionType } from './useTransactionType';

describe('useTransactionType', () => {
  it('should return TRANSACTION_TYPE_CALLS when only calls are provided', () => {
    const { result } = renderHook(() =>
      useTransactionType({ calls: [{ to: '0x123', data: '0x456' }] }),
    );
    expect(result.current).toBe(TRANSACTION_TYPE_CALLS);
  });

  it('should return TRANSACTION_TYPE_CONTRACTS when only contracts are provided', () => {
    const { result } = renderHook(() =>
      useTransactionType({
        contracts: [{ address: '0x123', abi: [], functionName: 'transfer' }],
      }),
    );
    expect(result.current).toBe(TRANSACTION_TYPE_CONTRACTS);
  });

  it('should throw an error when both calls and contracts are provided', () => {
    expect(() => {
      renderHook(() =>
        useTransactionType({
          calls: [{ to: '0x123', data: '0x456' }],
          contracts: [{ address: '0x123', abi: [], functionName: 'transfer' }],
        }),
      );
    }).toThrow(
      "Only one of 'calls' or 'contracts' should be defined, not both.",
    );
  });

  it('should throw an error when neither calls nor contracts are provided', () => {
    expect(() => {
      renderHook(() => useTransactionType({}));
    }).toThrow("Either 'calls' or 'contracts' must be defined.");
  });

  it('should not throw an error when calls is an empty array', () => {
    const { result } = renderHook(() => useTransactionType({ calls: [] }));
    expect(result.current).toBe(TRANSACTION_TYPE_CALLS);
  });

  it('should not throw an error when contracts is an empty array', () => {
    const { result } = renderHook(() => useTransactionType({ contracts: [] }));
    expect(result.current).toBe(TRANSACTION_TYPE_CONTRACTS);
  });

  it('should log "TransactionType" to stdout', () => {
    const mockStdout = vi.spyOn(process.stdout, 'write');
    renderHook(() =>
      useTransactionType({ calls: [{ to: '0x123', data: '0x456' }] }),
    );
    expect(mockStdout).toHaveBeenCalledWith('TransactionType\n');
    mockStdout.mockRestore();
  });
});
