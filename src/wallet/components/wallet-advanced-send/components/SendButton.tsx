'use client';

import type { PortfolioTokenWithFiatValue } from '@/api/types';
import type { LifecycleStatusUpdate } from '@/internal/types';
import { Transaction } from '@/transaction/components/Transaction';
import { TransactionButton } from '@/transaction/components/TransactionButton';
import { useTransactionContext } from '@/transaction/components/TransactionProvider';
import { TransactionStatus } from '@/transaction/components/TransactionStatus';
import { TransactionStatusAction } from '@/transaction/components/TransactionStatusAction';
import { TransactionStatusLabel } from '@/transaction/components/TransactionStatusLabel';
import type {
  LifecycleStatus,
  TransactionButtonReact,
} from '@/transaction/types';
import { useCallback } from 'react';
import { parseUnits } from 'viem';
import { type Chain, base } from 'viem/chains';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import { useWalletContext } from '../../WalletProvider';
import type { SendLifecycleStatus } from '../types';
import { defaultSendTxSuccessHandler } from '../utils/defaultSendTxSuccessHandler';
import { useSendContext } from './SendProvider';

type SendButtonProps = {
  label?: string;
  isSponsored?: boolean;
  className?: string;
} & Pick<
  TransactionButtonReact,
  'disabled' | 'pendingOverride' | 'successOverride' | 'errorOverride'
>;

export function SendButton({
  label,
  isSponsored = false,
  className,
  disabled,
  pendingOverride,
  successOverride,
  errorOverride,
}: SendButtonProps) {
  const { chain: senderChain } = useWalletContext();
  const { callData, cryptoAmount, selectedToken, updateLifecycleStatus } =
    useSendContext();

  const disableSendButton =
    disabled ??
    !validateAmountInput({
      cryptoAmount: cryptoAmount ?? '',
      selectedToken: selectedToken ?? undefined,
    });

  const buttonLabel =
    label ?? getDefaultSendButtonLabel(cryptoAmount, selectedToken);

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
        updateLifecycleStatus(
          status as LifecycleStatusUpdate<SendLifecycleStatus>,
        );
      }
    },
    [updateLifecycleStatus],
  );

  return (
    <Transaction
      isSponsored={isSponsored}
      chainId={senderChain?.id ?? base.id}
      calls={callData ? [callData] : []}
      onStatus={handleStatus}
    >
      <SendTransactionButton
        label={buttonLabel}
        senderChain={senderChain}
        pendingOverride={pendingOverride}
        errorOverride={errorOverride}
        successOverride={successOverride}
        disabled={disableSendButton}
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

function getDefaultSendButtonLabel(
  cryptoAmount: string | null,
  selectedToken: PortfolioTokenWithFiatValue | null,
) {
  if (!cryptoAmount) {
    return 'Input amount';
  }

  if (!selectedToken) {
    return 'Select token';
  }

  if (
    parseUnits(cryptoAmount, selectedToken.decimals) >
    selectedToken.cryptoBalance
  ) {
    return 'Insufficient balance';
  }

  return 'Continue';
}

function validateAmountInput({
  cryptoAmount,
  selectedToken,
}: {
  cryptoAmount?: string;
  selectedToken?: PortfolioTokenWithFiatValue;
}) {
  if (!cryptoAmount || !selectedToken) {
    return false;
  }

  const parsedCryptoAmount = parseUnits(cryptoAmount, selectedToken.decimals);

  return (
    parsedCryptoAmount > 0n && parsedCryptoAmount <= selectedToken.cryptoBalance
  );
}
