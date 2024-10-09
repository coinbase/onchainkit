import { useCallback, useMemo } from 'react';
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
  const { isEligibleToMint, callData, mintError } = useNftMintContext();
  const { updateLifecycleStatus } = useNftLifecycleContext();

  const calls = useMemo(() => {
    if (!callData) {
      return [];
    }

    return [
      {
        to: callData.to,
        data: callData.data,
        value: BigInt(callData.value),
      },
    ];
  }, [callData]);

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
    // {
    //   "code": 3,
    //   "message": "max mints per wallet exceeded"
    // }
    if (mintError) {
      return mintError.message;
    }

    if (isEligibleToMint === false) {
      return 'Mint ended';
    }

    if (!callData) {
      return <Spinner />;
    }

    return label;
  }, [isEligibleToMint, callData, mintError, label]);

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
          disabled={!callData || !isEligibleToMint}
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
