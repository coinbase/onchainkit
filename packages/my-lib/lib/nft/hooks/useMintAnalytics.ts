import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { MintEvent } from '@/core/analytics/types';
import { useNFTContext } from '@/nft/components/NFTProvider';
import type { LifecycleStatus } from '@/transaction/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

export const useMintAnalytics = () => {
  const [transactionState, setTransactionState] = useState<
    LifecycleStatus['statusName'] | null
  >(null);
  const successSent = useRef(false);
  const errorSent = useRef(false);
  const { sendAnalytics } = useAnalytics();
  const { address } = useAccount();

  const { contractAddress, tokenId, quantity, isSponsored } = useNFTContext();

  const analyticsData = useMemo(() => {
    if (!tokenId || !address) {
      return null;
    }

    return {
      address,
      contractAddress,
      tokenId,
      quantity,
      isSponsored: isSponsored ?? false,
    };
  }, [address, contractAddress, tokenId, quantity, isSponsored]);

  useEffect(() => {
    if (!analyticsData) {
      return;
    }

    if (transactionState === 'buildingTransaction') {
      successSent.current = false;
      errorSent.current = false;
      sendAnalytics(MintEvent.MintInitiated, analyticsData);
    }

    if (transactionState === 'success' && !successSent.current) {
      successSent.current = true;
      sendAnalytics(MintEvent.MintSuccess, {
        ...analyticsData,
        amountMinted: quantity,
      });
    }

    if (transactionState === 'error' && !errorSent.current) {
      errorSent.current = true;
      sendAnalytics(MintEvent.MintFailure, {
        error: 'Transaction failed',
        metadata: analyticsData,
      });
    }
  }, [transactionState, quantity, analyticsData, sendAnalytics]);

  const handleQuantityChange = (newQuantity: number) => {
    sendAnalytics(MintEvent.MintQuantityChanged, {
      quantity: newQuantity,
    });
  };

  return {
    setTransactionState,
    handleQuantityChange,
  };
};
