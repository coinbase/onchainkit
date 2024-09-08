import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import { useTransactionType } from './useTransactionType';

describe('useTransactionType', () => {
  it('should return TRANSACTION_TYPE_CALLS when calls are provided', () => {
    const { result } = renderHook(() =>
      useTransactionType({
        calls: [{ to: '0x123', data: '0x456' }],
        contracts: undefined,
        transactionStatuses: {
          [TRANSACTION_TYPE_CALLS]: { batch: 'pending', single: 'pending' },
          [TRANSACTION_TYPE_CONTRACTS]: { batch: 'pending', single: 'pending' },
        },
        walletCapabilities: { hasAtomicBatch: true },
      }),
    );
    expect(result.current.transactionType).toBe(TRANSACTION_TYPE_CALLS);
    expect(result.current.transactionStatus).toBe('pending');
  });

  it('should return TRANSACTION_TYPE_CONTRACTS when only contracts are provided', () => {
    const { result } = renderHook(() =>
      useTransactionType({
        calls: undefined,
        contracts: [{ to: '0x123', data: '0x456' }],
        transactionStatuses: {
          [TRANSACTION_TYPE_CALLS]: { batch: 'pending', single: 'pending' },
          [TRANSACTION_TYPE_CONTRACTS]: { batch: 'success', single: 'success' },
        },
        walletCapabilities: { hasAtomicBatch: true },
      }),
    );
    expect(result.current.transactionType).toBe(TRANSACTION_TYPE_CONTRACTS);
    expect(result.current.transactionStatus).toBe('success');
  });

  it('should return TRANSACTION_TYPE_CALLS when both calls and contracts are provided', () => {
    const { result } = renderHook(() =>
      useTransactionType({
        calls: [{ to: '0x123', data: '0x456' }],
        contracts: [{ to: '0x789', data: '0xabc' }],
        transactionStatuses: {
          [TRANSACTION_TYPE_CALLS]: { batch: 'error', single: 'error' },
          [TRANSACTION_TYPE_CONTRACTS]: { batch: 'success', single: 'success' },
        },
        walletCapabilities: { hasAtomicBatch: true },
      }),
    );
    expect(result.current.transactionType).toBe(TRANSACTION_TYPE_CALLS);
    expect(result.current.transactionStatus).toBe('error');
  });

  it('should return "batch" status when hasAtomicBatch is true', () => {
    const { result } = renderHook(() =>
      useTransactionType({
        calls: [{ to: '0x123', data: '0x456' }],
        contracts: undefined,
        transactionStatuses: {
          [TRANSACTION_TYPE_CALLS]: { batch: 'pending', single: 'success' },
          [TRANSACTION_TYPE_CONTRACTS]: { batch: 'pending', single: 'success' },
        },
        walletCapabilities: { hasAtomicBatch: true },
      }),
    );
    expect(result.current.transactionStatus).toBe('pending');
  });

  it('should return "single" status when hasAtomicBatch is false', () => {
    const { result } = renderHook(() =>
      useTransactionType({
        calls: [{ to: '0x123', data: '0x456' }],
        contracts: undefined,
        transactionStatuses: {
          [TRANSACTION_TYPE_CALLS]: { batch: 'pending', single: 'success' },
          [TRANSACTION_TYPE_CONTRACTS]: { batch: 'pending', single: 'success' },
        },
        walletCapabilities: { hasAtomicBatch: false },
      }),
    );
    expect(result.current.transactionStatus).toBe('success');
  });
});
