import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useChainId } from 'wagmi';
import { useShowCallsStatus } from 'wagmi/experimental';
import { useTransactionContext } from '../components/TransactionProvider';
import { useGetTransactionLabel } from './useGetTransactionLabel';
import { getChainExplorer } from '../../network/getChainExplorer';

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

describe('useGetTransactionLabel', () => {
  beforeEach(() => {
    (useChainId as vi.Mock).mockReturnValue(123);
    (useShowCallsStatus as vi.Mock).mockReturnValue({
      showCallsStatus: vi.fn(),
    });
    (getChainExplorer as vi.Mock).mockReturnValue(mockGetChainExplorer);
  });

  describe('<TransactionStatus />', () => {
    it('should return correct status when transaction is pending', () => {
      (useTransactionContext as vi.Mock).mockReturnValue({
        statusWriteContract: 'pending',
      });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'status' }),
      );

      expect(result.current.label).toBe('Confirm in wallet.');
    });
    it('should return status when transaction hash exists', () => {
      (useTransactionContext as vi.Mock).mockReturnValue({
        transactionHash: '0x123',
      });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'status' }),
      );

      expect(result.current.label).toBe('Transaction in progress...');
    });

    it('should return status when transaction id exists', () => {
      (useTransactionContext as vi.Mock).mockReturnValue({
        transactionId: 'ab123',
        onSubmit: vi.fn(),
      });

      const showCallsStatus = vi.fn();
      (useShowCallsStatus as vi.Mock).mockReturnValue({ showCallsStatus });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'status' }),
      );

      expect(result.current.label).toBe('Transaction in progress...');
    });

    it('should return status when receipt exists', () => {
      (useTransactionContext as vi.Mock).mockReturnValue({
        receipt: 'receipt',
        transactionHash: '123',
      });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'status' }),
      );

      expect(result.current.label).toBe('Successful');
    });

    it('should return status when error occurs', () => {
      (useTransactionContext as vi.Mock).mockReturnValue({
        errorMessage: 'error',
      });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'status' }),
      );

      expect(result.current.label).toBe('error');
    });

    it('should return status when no status available', () => {
      (useTransactionContext as vi.Mock).mockReturnValue({
        errorMessage: '',
      });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'status' }),
      );

      expect(result.current.label).toBe('');
    });
  });

  describe('<TransactionToast />', () => {
    it('should return correct toast and actionElement when transaction is loading', () => {
      (useTransactionContext as vi.Mock).mockReturnValue({
        isLoading: true,
      });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'toast' }),
      );

      expect(result.current.label).toBe('Transaction in progress');
    });

    it('should return status when transaction hash exists', () => {
      (useTransactionContext as vi.Mock).mockReturnValue({
        transactionHash: '0x123',
      });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'toast' }),
      );

      expect(result.current.label).toBe('Transaction in progress');
    });

    it('should return status when transaction id exists', () => {
      (useTransactionContext as vi.Mock).mockReturnValue({
        transactionId: 'ab123',
        onSubmit: vi.fn(),
      });

      const showCallsStatus = vi.fn();
      (useShowCallsStatus as vi.Mock).mockReturnValue({ showCallsStatus });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'toast' }),
      );

      expect(result.current.label).toBe('Transaction in progress');
    });

    it('should return status when receipt exists', () => {
      (useTransactionContext as vi.Mock).mockReturnValue({
        receipt: 'receipt',
        transactionHash: '0x123',
      });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'toast' }),
      );

      expect(result.current.label).toBe('Successful');
    });

    it('should return status when error occurs', () => {
      const onSubmitMock = vi.fn();
      (useTransactionContext as vi.Mock).mockReturnValue({
        errorMessage: 'error',
        onSubmit: onSubmitMock,
      });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'toast' }),
      );

      expect(result.current.label).toBe('Something went wrong');
    });

    it('should return status when no status available', () => {
      (useTransactionContext as vi.Mock).mockReturnValue({
        errorMessage: '',
      });

      const { result } = renderHook(() =>
        useGetTransactionLabel({ context: 'toast' }),
      );

      expect(result.current.label).toBe('');
    });
  });
});
