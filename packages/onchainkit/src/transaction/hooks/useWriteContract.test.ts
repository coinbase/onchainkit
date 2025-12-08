import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWriteContract as useWriteContractWagmi } from 'wagmi';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';
import { useWriteContract } from './useWriteContract';

vi.mock('wagmi', () => ({
  useWriteContract: vi.fn(),
}));

vi.mock('../utils/isUserRejectedRequestError', () => ({
  isUserRejectedRequestError: vi.fn(),
}));

type UseWriteContractConfig = {
  mutation: {
    onError: (error: Error) => void;
    onSuccess: (id: string) => void;
  };
};

type MockUseWriteContractReturn = {
  status: 'idle' | 'error' | 'loading' | 'success';
  writeContractAsync: ReturnType<typeof vi.fn>;
  data: string | null;
};

describe('useWriteContract', () => {
  const mockSetLifecycleStatus = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return wagmi hook data when successful', () => {
    const mockWriteContract = vi.fn();
    const mockData = 'mockTransactionData';
    (useWriteContractWagmi as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'idle',
      writeContractAsync: mockWriteContract,
      data: mockData,
    } as MockUseWriteContractReturn);
    const { result } = renderHook(() =>
      useWriteContract({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [],
      }),
    );
    expect(result.current.status).toBe('idle');
    expect(result.current.writeContractAsync).toBe(mockWriteContract);
    expect(result.current.data).toBe(mockData);
  });

  it('should handle generic error', () => {
    const genericError = new Error('Something went wrong. Please try again.');
    let onErrorCallback: ((error: Error) => void) | undefined;
    (useWriteContractWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseWriteContractConfig) => {
        onErrorCallback = mutation.onError;
        return {
          writeContractAsync: vi.fn(),
          data: null,
          status: 'error',
        } as MockUseWriteContractReturn;
      },
    );
    renderHook(() =>
      useWriteContract({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [],
      }),
    );
    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.(genericError);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'TmUWCh01',
        error: 'Something went wrong. Please try again.',
        message: 'Something went wrong. Please try again.',
      },
    });
  });

  it('should handle user rejected error', () => {
    const useRejectedError = new Error('Request denied.');
    let onErrorCallback: ((error: Error) => void) | undefined;
    (useWriteContractWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseWriteContractConfig) => {
        onErrorCallback = mutation.onError;
        return {
          writeContractAsync: vi.fn(),
          data: null,
          status: 'error',
        } as MockUseWriteContractReturn;
      },
    );
    (isUserRejectedRequestError as Mock).mockReturnValue(true);
    renderHook(() =>
      useWriteContract({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [],
      }),
    );
    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.(useRejectedError);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'TmUWCh01',
        error: 'Request denied.',
        message: 'Request denied.',
      },
    });
  });

  it('should handle successful transaction', () => {
    const transactionId = '0x123456';
    let onSuccessCallback: ((id: string) => void) | undefined;
    (useWriteContractWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseWriteContractConfig) => {
        onSuccessCallback = mutation.onSuccess;
        return {
          writeContractAsync: vi.fn(),
          data: transactionId,
          status: 'success',
        } as MockUseWriteContractReturn;
      },
    );
    renderHook(() =>
      useWriteContract({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [],
      }),
    );
    expect(onSuccessCallback).toBeDefined();
    onSuccessCallback?.(transactionId);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionLegacyExecuted',
      statusData: {
        transactionHashList: [transactionId],
      },
    });
  });

  it('should handle multiple successful transactions', () => {
    const transactionId = '0x12345678';
    let onSuccessCallback: ((id: string) => void) | undefined;
    (useWriteContractWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: UseWriteContractConfig) => {
        onSuccessCallback = mutation.onSuccess;
        return {
          writeContractAsync: vi.fn(),
          data: transactionId,
          status: 'success',
        } as MockUseWriteContractReturn;
      },
    );
    renderHook(() =>
      useWriteContract({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [],
      }),
    );
    expect(onSuccessCallback).toBeDefined();
    onSuccessCallback?.(transactionId);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionLegacyExecuted',
      statusData: {
        transactionHashList: [transactionId],
      },
    });
    renderHook(() =>
      useWriteContract({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionHashList: [transactionId],
      }),
    );
    onSuccessCallback?.(transactionId);
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionLegacyExecuted',
      statusData: {
        transactionHashList: [transactionId, transactionId],
      },
    });
  });
});
