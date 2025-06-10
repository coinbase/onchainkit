import { EarnEvent } from '@/core/analytics/types';
import { sendOCKAnalyticsEvent } from '@/core/analytics/utils/sendAnalytics';
import { useEarnContext } from '@/earn/components/EarnProvider';
import { useDepositAnalytics } from '@/earn/hooks/useDepositAnalytics';
import { act, renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/earn/components/EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('@/core/analytics/utils/sendAnalytics', () => ({
  sendOCKAnalyticsEvent: vi.fn(),
}));

describe('useDepositAnalytics', () => {
  const mockContextData = {
    vaultAddress: '0xvault',
    vaultToken: {
      symbol: 'TEST',
      address: '0xtoken',
    },
    recipientAddress: '0xrecipient',
    depositAmount: '100',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useEarnContext as Mock).mockReturnValue(mockContextData);
  });

  it('should send initiated analytics when transaction starts building', () => {
    const { result } = renderHook(() => useDepositAnalytics('50'));

    act(() => {
      result.current.setTransactionState('buildingTransaction');
    });

    expect(sendOCKAnalyticsEvent).toHaveBeenCalledWith(
      EarnEvent.EarnDepositInitiated,
      {
        amount: 100,
        address: '0xrecipient',
        tokenAddress: '0xtoken',
        vaultAddress: '0xvault',
      },
    );
  });

  it('should send success analytics only once', () => {
    const { result } = renderHook(() => useDepositAnalytics('50'));

    act(() => {
      result.current.setTransactionState('success');
      result.current.setTransactionState('success');
    });

    expect(sendOCKAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendOCKAnalyticsEvent).toHaveBeenCalledWith(
      EarnEvent.EarnDepositSuccess,
      {
        amount: 100,
        address: '0xrecipient',
        tokenAddress: '0xtoken',
        vaultAddress: '0xvault',
      },
    );
  });

  it('should send error analytics only once', () => {
    const { result } = renderHook(() => useDepositAnalytics('50'));

    act(() => {
      result.current.setTransactionState('error');
      result.current.setTransactionState('error');
    });

    expect(sendOCKAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendOCKAnalyticsEvent).toHaveBeenCalledWith(
      EarnEvent.EarnDepositFailure,
      {
        amount: 100,
        address: '0xrecipient',
        tokenAddress: '0xtoken',
        vaultAddress: '0xvault',
      },
    );
  });

  it('should use depositedAmount when depositAmount is 0', () => {
    (useEarnContext as Mock).mockReturnValue({
      ...mockContextData,
      depositAmount: '0',
    });

    const { result } = renderHook(() => useDepositAnalytics('50'));

    act(() => {
      result.current.setTransactionState('buildingTransaction');
    });

    expect(sendOCKAnalyticsEvent).toHaveBeenCalledWith(
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
      depositAmount: '100',
    });

    const { result } = renderHook(() => useDepositAnalytics('50'));

    act(() => {
      result.current.setTransactionState('buildingTransaction');
    });

    expect(sendOCKAnalyticsEvent).toHaveBeenCalledWith(
      EarnEvent.EarnDepositInitiated,
      {
        amount: 100,
        address: '',
        tokenAddress: '',
        vaultAddress: '0xvault',
      },
    );
  });
});
