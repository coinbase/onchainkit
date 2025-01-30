'use client';

import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { Transaction } from '@/transaction/components/Transaction';
import { TransactionButton } from '@/transaction/components/TransactionButton';
import { useTransactionContext } from '@/transaction/components/TransactionProvider';
import { TransactionStatus } from '@/transaction/components/TransactionStatus';
import { TransactionStatusAction } from '@/transaction/components/TransactionStatusAction';
import { TransactionStatusLabel } from '@/transaction/components/TransactionStatusLabel';
import type { Call, LifecycleStatus, TransactionButtonReact } from '@/transaction/types';
import { type Chain, base } from 'viem/chains';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import { useWalletContext } from '../../WalletProvider';
import type { SendLifecycleStatus } from '../types';
import { defaultSendTxSuccessHandler } from '@/wallet/components/WalletAdvancedSend/utils/defaultSendTxSuccessHandler';
import type { LifecycleStatusUpdate } from '@/internal/types';
import { useCallback } from 'react';

type SendButtonProps = {
  label?: string;
  senderChain?: Chain | null;
  cryptoAmount: string | null;
  selectedToken: PortfolioTokenWithFiatValue | null;
  isSponsored?: boolean;
  callData: Call | null;
  onStatus?: (status: LifecycleStatusUpdate<SendLifecycleStatus>) => void;
  className?: string;
} & Pick<
  TransactionButtonReact,
  'disabled' | 'pendingOverride' | 'successOverride' | 'errorOverride'
>;

export function SendButton({
  label = 'Continue',
  senderChain,
  disabled,
  isSponsored = false,
  callData,
  onStatus,
  pendingOverride,
  successOverride,
  errorOverride,
  className,
}: SendButtonProps) {
  const handleStatus = useCallback(
    (status: LifecycleStatus) => {
      const validStatuses = [
        'transactionPending',
        'transactionLegacyExecuted',
        'success',
        'error',
    ] as const;
    if (
      validStatuses.includes(
        status.statusName as (typeof validStatuses)[number],
      )
    ) {
      onStatus?.(status as LifecycleStatusUpdate<SendLifecycleStatus>);
    }
  }, [onStatus]);

  return (
    <Transaction
      isSponsored={isSponsored}
      chainId={senderChain?.id ?? base.id}
      calls={callData ? [callData] : []}
      onStatus={handleStatus}
    >
      <SendTransactionButton
        label={label}
        senderChain={senderChain}
        pendingOverride={pendingOverride}
        errorOverride={errorOverride}
        successOverride={successOverride}
        disabled={disabled}
        className={className}
      />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
}

/**
 * SendTransactionButton required to be a nested component in order to pull from TransactionContext.
 * Need to pull from TransactionContext in order to get transactionHash and transactionId.
 * Need transactionHash and transactionId in order to determine where to open the transaction in the wallet or explorer.
 */
function SendTransactionButton({
  label,
  senderChain,
  disabled,
  pendingOverride,
  successOverride,
  errorOverride,
  className,
}: {
  label: string;
  senderChain?: Chain | null;
  disabled?: boolean;
  pendingOverride?: TransactionButtonReact['pendingOverride'];
  successOverride?: TransactionButtonReact['successOverride'];
  errorOverride?: TransactionButtonReact['errorOverride'];
  className?: string;
}) {
  const { address } = useWalletContext();
  const { setShowSend } = useWalletAdvancedContext();
  const { transactionHash, transactionId } = useTransactionContext();
  const defaultSuccessOverride = {
    onClick: defaultSendTxSuccessHandler({
      transactionId,
      transactionHash,
      senderChain: senderChain ?? undefined,
      address: address ?? undefined,
      onComplete: () => setShowSend(false),
    }),
  };

  return (
    <TransactionButton
      className={className}
      text={label}
      pendingOverride={pendingOverride}
      successOverride={successOverride ?? defaultSuccessOverride}
      errorOverride={errorOverride}
      disabled={disabled}
    />
  );
}
