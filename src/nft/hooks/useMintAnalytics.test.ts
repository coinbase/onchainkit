import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { MintEvent } from '@/core/analytics/types';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { useMintAnalytics } from '@/nft/hooks/useMintAnalytics';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/analytics/hooks/useAnalytics');
vi.mock('@/nft/components/NFTProvider');

describe('useMintAnalytics', () => {
  let mockSendAnalytics: Mock;

  beforeEach(() => {
    mockSendAnalytics = vi.fn();
    (useAnalytics as Mock).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });
    (useNFTContext as Mock).mockReturnValue({
      contractAddress: '0x123',
      tokenId: '1',
      quantity: 1,
      isSponsored: true,
    });
  });

  it('should send MintInitiated analytics when transaction starts building', () => {
    const { result } = renderHook(() => useMintAnalytics());

    act(() => {
      result.current.setTransactionState('buildingTransaction');
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(MintEvent.MintInitiated, {
      contractAddress: '0x123',
      tokenId: '1',
      quantity: 1,
      isSponsored: true,
    });
  });

  it('should send MintSuccess analytics when transaction succeeds', () => {
    const { result } = renderHook(() => useMintAnalytics());

    act(() => {
      result.current.setTransactionState('success');
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(MintEvent.MintSuccess, {
      contractAddress: '0x123',
      tokenId: '1',
      quantity: 1,
      isSponsored: true,
      amountMinted: 1,
    });
  });

  it('should send MintFailure analytics when transaction fails', () => {
    const { result } = renderHook(() => useMintAnalytics());

    act(() => {
      result.current.setTransactionState('error');
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(MintEvent.MintFailure, {
      error: 'Transaction failed',
      metadata: {
        contractAddress: '0x123',
        tokenId: '1',
        quantity: 1,
        isSponsored: true,
      },
    });
  });

  it('should send MintQuantityChanged analytics when quantity changes', () => {
    const { result } = renderHook(() => useMintAnalytics());

    act(() => {
      result.current.handleQuantityChange(2);
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(
      MintEvent.MintQuantityChanged,
      {
        quantity: 2,
      },
    );
  });

  it('should only send success analytics once for multiple success states', () => {
    const { result } = renderHook(() => useMintAnalytics());

    act(() => {
      result.current.setTransactionState('success');
      result.current.setTransactionState('success');
    });

    expect(mockSendAnalytics).toHaveBeenCalledTimes(1);
  });

  it('should only send error analytics once for multiple error states', () => {
    const { result } = renderHook(() => useMintAnalytics());

    act(() => {
      result.current.setTransactionState('error');
      result.current.setTransactionState('error');
    });

    expect(mockSendAnalytics).toHaveBeenCalledTimes(1);
  });

  it('should reset success flag when building new transaction', () => {
    const { result } = renderHook(() => useMintAnalytics());

    act(() => {
      result.current.setTransactionState('success');
    });

    act(() => {
      result.current.setTransactionState('buildingTransaction');
    });

    act(() => {
      result.current.setTransactionState('success');
    });

    expect(mockSendAnalytics).toHaveBeenCalledTimes(3);
    expect(mockSendAnalytics).toHaveBeenNthCalledWith(
      2,
      MintEvent.MintInitiated,
      expect.any(Object),
    );
    expect(mockSendAnalytics).toHaveBeenNthCalledWith(
      3,
      MintEvent.MintSuccess,
      expect.any(Object),
    );
  });
});
