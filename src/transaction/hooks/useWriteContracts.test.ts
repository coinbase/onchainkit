// @ts-nocheck - investigate wagmi types
import { renderHook } from '@testing-library/react';
import type { TransactionExecutionError } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWriteContracts as useWriteContractsWagmi } from 'wagmi/experimental';
import { useWriteContracts } from './useWriteContracts';

vi.mock('wagmi/experimental', () => ({
  useWriteContracts: vi.fn(),
}));

describe('useWriteContracts', () => {
  const mockSetLifecycleStatus = vi.fn();
  const mockSetTransactionId = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should handle generic error', () => {
    const genericError = new Error('Something went wrong. Please try again.');
    let onErrorCallback: ((error: Error) => void) | undefined;
    (useWriteContractsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseWriteContractsConfig) => {
        onErrorCallback = mutation.onError;
        return {
          writeContracts: vi.fn(),
          status: 'error',
        };
      },
    );
    renderHook(() =>
      useWriteContracts({
        setLifecycleStatus: mockSetLifecycleStatus,
        setTransactionId: mockSetTransactionId,
      }),
    );
    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.(genericError);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'TmUWCSh01',
        error: 'Something went wrong. Please try again.',
        message: 'Something went wrong. Please try again.',
      },
    });
  });

  it('should handle userRejectedRequestError', () => {
    let onErrorCallback:
      | ((error: TransactionExecutionError) => void)
      | undefined;
    (useWriteContractsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseWriteContractsConfig) => {
        onErrorCallback = mutation.onError;
        return {
          writeContracts: vi.fn(),
          status: 'error',
        };
      },
    );
    renderHook(() =>
      useWriteContracts({
        setLifecycleStatus: mockSetLifecycleStatus,
        setTransactionId: mockSetTransactionId,
      }),
    );
    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.({
      cause: {
        name: 'UserRejectedRequestError',
      },
      message: 'Request denied.',
    });
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'TmUWCSh01',
        error: 'Request denied.',
        message: 'Request denied.',
      },
    });
  });

  it('should handle EOA specific error to fallback to writeContract', () => {
    let onErrorCallback:
      | ((error: TransactionExecutionError) => void)
      | undefined;
    (useWriteContractsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseWriteContractsConfig) => {
        onErrorCallback = mutation.onError;
        return {
          writeContracts: vi.fn(),
          status: 'error',
          message: 'this request method is not supported',
        };
      },
    );
    renderHook(() =>
      useWriteContracts({
        setLifecycleStatus: mockSetLifecycleStatus,
        setTransactionId: mockSetTransactionId,
      }),
    );
    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.({
      cause: {
        name: 'eoa-error',
      },
      message: 'this request method is not supported',
    });
    expect(mockSetLifecycleStatus).not.toHaveBeenCalled();
  });

  it('should handle successful transaction', () => {
    const transactionId = '0x123';
    let onSuccessCallback: ((id: string) => void) | undefined;
    (useWriteContractsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseWriteContractsConfig) => {
        onSuccessCallback = mutation.onSuccess;
        return {
          writeContracts: vi.fn(),
          status: 'success',
        };
      },
    );
    renderHook(() =>
      useWriteContracts({
        setLifecycleStatus: mockSetLifecycleStatus,
        setTransactionId: mockSetTransactionId,
      }),
    );
    expect(onSuccessCallback).toBeDefined();
    onSuccessCallback?.(transactionId);
    expect(mockSetTransactionId).toHaveBeenCalledWith(transactionId);
  });
});
