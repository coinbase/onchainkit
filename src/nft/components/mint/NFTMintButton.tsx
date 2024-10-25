import { useCallback, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { cn } from '../../../styles/theme';
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
    if (isEligibleToMint === false) {
      return 'Minting not available';
    }

    return label;
  }, [isEligibleToMint, label]);

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
        calls={() =>
          buildMintTransaction({
            contractAddress,
            tokenId,
            takerAddress: address,
            quantity,
          })
        }
        onStatus={handleOnStatus}
      >
        <TransactionButton
          text={transactionButtonLabel}
          pendingOverride={pendingOverride}
          successOverride={successOverride}
          errorOverride={errorOverride}
          disabled={disabled || transactionButtonLabel !== label}
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
