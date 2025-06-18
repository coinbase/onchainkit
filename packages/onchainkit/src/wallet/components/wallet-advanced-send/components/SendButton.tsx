'use client';

import type { PortfolioTokenWithFiatValue } from '@/api/types';
import type { LifecycleStatusUpdate } from '@/internal/types';
import { Transaction } from '@/transaction/components/Transaction';
import { TransactionButton } from '@/transaction/components/TransactionButton';
import { TransactionStatus } from '@/transaction/components/TransactionStatus';
import { TransactionStatusAction } from '@/transaction/components/TransactionStatusAction';
import { TransactionStatusLabel } from '@/transaction/components/TransactionStatusLabel';
import type {
  LifecycleStatus,
  TransactionButtonRenderParams,
} from '@/transaction/types';
import { useCallback } from 'react';
import { parseUnits } from 'viem';
import { base } from 'viem/chains';
import { useWalletContext } from '../../WalletProvider';
import type { SendLifecycleStatus } from '../types';
import { getSendCalldata } from '../utils/getSendCalldata';
import { useSendContext } from './SendProvider';
import { RenderSendButton } from './RenderSendButton';

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
      <TransactionButton
        text={buttonLabel}
        render={(params: TransactionButtonRenderParams) => (
          <RenderSendButton {...params} label={buttonLabel} />
        )}
        disabled={disableSendButton}
      />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
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
