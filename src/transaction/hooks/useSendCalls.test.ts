import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSendCalls as useSendCallsWagmi } from 'wagmi/experimental';
import { useSendCalls } from './useSendCalls';

vi.mock('wagmi/experimental', () => ({
  useSendCalls: vi.fn(),
}));

describe('useSendCalls', () => {
  const mockSetErrorMessage = vi.fn();
  const mockSetTransactionId = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should handle generic error', () => {
    const genericError = new Error('Something went wrong. Please try again.');

    let onErrorCallback: ((error: Error) => void) | undefined;

    (useSendCallsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }) => {
        onErrorCallback = mutation.onError;
        return {
          writeContracts: vi.fn(),
          status: 'error',
        };
      },
    );

    renderHook(() =>
      useSendCalls({
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
      code: 'SEND_CALLS_ERROR',
      error: 'Something went wrong. Please try again.',
    });
  });

  it('should handle successful transaction', () => {
    const transactionId = '0x123';

    let onSuccessCallback: ((id: string) => void) | undefined;

    (useSendCallsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }) => {
        onSuccessCallback = mutation.onSuccess;
        return {
          writeContracts: vi.fn(),
          status: 'success',
        };
      },
    );

    renderHook(() =>
      useSendCalls({
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

    (useSendCallsWagmi as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw uncaughtError;
    });

    const { result } = renderHook(() =>
      useSendCalls({
        setErrorMessage: mockSetErrorMessage,
        setTransactionId: mockSetTransactionId,
        onError: mockOnError,
      }),
    );

    expect(result.current.status).toBe('error');
    expect(result.current.sendCallsAsync).toBeInstanceOf(Function);
    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      'Something went wrong. Please try again.',
    );
    expect(mockOnError).toHaveBeenCalledWith({
      code: 'UNCAUGHT_SEND_CALLS_ERROR',
      error: JSON.stringify(uncaughtError),
    });
  });

  it('should ignore EOA-specific errors', () => {
    const eoaError = new Error('Error: this request method is not supported');

    let onErrorCallback: ((error: Error) => void) | undefined;

    (useSendCallsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }) => {
        onErrorCallback = mutation.onError;
        return {
          writeContracts: vi.fn(),
          status: 'error',
        };
      },
    );

    renderHook(() =>
      useSendCalls({
        setErrorMessage: mockSetErrorMessage,
        setTransactionId: mockSetTransactionId,
        onError: mockOnError,
      }),
    );

    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.(eoaError);

    expect(mockSetErrorMessage).not.toHaveBeenCalled();
    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('should handle user rejected request errors', () => {
    const userRejectedError = new Error('User rejected request') as Error & {
      cause: { name: string };
    };
    userRejectedError.cause = { name: 'UserRejectedRequestError' };

    let onErrorCallback: ((error: Error) => void) | undefined;

    (useSendCallsWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }) => {
        onErrorCallback = mutation.onError;
        return {
          writeContracts: vi.fn(),
          status: 'error',
        };
      },
    );

    renderHook(() =>
      useSendCalls({
        setErrorMessage: mockSetErrorMessage,
        setTransactionId: mockSetTransactionId,
        onError: mockOnError,
      }),
    );

    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.(userRejectedError);

    expect(mockSetErrorMessage).toHaveBeenCalledWith('Request denied.');
    expect(mockOnError).toHaveBeenCalledWith({
      code: 'SEND_CALLS_ERROR',
      error: 'User rejected request',
    });
  });
});
