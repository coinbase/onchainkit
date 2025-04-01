import { EarnEvent } from '@/core/analytics/types';
import { useEarnContext } from '@/earn/components/EarnProvider';
import { useWithdrawAnalytics } from '@/earn/hooks/useWithdrawAnalytics';
import { act, renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

const mockSendAnalytics = vi.fn();
vi.mock('../../core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    sendAnalytics: mockSendAnalytics,
  })),
}));

vi.mock('@/earn/components/EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

describe('useWithdrawAnalytics', () => {
  const mockContextData = {
    vaultAddress: '0xvault',
    vaultToken: {
      symbol: 'TEST',
      address: '0xtoken',
    },
    recipientAddress: '0xrecipient',
    withdrawAmount: '100',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useEarnContext as Mock).mockReturnValue(mockContextData);
  });

  it('should send initiated analytics when transaction starts building', () => {
    const { result } = renderHook(() => useWithdrawAnalytics('50'));

    act(() => {
      result.current.setTransactionState('buildingTransaction');
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(
      EarnEvent.EarnWithdrawInitiated,
      {
        amount: 100,
        address: '0xrecipient',
        tokenAddress: '0xtoken',
        vaultAddress: '0xvault',
      },
    );
  });

  it('should send success analytics only once', () => {
    const { result } = renderHook(() => useWithdrawAnalytics('50'));

    act(() => {
      result.current.setTransactionState('success');
      result.current.setTransactionState('success');
    });

    expect(mockSendAnalytics).toHaveBeenCalledTimes(1);
    expect(mockSendAnalytics).toHaveBeenCalledWith(
      EarnEvent.EarnWithdrawSuccess,
      {
        amount: 100,
        address: '0xrecipient',
        tokenAddress: '0xtoken',
        vaultAddress: '0xvault',
      },
    );
  });

  it('should send error analytics only once', () => {
    const { result } = renderHook(() => useWithdrawAnalytics('50'));

    act(() => {
      result.current.setTransactionState('error');
      result.current.setTransactionState('error');
    });

    expect(mockSendAnalytics).toHaveBeenCalledTimes(1);
    expect(mockSendAnalytics).toHaveBeenCalledWith(
      EarnEvent.EarnWithdrawFailure,
      {
        amount: 100,
        address: '0xrecipient',
        tokenAddress: '0xtoken',
        vaultAddress: '0xvault',
      },
    );
  });

  it('should use withdrawnAmount when withdrawAmount is 0', () => {
    (useEarnContext as Mock).mockReturnValue({
      ...mockContextData,
      withdrawAmount: '0',
    });

    const { result } = renderHook(() => useWithdrawAnalytics('50'));

    act(() => {
      result.current.setTransactionState('buildingTransaction');
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        amount: 50,
      }),
    );
  });

  it('should handle missing context values', () => {
    (useEarnContext as Mock).mockReturnValue({
      vaultAddress: '0xvault',
      vaultToken: null,
      recipientAddress: null,
      withdrawAmount: '100',
    });

    const { result } = renderHook(() => useWithdrawAnalytics('50'));

    act(() => {
      result.current.setTransactionState('buildingTransaction');
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(
      EarnEvent.EarnWithdrawInitiated,
      {
        amount: 100,
        address: '',
        tokenAddress: '',
        vaultAddress: '0xvault',
      },
    );
  });
});
