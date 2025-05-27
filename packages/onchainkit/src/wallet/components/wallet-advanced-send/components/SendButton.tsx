'use client';

import type { PortfolioTokenWithFiatValue } from '@/api/types';
import type { LifecycleStatusUpdate } from '@/internal/types';
import { Transaction } from '@/transaction/components/Transaction';
import { TransactionButton } from '@/transaction/components/TransactionButton';
import { useTransactionContext } from '@/transaction/components/TransactionProvider';
import { TransactionStatus } from '@/transaction/components/TransactionStatus';
import { TransactionStatusAction } from '@/transaction/components/TransactionStatusAction';
import { TransactionStatusLabel } from '@/transaction/components/TransactionStatusLabel';
import type { LifecycleStatus } from '@/transaction/types';
import { useCallback } from 'react';
import { parseUnits } from 'viem';
import { type Chain, base } from 'viem/chains';
import { useWalletContext } from '../../WalletProvider';
import type { SendLifecycleStatus } from '../types';
import { defaultSendTxSuccessHandler } from '../utils/defaultSendTxSuccessHandler';
import { getSendCalldata } from '../utils/getSendCalldata';
import { useSendContext } from './SendProvider';

export function SendButton() {
  const { chain: senderChain, isSponsored } = useWalletContext();
  const {
    recipientState,
    cryptoAmount: inputAmount,
    selectedToken,
    updateLifecycleStatus,
  } = useSendContext();

  const { calldata, error } = getSendCalldata({
    recipientAddress: recipientState.address,
    token: selectedToken,
    amount: inputAmount,
  });

  const disableSendButton =
    Boolean(error) ||
    !validateAmountInput({
      inputAmount: inputAmount ?? '',
      balance: BigInt(selectedToken?.cryptoBalance ?? 0),
      selectedToken: selectedToken ?? undefined,
    });

  const buttonLabel = getDefaultSendButtonLabel(inputAmount, selectedToken);

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
      calls={calldata ? [calldata] : []}
      onStatus={handleStatus}
    >
      <SendTransactionButton
        label={buttonLabel}
        senderChain={senderChain}
        disabled={disableSendButton}
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
}: {
  label: string;
  senderChain?: Chain | null;
  disabled?: boolean;
}) {
  const { address, setActiveFeature } = useWalletContext();
  const { transactionHash, transactionId } = useTransactionContext();

  const completionHandler = useCallback(() => {
    setActiveFeature(null);
  }, [setActiveFeature]);

  const defaultSuccessOverride = {
    onClick: defaultSendTxSuccessHandler({
      transactionId,
      transactionHash,
      senderChain: senderChain ?? undefined,
      address: address ?? undefined,
      onComplete: completionHandler,
    }),
  };

  return (
    <TransactionButton
      text={label}
      successOverride={defaultSuccessOverride}
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
  inputAmount,
  balance,
  selectedToken,
}: {
  inputAmount?: string;
  balance?: bigint;
  selectedToken?: PortfolioTokenWithFiatValue;
}) {
  if (!inputAmount || !selectedToken || !balance) {
    return false;
  }

  const parsedCryptoAmount = parseUnits(inputAmount, selectedToken.decimals);

  return parsedCryptoAmount > 0n && parsedCryptoAmount <= balance;
}
