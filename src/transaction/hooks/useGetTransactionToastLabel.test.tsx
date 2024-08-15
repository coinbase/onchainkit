import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useChainId } from 'wagmi';
import { useShowCallsStatus } from 'wagmi/experimental';
import { getChainExplorer } from '../../network/getChainExplorer';
import { useTransactionContext } from '../components/TransactionProvider';
import { useGetTransactionToastLabel } from './useGetTransactionToastLabel';

vi.mock('../components/TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useChainId: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useShowCallsStatus: vi.fn(),
}));

vi.mock('../../network/getChainExplorer', () => ({
  getChainExplorer: vi.fn(),
}));

const mockGetChainExplorer = 'https://etherscan.io';

describe('useGetTransactionToastLabel', () => {
  beforeEach(() => {
    (useChainId as vi.Mock).mockReturnValue(123);
    (useShowCallsStatus as vi.Mock).mockReturnValue({
      showCallsStatus: vi.fn(),
    });
    (getChainExplorer as vi.Mock).mockReturnValue(mockGetChainExplorer);
  });
  it('should return correct toast and actionElement when transaction is loading', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: true,
    });

    const { result } = renderHook(() => useGetTransactionToastLabel());

    expect(result.current.label).toBe('Transaction in progress');
  });

  it('should return status when transaction hash exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      transactionHash: '0x123',
    });

    const { result } = renderHook(() => useGetTransactionToastLabel());

    expect(result.current.label).toBe('Transaction in progress');
  });

  it('should return status when transaction id exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      transactionId: 'ab123',
      onSubmit: vi.fn(),
    });

    const showCallsStatus = vi.fn();
    (useShowCallsStatus as vi.Mock).mockReturnValue({ showCallsStatus });

    const { result } = renderHook(() => useGetTransactionToastLabel());

    expect(result.current.label).toBe('Transaction in progress');
  });

  it('should return status when receipt exists', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      receipt: 'receipt',
      transactionHash: '0x123',
    });

    const { result } = renderHook(() => useGetTransactionToastLabel());

    expect(result.current.label).toBe('Successful');
  });

  it('should return status when error occurs', () => {
    const onSubmitMock = vi.fn();
    (useTransactionContext as vi.Mock).mockReturnValue({
      errorMessage: 'error',
      onSubmit: onSubmitMock,
    });

    const { result } = renderHook(() => useGetTransactionToastLabel());

    expect(result.current.label).toBe('Something went wrong');
  });

  it('should return status when no status available', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      errorMessage: '',
    });

    const { result } = renderHook(() => useGetTransactionToastLabel());

    expect(result.current.label).toBe('');
  });
});
