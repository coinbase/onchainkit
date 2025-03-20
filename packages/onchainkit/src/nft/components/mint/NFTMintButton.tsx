import { Spinner } from '@/internal/components/Spinner';
import { useNFTLifecycleContext } from '@/nft/components/NFTLifecycleProvider';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { useMintAnalytics } from '@/nft/hooks/useMintAnalytics';
import { cn, color, text } from '@/styles/theme';
import {
  Transaction,
  TransactionButton,
  type TransactionButtonReact,
  type LifecycleStatus as TransactionLifecycleStatus,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@/transaction';
import type { Call } from '@/transaction/types';
import { ConnectWallet } from '@/wallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';

type NFTMintButtonReact = {
  className?: string;
  label?: string;
} & Pick<
  TransactionButtonReact,
  'disabled' | 'pendingOverride' | 'successOverride' | 'errorOverride'
>;

export function NFTMintButton({
  className,
  label = 'Mint',
  disabled,
  pendingOverride,
  successOverride,
  errorOverride,
}: NFTMintButtonReact) {
  const chainId = useChainId();
  const { address } = useAccount();
  const {
    contractAddress,
    tokenId,
    network,
    isEligibleToMint,
    buildMintTransaction,
    isSponsored,
    quantity,
    name,
  } = useNFTContext();
  const { updateLifecycleStatus } = useNFTLifecycleContext();
  const [callData, setCallData] = useState<Call[]>([]);
  const [mintError, setMintError] = useState<string | null>(null);
  const { setTransactionState } = useMintAnalytics();

  const handleTransactionError = useCallback(
    (error: string) => {
      updateLifecycleStatus({
        statusName: 'error',
        statusData: {
          error: 'Error building mint transaction',
          code: 'NmNBc01', // NFT module NFTMintButton component 01 error
          message: error,
        },
      });
      setMintError(error);
    },
    [updateLifecycleStatus],
  );

  const fetchTransactions = useCallback(async () => {
    // don't fetch transactions until data is available
    if (name && address && buildMintTransaction && isEligibleToMint) {
      try {
        setCallData([]);
        setMintError(null);
        setTransactionState('buildingTransaction');
        const mintTransaction = await buildMintTransaction({
          takerAddress: address,
          contractAddress,
          tokenId,
          network,
          quantity,
        });
        setCallData(mintTransaction);
      } catch (error) {
        handleTransactionError(error as string);
      }
    } else {
      setCallData([]);
    }
  }, [
    address,
    buildMintTransaction,
    contractAddress,
    handleTransactionError,
    isEligibleToMint,
    name,
    network,
    quantity,
    setTransactionState,
    tokenId,
  ]);

  useEffect(() => {
    // need to fetch calls on quantity change instead of onClick to avoid smart wallet
    // popups getting blocked by safari
    fetchTransactions();
  }, [fetchTransactions]);

  const handleOnStatus = useCallback(
    (transactionStatus: TransactionLifecycleStatus) => {
      setTransactionState(transactionStatus.statusName);

      if (transactionStatus.statusName === 'transactionPending') {
        updateLifecycleStatus({ statusName: 'transactionPending' });
      }

      if (
        transactionStatus.statusName === 'transactionLegacyExecuted' ||
        transactionStatus.statusName === 'success' ||
        transactionStatus.statusName === 'error'
      ) {
        updateLifecycleStatus(transactionStatus);
      }
    },
    [updateLifecycleStatus, setTransactionState],
  );

  const transactionButtonLabel = useMemo(() => {
    if (isEligibleToMint === false || mintError) {
      return 'Minting not available';
    }

    if (callData.length === 0) {
      return <Spinner />;
    }

    return label;
  }, [callData, isEligibleToMint, label, mintError]);

  if (!buildMintTransaction) {
    return null;
  }

  if (!address) {
    return <ConnectWallet className={cn('w-full', className)} />;
  }

  return (
    <>
      <Transaction
        isSponsored={isSponsored}
        chainId={chainId}
        calls={callData}
        onStatus={handleOnStatus}
      >
        <TransactionButton
          className={className}
          text={transactionButtonLabel}
          pendingOverride={pendingOverride}
          successOverride={successOverride}
          errorOverride={errorOverride}
          disabled={disabled || transactionButtonLabel !== label}
        />
        {!mintError && <TransactionSponsor />}
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
      {mintError && (
        <div className={cn(text.label2, color.foregroundMuted, 'pb-2')}>
          {mintError}
        </div>
      )}
    </>
  );
}
