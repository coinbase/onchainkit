import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSendTransaction as useSendTransactionWagmi } from 'wagmi';
import { useSendCall } from './useSendCall';

vi.mock('wagmi', () => ({
  useSendTransaction: vi.fn(),
}));

type useSendCallConfig = {
  mutation: {
    onError: (error: Error) => void;
    onSuccess: (id: string) => void;
  };
};

type MockuseSendCallReturn = {
  status: 'idle' | 'error' | 'loading' | 'success';
  sendTransactionAsync: ReturnType<typeof vi.fn>;
  data: string | null;
};

describe('useSendCall', () => {
  const mockSetErrorMessage = vi.fn();
  const mockSetTransactionHashArray = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return wagmi hook data when successful', () => {
    const mockSendTransaction = vi.fn();
    const mockData = 'mockTransactionData';
    (useSendTransactionWagmi as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'idle',
      sendTransactionAsync: mockSendTransaction,
      data: mockData,
    } as MockuseSendCallReturn);

    const { result } = renderHook(() =>
      useSendCall({
        setErrorMessage: mockSetErrorMessage,
        setTransactionHashArray: mockSetTransactionHashArray,
        onError: mockOnError,
      }),
    );

    expect(result.current.status).toBe('idle');
    expect(result.current.sendTransactionAsync).toBe(mockSendTransaction);
    expect(result.current.data).toBe(mockData);
  });

  it('should handle generic error', () => {
    const genericError = new Error('Something went wrong. Please try again.');

    let onErrorCallback: ((error: Error) => void) | undefined;

    (useSendTransactionWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: useSendCallConfig) => {
        onErrorCallback = mutation.onError;
        return {
          sendTransactionAsync: vi.fn(),
          data: null,
          status: 'error',
        } as MockuseSendCallReturn;
      },
    );

    renderHook(() =>
      useSendCall({
        setErrorMessage: mockSetErrorMessage,
        setTransactionHashArray: mockSetTransactionHashArray,
        onError: mockOnError,
      }),
    );

    expect(onErrorCallback).toBeDefined();
    onErrorCallback?.(genericError);

    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      'Something went wrong. Please try again.',
    );
    expect(mockOnError).toHaveBeenCalledWith({
      code: 'SEND_CALL_ERROR',
      error: 'Something went wrong. Please try again.',
    });
  });

  it('should handle successful transaction', () => {
    const transactionId = '0x123';

    let onSuccessCallback: ((id: string) => void) | undefined;

    (useSendTransactionWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutation }: useSendCallConfig) => {
        onSuccessCallback = mutation.onSuccess;
        return {
          sendTransactionAsync: vi.fn(),
          data: transactionId,
          status: 'success',
        } as MockuseSendCallReturn;
      },
    );

    renderHook(() =>
      useSendCall({
        setErrorMessage: mockSetErrorMessage,
        setTransactionHashArray: mockSetTransactionHashArray,
        onError: mockOnError,
      }),
    );

    expect(onSuccessCallback).toBeDefined();
    onSuccessCallback?.(transactionId);

    expect(mockSetTransactionHashArray).toHaveBeenCalledWith([transactionId]);
  });

  it('should handle uncaught errors', () => {
    const uncaughtError = new Error('Uncaught error');

    (useSendTransactionWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      () => {
        throw uncaughtError;
      },
    );

    const { result } = renderHook(() =>
      useSendCall({
        setErrorMessage: mockSetErrorMessage,
        setTransactionHashArray: mockSetTransactionHashArray,
        onError: mockOnError,
      }),
    );

    expect(result.current.status).toBe('error');
    expect(result.current.sendTransactionAsync).toBeInstanceOf(Function);
    expect(mockSetErrorMessage).toHaveBeenCalledWith(
      'Something went wrong. Please try again.',
    );
    expect(mockOnError).toHaveBeenCalledWith({
      code: 'UNCAUGHT_SEND_CALL_ERROR',
      error: JSON.stringify(uncaughtError),
    });
  });
});
