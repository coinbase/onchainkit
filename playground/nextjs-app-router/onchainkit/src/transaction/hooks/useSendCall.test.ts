import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSendTransaction as useSendCallWagmi } from 'wagmi';
import { GENERIC_ERROR_MESSAGE } from '../constants';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';
import { useSendCall } from './useSendCall';

vi.mock('wagmi', () => ({
  useSendTransaction: vi.fn(),
}));

vi.mock('../utils/isUserRejectedRequestError', () => ({
  isUserRejectedRequestError: vi.fn(),
}));

type UseSendCallConfig = {
  mutation: {
    onError: (error: Error) => void;
    onSuccess: (hash: string) => void;
  };
};

type MockUseSendCallReturn = {
  status: 'idle' | 'error' | 'loading' | 'success';
  sendCallAsync: ReturnType<typeof vi.fn>;
  data: string | null;
};

describe('useSendCall', () => {
  const mockSetLifecycleStatus = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return wagmi hook data when successful', () => {
    const mockSendTransaction = vi.fn();
    const mockData = 'mockTransactionHash';
    (useSendCallWagmi as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'idle',
      sendTransactionAsync: mockSendTransaction,
      data: mockData,
    });
    const { result } = renderHook(() =>
      useSendCall({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [],
      }),
    );
    expect(result.current.status).toBe('idle');
    expect(result.current.sendCallAsync).toBe(mockSendTransaction);
    expect(result.current.data).toBe(mockData);
  });

  it('should handle generic error', () => {
    const genericError = new Error(GENERIC_ERROR_MESSAGE);
    let onErrorCallback: ((error: Error) => void) | undefined;
    (useSendCallWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseSendCallConfig) => {
        onErrorCallback = mutation.onError;
        return {
          sendCallAsync: vi.fn(),
          data: null,
          status: 'error',
        } as MockUseSendCallReturn;
      },
    );
    renderHook(() =>
      useSendCall({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [],
      }),
    );
    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.(genericError);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'TmUSCh01',
        error: GENERIC_ERROR_MESSAGE,
        message: GENERIC_ERROR_MESSAGE,
      },
    });
  });

  it('should handle user rejected error', () => {
    const userRejectedError = new Error('Request denied.');
    let onErrorCallback: ((error: Error) => void) | undefined;
    (useSendCallWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseSendCallConfig) => {
        onErrorCallback = mutation.onError;
        return {
          sendCallAsync: vi.fn(),
          data: null,
          status: 'error',
        } as MockUseSendCallReturn;
      },
    );
    (isUserRejectedRequestError as Mock).mockReturnValue(true);
    renderHook(() =>
      useSendCall({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [],
      }),
    );
    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.(userRejectedError);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'TmUSCh01',
        error: 'Request denied.',
        message: 'Request denied.',
      },
    });
  });

  it('should handle successful transaction', () => {
    const transactionHash = '0x123456';
    let onSuccessCallback: ((hash: string) => void) | undefined;
    (useSendCallWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseSendCallConfig) => {
        onSuccessCallback = mutation.onSuccess;
        return {
          sendCallAsync: vi.fn(),
          data: transactionHash,
          status: 'success',
        } as MockUseSendCallReturn;
      },
    );
    renderHook(() =>
      useSendCall({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [],
      }),
    );
    expect(onSuccessCallback).toBeDefined();
    onSuccessCallback?.(transactionHash);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionLegacyExecuted',
      statusData: {
        transactionHashList: [transactionHash],
      },
    });
  });

  it('should handle multiple successful transactions', () => {
    const transactionHash = '0x12345678';
    let onSuccessCallback: ((hash: string) => void) | undefined;
    (useSendCallWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseSendCallConfig) => {
        onSuccessCallback = mutation.onSuccess;
        return {
          sendCallAsync: vi.fn(),
          data: transactionHash,
          status: 'success',
        } as MockUseSendCallReturn;
      },
    );
    renderHook(() =>
      useSendCall({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [],
      }),
    );
    expect(onSuccessCallback).toBeDefined();
    onSuccessCallback?.(transactionHash);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionLegacyExecuted',
      statusData: {
        transactionHashList: [transactionHash],
      },
    });
    renderHook(() =>
      useSendCall({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [transactionHash],
      }),
    );
    onSuccessCallback?.(transactionHash);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionLegacyExecuted',
      statusData: {
        transactionHashList: [transactionHash, transactionHash],
      },
    });
  });
});
