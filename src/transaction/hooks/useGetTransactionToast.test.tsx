import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useChainId } from 'wagmi';
import { useShowCallsStatus } from 'wagmi/experimental';
import { useTransactionContext } from '../components/TransactionProvider';
import { useGetTransactionToast } from './useGetTransactionToast';

vi.mock('../components/TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useChainId: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useShowCallsStatus: vi.fn(),
}));

describe('useGetTransactionToast', () => {
  beforeEach(() => {
    (useChainId as vi.Mock).mockReturnValue(123);
    (useShowCallsStatus as vi.Mock).mockReturnValue({
      showCallsStatus: vi.fn(),
    });
  });
  it('should return correct toast and actionElement when transaction is loading', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: true,
    });

    const { result } = renderHook(() => useGetTransactionToast());

    expect(result.current.label).toBe('Transaction in progress');
  });

  it('should return correct toast and actionElement when receipt exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      receipt: 'receipt',
      transactionHash: '123',
    });

    const { result } = renderHook(() => useGetTransactionToast());

    expect(result.current.label).toBe('Successful');
    expect(result.current.actionElement).not.toBeNull();
  });

  it('should return correct status and actionElement when transaction id exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      transactionId: 'ab123',
    });

    const { result } = renderHook(() => useGetTransactionToast());

    expect(result.current.label).toBe('Transaction in progress');
    expect(result.current.actionElement).not.toBeNull();
  });

  it('should return correct status and actionElement when transaction hash exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      transactionHash: 'ab123',
    });

    const { result } = renderHook(() => useGetTransactionToast());

    expect(result.current.label).toBe('Transaction in progress');
    expect(result.current.actionElement).not.toBeNull();
  });

  it('should return correct toast and actionElement when error occurs', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      errorMessage: 'error',
    });

    const { result } = renderHook(() => useGetTransactionToast());

    expect(result.current.label).toBe('Something went wrong');
    expect(result.current.actionElement).not.toBeNull();
  });

  it('should return correct toast and actionElement when no status available', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      errorMessage: '',
    });

    const { result } = renderHook(() => useGetTransactionToast());

    expect(result.current.label).toBe('');
    expect(result.current.actionElement).toBeNull();
  });
});
