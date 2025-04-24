import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { MintEvent } from '@/core/analytics/types';
import { getNewReactQueryTestProvider } from '@/identity/hooks/getNewReactQueryTestProvider';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { useMintAnalytics } from '@/nft/hooks/useMintAnalytics';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, createConfig, useAccount } from 'wagmi';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';

vi.mock('@/core/analytics/hooks/useAnalytics');
vi.mock('@/nft/components/NFTProvider');
vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');
  return {
    ...actual,
    useAccount: vi.fn(),
  };
});

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const Wrapper = ({ children }: PropsWithChildren) => {
  const QueryProvider = getNewReactQueryTestProvider();
  return React.createElement(
    WagmiProvider,
    { config },
    React.createElement(QueryProvider, null, children),
  );
};

describe('useMintAnalytics', () => {
  let mockSendAnalytics: Mock;
  const mockNFTContext = {
    contractAddress: '0x123',
    tokenId: '1',
    quantity: 1,
    isSponsored: true,
  };
  const mockAddress = '0xabc' as `0x${string}`;

  beforeEach(() => {
    mockSendAnalytics = vi.fn();
    (useAnalytics as Mock).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });
    (useNFTContext as Mock).mockReturnValue(mockNFTContext);
    (useAccount as Mock).mockReturnValue({ address: mockAddress });
  });

  it('should send MintInitiated analytics when transaction starts building', () => {
    const { result } = renderHook(() => useMintAnalytics(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.setTransactionState('buildingTransaction');
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(MintEvent.MintInitiated, {
      address: mockAddress,
      contractAddress: mockNFTContext.contractAddress,
      tokenId: mockNFTContext.tokenId,
      quantity: mockNFTContext.quantity,
      isSponsored: mockNFTContext.isSponsored,
    });
  });

  it('should send MintSuccess analytics when transaction succeeds', () => {
    const { result } = renderHook(() => useMintAnalytics(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.setTransactionState('success');
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(MintEvent.MintSuccess, {
      address: mockAddress,
      contractAddress: mockNFTContext.contractAddress,
      tokenId: mockNFTContext.tokenId,
      quantity: mockNFTContext.quantity,
      isSponsored: mockNFTContext.isSponsored,
      amountMinted: mockNFTContext.quantity,
    });
  });

  it('should send MintFailure analytics when transaction fails', () => {
    const { result } = renderHook(() => useMintAnalytics(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.setTransactionState('error');
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(MintEvent.MintFailure, {
      error: 'Transaction failed',
      metadata: {
        address: mockAddress,
        contractAddress: mockNFTContext.contractAddress,
        tokenId: mockNFTContext.tokenId,
        quantity: mockNFTContext.quantity,
        isSponsored: mockNFTContext.isSponsored,
      },
    });
  });

  it('should send MintQuantityChanged analytics when quantity changes', () => {
    const { result } = renderHook(() => useMintAnalytics(), {
      wrapper: Wrapper,
    });
    const newQuantity = 2;

    act(() => {
      result.current.handleQuantityChange(newQuantity);
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(
      MintEvent.MintQuantityChanged,
      {
        quantity: newQuantity,
      },
    );
  });

  it('should only send success analytics once for multiple success states', () => {
    const { result } = renderHook(() => useMintAnalytics(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.setTransactionState('success');
      result.current.setTransactionState('success');
    });

    expect(mockSendAnalytics).toHaveBeenCalledTimes(1);
  });

  it('should only send error analytics once for multiple error states', () => {
    const { result } = renderHook(() => useMintAnalytics(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.setTransactionState('error');
      result.current.setTransactionState('error');
    });

    expect(mockSendAnalytics).toHaveBeenCalledTimes(1);
  });

  it('should reset success flag when building new transaction', async () => {
    const { result } = renderHook(() => useMintAnalytics(), {
      wrapper: Wrapper,
    });

    // First success state
    await act(async () => {
      result.current.setTransactionState('success');
    });

    // Building new transaction
    await act(async () => {
      result.current.setTransactionState('buildingTransaction');
    });

    // Second success state
    await act(async () => {
      result.current.setTransactionState('success');
    });

    expect(mockSendAnalytics).toHaveBeenCalledTimes(3);

    // Verify the sequence of calls
    expect(mockSendAnalytics).toHaveBeenNthCalledWith(
      1,
      MintEvent.MintSuccess,
      {
        address: mockAddress,
        contractAddress: mockNFTContext.contractAddress,
        tokenId: mockNFTContext.tokenId,
        quantity: mockNFTContext.quantity,
        isSponsored: mockNFTContext.isSponsored,
        amountMinted: mockNFTContext.quantity,
      },
    );

    expect(mockSendAnalytics).toHaveBeenNthCalledWith(
      2,
      MintEvent.MintInitiated,
      {
        address: mockAddress,
        contractAddress: mockNFTContext.contractAddress,
        tokenId: mockNFTContext.tokenId,
        quantity: mockNFTContext.quantity,
        isSponsored: mockNFTContext.isSponsored,
      },
    );

    expect(mockSendAnalytics).toHaveBeenNthCalledWith(
      3,
      MintEvent.MintSuccess,
      {
        address: mockAddress,
        contractAddress: mockNFTContext.contractAddress,
        tokenId: mockNFTContext.tokenId,
        quantity: mockNFTContext.quantity,
        isSponsored: mockNFTContext.isSponsored,
        amountMinted: mockNFTContext.quantity,
      },
    );
  });
});
