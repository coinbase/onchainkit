import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useChainId } from 'wagmi';
import { useShowCallsStatus } from 'wagmi/experimental';
import { getChainExplorer } from '../../core/network/getChainExplorer';
import { useTransactionContext } from '../components/TransactionProvider';
import { useGetTransactionStatusLabel } from './useGetTransactionStatusLabel';

vi.mock('../components/TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useChainId: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useShowCallsStatus: vi.fn(),
}));

vi.mock('../../core/network/getChainExplorer', () => ({
  getChainExplorer: vi.fn(),
}));

const mockGetChainExplorer = 'https://etherscan.io';
describe('useGetTransactionStatusLabel', () => {
  beforeEach(() => {
    (useChainId as Mock).mockReturnValue(123);
    (useShowCallsStatus as Mock).mockReturnValue({
      showCallsStatus: vi.fn(),
    });
    (getChainExplorer as Mock).mockReturnValue(mockGetChainExplorer);
  });

  it('should return correct status when transaction is pending', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'transactionPending', statusData: null },
    });
    const { result } = renderHook(() => useGetTransactionStatusLabel());
    expect(result.current.label).toBe('Confirm in wallet.');
  });

  it('should return status when transaction is building', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'buildingTransaction', statusData: null },
    });
    const { result } = renderHook(() => useGetTransactionStatusLabel());
    expect(result.current.label).toBe('Building transaction...');
  });

  it('should return status when transaction hash exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      transactionHash: '0x123',
    });
    const { result } = renderHook(() => useGetTransactionStatusLabel());
    expect(result.current.label).toBe('Transaction in progress...');
  });

  it('should return status when transaction id exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      transactionId: 'ab123',
      onSubmit: vi.fn(),
    });
    const showCallsStatus = vi.fn();
    (useShowCallsStatus as Mock).mockReturnValue({ showCallsStatus });
    const { result } = renderHook(() => useGetTransactionStatusLabel());
    expect(result.current.label).toBe('Transaction in progress...');
  });

  it('should return status when receipt exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      receipt: 'receipt',
      transactionHash: '123',
    });
    const { result } = renderHook(() => useGetTransactionStatusLabel());
    expect(result.current.label).toBe('Successful');
  });

  it('should return status when error occurs', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      errorMessage: 'error',
    });
    const { result } = renderHook(() => useGetTransactionStatusLabel());
    expect(result.current.label).toBe('error');
  });

  it('should return status when no status available', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      errorMessage: '',
    });
    const { result } = renderHook(() => useGetTransactionStatusLabel());
    expect(result.current.label).toBe('');
  });
});
