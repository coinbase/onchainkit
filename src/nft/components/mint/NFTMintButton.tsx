import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Spinner } from '../../../internal/components/Spinner';
import { cn, color, text } from '../../../styles/theme';
import {
  Transaction,
  TransactionButton,
  type TransactionButtonReact,
  type LifecycleStatus as TransactionLifecycleStatus,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '../../../transaction';
import type { Call } from '../../../transaction/types';
import { ConnectWallet } from '../../../wallet';
import { useNFTLifecycleContext } from '../NFTLifecycleProvider';
import { useNFTContext } from '../NFTProvider';

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
    isEligibleToMint,
    buildMintTransaction,
    quantity,
    isSponsored,
  } = useNFTContext();
  const { updateLifecycleStatus } = useNFTLifecycleContext();
  const [callData, setCallData] = useState<Call[]>([]);
  const [mintError, setMintError] = useState<string | null>(null);

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
    if (address && buildMintTransaction) {
      try {
        setCallData([]);
        setMintError(null);
        const mintTransaction = await buildMintTransaction({
          contractAddress,
          tokenId,
          takerAddress: address,
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
    contractAddress,
    tokenId,
    quantity,
    buildMintTransaction,
    handleTransactionError,
  ]);

  useEffect(() => {
    // need to fetch calls on quantity change instead of onClick to avoid smart wallet
    // popups getting blocked by safari
    fetchTransactions();
  }, [fetchTransactions]);

  const handleOnStatus = useCallback(
    (transactionStatus: TransactionLifecycleStatus) => {
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
    [updateLifecycleStatus],
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
    return (
      <div className={cn('pt-2', className)}>
        <ConnectWallet className="w-full" />
      </div>
    );
  }

  return (
    <div className={cn('pt-2', className)}>
      <Transaction
        isSponsored={isSponsored}
        chainId={chainId}
        calls={callData}
        onStatus={handleOnStatus}
      >
        <TransactionButton
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
    </div>
  );
}
