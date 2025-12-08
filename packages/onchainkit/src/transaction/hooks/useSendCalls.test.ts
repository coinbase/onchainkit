import { renderHook } from '@testing-library/react';
import type { TransactionExecutionError } from 'viem';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSendCalls as useSendCallsWagmi } from 'wagmi/experimental';
import { GENERIC_ERROR_MESSAGE } from '../constants';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';
import { useSendCalls } from './useSendCalls';

vi.mock('wagmi/experimental', () => ({
  useSendCalls: vi.fn(),
}));

vi.mock('../utils/isUserRejectedRequestError', () => ({
  isUserRejectedRequestError: vi.fn(),
}));

type UseSendCallsConfig = {
  mutation: {
    onSettled: () => void;
    onError: (error: TransactionExecutionError) => void;
    onSuccess: (data: { id: string }) => void;
  };
};

describe('useSendCalls', () => {
  const mockSetLifecycleStatus = vi.fn();
  const mockSetTransactionId = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return wagmi hook data when successful', () => {
    const mockSendCallsAsync = vi.fn();
    const mockData = 'mockTransactionId';
    (useSendCallsWagmi as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'idle',
      sendCallsAsync: mockSendCallsAsync,
      data: mockData,
    });
    const { result } = renderHook(() =>
      useSendCalls({
        setLifecycleStatus: mockSetLifecycleStatus,
        setTransactionId: mockSetTransactionId,
      }),
    );
    expect(result.current.status).toBe('idle');
    expect(result.current.sendCallsAsync).toBe(mockSendCallsAsync);
    expect(result.current.data).toBe(mockData);
  });

  it('should handle generic error', () => {
    const genericError = new Error(GENERIC_ERROR_MESSAGE);
    let onErrorCallback:
      | ((error: TransactionExecutionError) => void)
      | undefined;
    (useSendCallsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseSendCallsConfig) => {
        onErrorCallback = mutation.onError;
        return {
          sendCallsAsync: vi.fn(),
          data: null,
          status: 'error',
        };
      },
    );
    (isUserRejectedRequestError as Mock).mockReturnValue(false);
    renderHook(() =>
      useSendCalls({
        setLifecycleStatus: mockSetLifecycleStatus,
        setTransactionId: mockSetTransactionId,
      }),
    );
    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.(genericError as TransactionExecutionError);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'TmUSCSh01',
        error: GENERIC_ERROR_MESSAGE,
        message: GENERIC_ERROR_MESSAGE,
      },
    });
  });

  it('should handle user rejected error', () => {
    const userRejectedError = new Error('Request denied.');
    let onErrorCallback:
      | ((error: TransactionExecutionError) => void)
      | undefined;
    (useSendCallsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseSendCallsConfig) => {
        onErrorCallback = mutation.onError;
        return {
          sendCallsAsync: vi.fn(),
          data: null,
          status: 'error',
        };
      },
    );
    (isUserRejectedRequestError as Mock).mockReturnValue(true);
    renderHook(() =>
      useSendCalls({
        setLifecycleStatus: mockSetLifecycleStatus,
        setTransactionId: mockSetTransactionId,
      }),
    );
    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.(userRejectedError as TransactionExecutionError);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'TmUSCSh01',
        error: 'Request denied.',
        message: 'Request denied.',
      },
    });
  });

  it('should handle successful transaction', () => {
    const transactionId = { id: '0x123456' };
    let onSuccessCallback: ((data: { id: string }) => void) | undefined;
    (useSendCallsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseSendCallsConfig) => {
        onSuccessCallback = mutation.onSuccess;
        return {
          sendCallsAsync: vi.fn(),
          data: transactionId,
          status: 'success',
        };
      },
    );
    renderHook(() =>
      useSendCalls({
        setLifecycleStatus: mockSetLifecycleStatus,
        setTransactionId: mockSetTransactionId,
      }),
    );
    expect(onSuccessCallback).toBeDefined();
    onSuccessCallback?.(transactionId);
    expect(mockSetTransactionId).toHaveBeenCalledWith(transactionId.id);
  });
});
