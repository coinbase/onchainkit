import { act, renderHook } from '@testing-library/react';
import type { Hex } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GENERIC_ERROR_MESSAGE, TRANSACTION_TYPE_CALLS } from '../constants';
import { useSendEOATransactions } from './useSendEOATransactions';

describe('useSendEOATransactions', () => {
  const mockSendTransactionAsync = vi.fn();
  const mockWriteContractAsync = vi.fn();
  const mockSetErrorMessage = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call sendTransactionAsync for TRANSACTION_TYPE_CALLS', async () => {
    const calls = [{ to: '0x123' as Hex, data: '0x456' as Hex }];
    const { result } = renderHook(() =>
      useSendEOATransactions({
        calls,
        transactionType: TRANSACTION_TYPE_CALLS,
        sendTransactionAsync: mockSendTransactionAsync,
        writeContractAsync: mockWriteContractAsync,
        setErrorMessage: mockSetErrorMessage,
      }),
    );

    await act(async () => {
      await result.current();
    });

    expect(mockSendTransactionAsync).toHaveBeenCalledWith(calls[0]);
    expect(mockWriteContractAsync).not.toHaveBeenCalled();
    expect(mockSetErrorMessage).not.toHaveBeenCalled();
  });

  it('should call writeContractAsync for non-TRANSACTION_TYPE_CALLS', async () => {
    const contracts = [
      { address: '0x789' as Hex, abi: [], functionName: 'test' },
    ];
    const { result } = renderHook(() =>
      useSendEOATransactions({
        contracts,
        transactionType: 'OTHER',
        sendTransactionAsync: mockSendTransactionAsync,
        writeContractAsync: mockWriteContractAsync,
        setErrorMessage: mockSetErrorMessage,
      }),
    );

    await act(async () => {
      await result.current();
    });

    expect(mockWriteContractAsync).toHaveBeenCalledWith(contracts[0]);
    expect(mockSendTransactionAsync).not.toHaveBeenCalled();
    expect(mockSetErrorMessage).not.toHaveBeenCalled();
  });

  it('should handle UserRejectedRequestError', async () => {
    mockSendTransactionAsync.mockRejectedValue({
      cause: { name: 'UserRejectedRequestError' },
    });

    const { result } = renderHook(() =>
      useSendEOATransactions({
        calls: [{ to: '0x123', data: '0x456' }],
        transactionType: TRANSACTION_TYPE_CALLS,
        sendTransactionAsync: mockSendTransactionAsync,
        writeContractAsync: mockWriteContractAsync,
        setErrorMessage: mockSetErrorMessage,
      }),
    );

    await act(async () => {
      await result.current();
    });

    expect(mockSetErrorMessage).toHaveBeenCalledWith('Request denied.');
  });

  it('should handle generic errors', async () => {
    mockSendTransactionAsync.mockRejectedValue(new Error('Generic error'));

    const { result } = renderHook(() =>
      useSendEOATransactions({
        calls: [{ to: '0x123', data: '0x456' }],
        transactionType: TRANSACTION_TYPE_CALLS,
        sendTransactionAsync: mockSendTransactionAsync,
        writeContractAsync: mockWriteContractAsync,
        setErrorMessage: mockSetErrorMessage,
      }),
    );

    await act(async () => {
      await result.current();
    });

    expect(mockSetErrorMessage).toHaveBeenCalledWith(GENERIC_ERROR_MESSAGE);
  });

  it('should handle empty transactions', async () => {
    const { result } = renderHook(() =>
      useSendEOATransactions({
        transactionType: TRANSACTION_TYPE_CALLS,
        sendTransactionAsync: mockSendTransactionAsync,
        writeContractAsync: mockWriteContractAsync,
        setErrorMessage: mockSetErrorMessage,
      }),
    );

    await act(async () => {
      await result.current();
    });

    expect(mockSendTransactionAsync).not.toHaveBeenCalled();
    expect(mockWriteContractAsync).not.toHaveBeenCalled();
    expect(mockSetErrorMessage).not.toHaveBeenCalled();
  });
});
