import { renderHook } from '@testing-library/react';
import type { Hex } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import { useTransactionStatus } from './useTransactionStatus';

describe('useTransactionStatus', () => {
  const mockWriteContractTransactionHash: Hex = '0x123' as Hex;
  const mockSendTransactionHash: Hex = '0x456' as Hex;

  it('should return contract-related properties when transaction type is CONTRACTS', () => {
    const { result } = renderHook(() =>
      useTransactionStatus({
        transactionType: TRANSACTION_TYPE_CONTRACTS,
        writeContractTransactionHash: mockWriteContractTransactionHash,
        statusWriteContracts: 'pending',
        statusWriteContract: 'success',
        sendTransactionHash: undefined,
        statusSendCalls: undefined,
        statusSendCall: undefined,
      }),
    );

    expect(result.current).toEqual({
      singleTransactionHash: mockWriteContractTransactionHash,
      statusBatched: 'pending',
      statusSingle: 'success',
    });
  });

  it('should return call-related properties when transaction type is CALLS', () => {
    const { result } = renderHook(() =>
      useTransactionStatus({
        transactionType: TRANSACTION_TYPE_CALLS,
        writeContractTransactionHash: undefined,
        statusWriteContracts: undefined,
        statusWriteContract: undefined,
        sendTransactionHash: mockSendTransactionHash,
        statusSendCalls: 'pending',
        statusSendCall: 'success',
      }),
    );

    expect(result.current).toEqual({
      singleTransactionHash: mockSendTransactionHash,
      statusBatched: 'pending',
      statusSingle: 'success',
    });
  });

  it('should return undefined values when transaction type is neither CONTRACTS nor CALLS', () => {
    const { result } = renderHook(() =>
      useTransactionStatus({
        transactionType: 'INVALID_TYPE',
        writeContractTransactionHash: undefined,
        statusWriteContracts: undefined,
        statusWriteContract: undefined,
        sendTransactionHash: undefined,
        statusSendCalls: undefined,
        statusSendCall: undefined,
      }),
    );

    expect(result.current).toEqual({
      singleTransactionHash: undefined,
      statusBatched: undefined,
      statusSingle: undefined,
    });
  });

  it('should log "TransactionStatus" to stdout', () => {
    const mockStdout = vi.spyOn(process.stdout, 'write');
    renderHook(() =>
      useTransactionStatus({
        transactionType: TRANSACTION_TYPE_CONTRACTS,
        writeContractTransactionHash: mockWriteContractTransactionHash,
        statusWriteContracts: 'pending',
        statusWriteContract: 'success',
        sendTransactionHash: undefined,
        statusSendCalls: undefined,
        statusSendCall: undefined,
      }),
    );
    expect(mockStdout).toHaveBeenCalledWith('TransactionStatus\n');
    mockStdout.mockRestore();
  });

  it("should memoize the result and not re-compute on re-render if inputs haven't changed", () => {
    const { result, rerender } = renderHook(
      ({ transactionType }) =>
        useTransactionStatus({
          transactionType,
          writeContractTransactionHash: mockWriteContractTransactionHash,
          statusWriteContracts: 'pending',
          statusWriteContract: 'success',
          sendTransactionHash: undefined,
          statusSendCalls: undefined,
          statusSendCall: undefined,
        }),
      { initialProps: { transactionType: TRANSACTION_TYPE_CONTRACTS } },
    );

    const initialResult = result.current;
    rerender({ transactionType: TRANSACTION_TYPE_CONTRACTS });
    expect(result.current).toBe(initialResult);
  });
});
