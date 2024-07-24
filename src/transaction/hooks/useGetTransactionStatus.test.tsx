import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTransactionContext } from '../components/TransactionProvider';
import { useGetTransactionStatus } from './useGetTransactionStatus';

vi.mock('../components/TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('useGetTransactionStatus', () => {
  it('should return correct status and actionElement when transaction is pending', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      status: 'pending',
    });

    const { result } = renderHook(() => useGetTransactionStatus());

    expect(result.current.label).toBe('Confirm in wallet.');
  });

  it('should return correct status and actionElement when transaction hash exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      transactionHash: 'ab123',
    });

    const { result } = renderHook(() => useGetTransactionStatus());

    expect(result.current.label).toBe('Successful');
    expect(result.current.actionElement).not.toBeNull();
  });

  it('should return correct status and actionElement when error occurs', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      errorMessage: 'error',
    });

    const { result } = renderHook(() => useGetTransactionStatus());

    expect(result.current.label).toBe('error');
    expect(result.current.labelClassName).toBe('text-ock-error');
    expect(result.current.actionElement).not.toBeNull();
  });

  it('should return correct status and actionElement when no status available', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      errorMessage: '',
    });

    const { result } = renderHook(() => useGetTransactionStatus());

    expect(result.current.label).toBe('');
    expect(result.current.actionElement).toBeNull();
  });
});
