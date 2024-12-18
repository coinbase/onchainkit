import type { Call } from '@/core-react/transaction/types';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendBatchedTransactions } from '@/core/transaction/utils/sendBatchedTransactions';
import { sendSingleTransactions } from '@/core/transaction/utils/sendSingleTransactions';
import { useSendWalletTransactions } from './useSendWalletTransactions';

// Mock the utility functions
vi.mock('@/core/transaction/utils/sendBatchedTransactions');
vi.mock('@/core/transaction/utils/sendSingleTransactions');

describe('useSendWalletTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle batched transactions', async () => {
    const transactions: Call[] = [{ to: '0x123', data: '0x456' }];
    const capabilities = {};
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        capabilities,
        sendCallsAsync: vi.fn(),
        sendCallAsync: vi.fn(),
        walletCapabilities: {
          atomicBatch: {
            supported: true,
          },
        },
      }),
    );
    await result.current(transactions);
    expect(sendBatchedTransactions).toHaveBeenCalledWith({
      capabilities,
      sendCallsAsync: expect.any(Function),
      transactions,
    });
  });

  it('should handle non-batched transactions', async () => {
    const transactions: Call[] = [
      { to: '0x123', data: '0x456' },
      { to: '0x789', data: '0xabc' },
    ];
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        capabilities: undefined,
        sendCallsAsync: vi.fn(),
        sendCallAsync: vi.fn(),
        walletCapabilities: {
          atomicBatch: {
            supported: false,
          },
        },
      }),
    );
    await result.current(transactions);
    expect(sendSingleTransactions).toHaveBeenCalledWith({
      sendCallAsync: expect.any(Function),
      transactions,
    });
  });

  it('should handle a transactions promise', async () => {
    const transactions: Call[] = [{ to: '0x123', data: '0x456' }];
    const capabilities = {};
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        capabilities,
        sendCallsAsync: vi.fn(),
        sendCallAsync: vi.fn(),
        walletCapabilities: {
          atomicBatch: {
            supported: true,
          },
        },
      }),
    );
    await result.current(Promise.resolve(transactions));
    expect(sendBatchedTransactions).toHaveBeenCalledWith({
      capabilities,
      sendCallsAsync: expect.any(Function),
      transactions,
    });
  });

  it('should handle no transactions', async () => {
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        capabilities: undefined,
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
    const transactions: Call[] = [
      { to: '0x123', data: '0x456' },
      { to: '0x789', data: '0xabc' },
    ];
    const { result } = renderHook(() =>
      useSendWalletTransactions({
        capabilities: undefined,
        sendCallsAsync: vi.fn(),
        sendCallAsync: vi.fn(),
        walletCapabilities: {},
      }),
    );
    await result.current(transactions);
    expect(sendSingleTransactions).toHaveBeenCalledWith({
      sendCallAsync: expect.any(Function),
      transactions,
    });
  });
});
