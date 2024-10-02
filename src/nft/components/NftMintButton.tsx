import { useCallback, useEffect, useMemo } from 'react';
import {
  type LifecycleStatus as TransactionLifecycleStatus,
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '../../transaction';
import { useNftMintContext } from './NftMintProvider';
import { useAccount, useChainId } from 'wagmi';
import { cn } from '../../styles/theme';
import { Spinner } from '../../internal/components/Spinner';
import { useMintToken } from '../hooks/useMintToken';
import { useNftQuantityContext } from './NftQuantityProvider';
import { ConnectWallet } from '../../wallet';
import { useNftLifecycleContext } from './NftLifecycleProvider';

type NftMintButtonProps = {
  className?: string;
  label?: string;
};

export function NftMintButton({
  className,
  label = 'Mint',
}: NftMintButtonProps) {
  const chainId = useChainId();
  const { address } = useAccount();
  const { contractAddress, tokenId, network, isEligibleToMint } =
    useNftMintContext();
  const { quantity } = useNftQuantityContext();
  const { updateLifecycleStatus } = useNftLifecycleContext();

  const {
    data: mintToken,
    isError,
    error,
  } = useMintToken({
    mintAddress: contractAddress,
    takerAddress: address,
    network,
    quantity: quantity.toString(),
    tokenId,
  });

  useEffect(() => {
    if (isError) {
      updateLifecycleStatus({
        statusName: 'error',
        statusData: {
          error: error.message,
          code: 'NmNMBc01', // Nft module NftMintButton component 01 error
          message: 'Error fetching mint data',
        },
      });
    }
  }, [error, isError, updateLifecycleStatus]);

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

  const calls = useMemo(() => {
    if (!mintToken?.callData) {
      return [];
    }

    return [
      {
        to: mintToken.callData.to,
        data: mintToken.callData.data,
        value: BigInt(mintToken.callData.value),
      },
    ];
  }, [mintToken?.callData]);

  const transactionButtonLabel = useMemo(() => {
    if (isEligibleToMint === false) {
      return 'Mint ended';
    }

    if (!mintToken?.callData) {
      return <Spinner />;
    }

    return label;
  }, [isEligibleToMint, mintToken?.callData, label]);

  if (!address) {
    return (
      <div className={cn('py-2', className)}>
        <ConnectWallet className="w-full" />
      </div>
    );
  }

  return (
    <div className={cn('py-2', className)}>
      <Transaction chainId={chainId} calls={calls} onStatus={handleOnStatus}>
        <TransactionButton
          text={transactionButtonLabel}
          disabled={!mintToken?.callData || !isEligibleToMint}
        />
        <TransactionSponsor />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
