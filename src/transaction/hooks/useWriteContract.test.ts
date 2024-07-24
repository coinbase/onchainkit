import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWriteContract as useWriteContractWagmi } from 'wagmi';
import { useWriteContract } from './useWriteContract';

vi.mock('wagmi', () => ({
  useWriteContract: vi.fn(),
}));

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
    (useWriteContractWagmi as any).mockReturnValue({
      status: 'idle',
      writeContract: mockWriteContract,
      data: mockData,
    });

    const { result } = renderHook(() =>
      useWriteContract({
        setErrorMessage: mockSetErrorMessage,
        setTransactionId: mockSetTransactionId,
        onError: mockOnError,
      }),
    );

    expect(result.current.status).toBe('idle');
    expect(result.current.writeContract).toBe(mockWriteContract);
    expect(result.current.data).toBe(mockData);
  });

  it('should handle generic error', () => {
    const genericError = new Error('Something went wrong. Please try again.');

    let onErrorCallback: ((error: any) => void) | undefined;

    (useWriteContractWagmi as any).mockImplementation(({ mutation }) => {
      onErrorCallback = mutation.onError;
      return {
        writeContract: vi.fn(),
        data: null,
      };
    });

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
      code: 'WRITE_TRANSACTIONS_ERROR',
      error: 'Generic error',
    });
  });

  it('should handle successful transaction', () => {
    const transactionId = '0x123';

    let onSuccessCallback: ((id: string) => void) | undefined;

    (useWriteContractWagmi as any).mockImplementation(({ mutation }) => {
      onSuccessCallback = mutation.onSuccess;
      return {
        writeContract: vi.fn(),
        data: transactionId,
      };
    });

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

    (useWriteContractWagmi as any).mockImplementation(() => {
      throw uncaughtError;
    });

    const { result } = renderHook(() =>
      useWriteContract({
        setErrorMessage: mockSetErrorMessage,
        setTransactionId: mockSetTransactionId,
        onError: mockOnError,
      }),
    );

    expect(result.current.status).toBe('error');
    expect(result.current.writeContract).toBeInstanceOf(Function);
    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      'Something went wrong. Please try again.',
    );
    expect(mockOnError).toHaveBeenCalledWith({
      code: 'UNCAUGHT_WRITE_TRANSACTIONS_ERROR',
      error: JSON.stringify(uncaughtError),
    });
  });
});
