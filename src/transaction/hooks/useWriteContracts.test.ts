import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWriteContracts as useWriteContractsWagmi } from 'wagmi/experimental';
import { useWriteContracts } from './useWriteContracts';

vi.mock('wagmi/experimental', () => ({
  useWriteContracts: vi.fn(),
}));

describe('useWriteContracts', () => {
  const mockSetErrorMessage = vi.fn();
  const mockSetTransactionId = vi.fn();
  const mockOnError = vi.fn();

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
      code: 'WRITE_CONTRACTS_ERROR',
      error: 'Something went wrong. Please try again.',
    });
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

    (useWriteContractsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      () => {
        throw uncaughtError;
      },
    );

    const { result } = renderHook(() =>
      useWriteContracts({
        setErrorMessage: mockSetErrorMessage,
        setTransactionId: mockSetTransactionId,
        onError: mockOnError,
      }),
    );

    expect(result.current.status).toBe('error');
    expect(result.current.writeContracts).toBeInstanceOf(Function);
    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      'Something went wrong. Please try again.',
    );
    expect(mockOnError).toHaveBeenCalledWith({
      code: 'UNCAUGHT_WRITE_WRITE_CONTRACTS_ERROR',
      error: JSON.stringify(uncaughtError),
    });
  });
});
