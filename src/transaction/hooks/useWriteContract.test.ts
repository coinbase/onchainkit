import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWriteContract as useWriteContractWagmi } from 'wagmi';
import { useWriteContract } from './useWriteContract';

vi.mock('wagmi', () => ({
  useWriteContract: vi.fn(),
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
  const mockSetErrorMessage = vi.fn();
  const mockSetTransactionId = vi.fn();
  const mockOnError = vi.fn();

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
        setErrorMessage: mockSetErrorMessage,
        setTransactionId: mockSetTransactionId,
        onError: mockOnError,
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
        setErrorMessage: mockSetErrorMessage,
        setTransactionId: mockSetTransactionId,
        onError: mockOnError,
      }),
    );

    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.(genericError);

    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      'Something went wrong. Please try again.',
    );
    expect(mockOnError).toHaveBeenCalledWith({
      code: 'WRITE_CONTRACT_ERROR',
      error: 'Something went wrong. Please try again.',
    });
  });

  it('should handle successful transaction', () => {
    const transactionId = '0x123';

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
        setErrorMessage: mockSetErrorMessage,
        setTransactionId: mockSetTransactionId,
        onError: mockOnError,
      }),
    );

    expect(onSuccessCallback).toBeDefined();
    onSuccessCallback?.(transactionId);

    expect(mockSetTransactionId).toHaveBeenCalledWith(transactionId);
  });

  it('should handle uncaught errors', () => {
    const uncaughtError = new Error('Uncaught error');

    (useWriteContractWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      () => {
        throw uncaughtError;
      },
    );

    const { result } = renderHook(() =>
      useWriteContract({
        setErrorMessage: mockSetErrorMessage,
        setTransactionId: mockSetTransactionId,
        onError: mockOnError,
      }),
    );

    expect(result.current.status).toBe('error');
    expect(result.current.writeContractAsync).toBeInstanceOf(Function);
    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      'Something went wrong. Please try again.',
    );
    expect(mockOnError).toHaveBeenCalledWith({
      code: 'UNCAUGHT_WRITE_CONTRACT_ERROR',
      error: JSON.stringify(uncaughtError),
    });
  });
});
