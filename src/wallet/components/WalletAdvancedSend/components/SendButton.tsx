'use client';

import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { cn, color, text } from '@/styles/theme';
import {
  Transaction,
  TransactionButton,
  type TransactionButtonReact,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@/transaction';
import type { Call } from '@/transaction/types';
import { useMemo } from 'react';
import { type Chain, base } from 'viem/chains';

type SendButtonProps = {
  cryptoAmount: string | null;
  selectedToken: PortfolioTokenWithFiatValue | null;
  senderChain?: Chain | null;
  callData: Call | null;
  sendTransactionError: string | null;
  label?: string;
  className?: string;
} & Pick<
  TransactionButtonReact,
  'disabled' | 'pendingOverride' | 'successOverride' | 'errorOverride'
>;

export function SendButton({
  label = 'Continue',
  senderChain,
  className,
  disabled,
  successOverride,
  pendingOverride,
  errorOverride,
  cryptoAmount,
  selectedToken,
  callData,
  sendTransactionError,
}: SendButtonProps) {
  const isSponsored = false;

  const sendButtonLabel = useMemo(() => {
    if (
      Number(cryptoAmount) >
      Number(selectedToken?.cryptoBalance) /
        10 ** Number(selectedToken?.decimals)
    ) {
      return 'Insufficient balance';
    }
    return label;
  }, [cryptoAmount, label, selectedToken]);

  const isDisabled = useMemo(() => {
    if (disabled) {
      return true;
    }
    if (Number(cryptoAmount) <= 0) {
      return true;
    }
    if (
      Number(cryptoAmount) >
      Number(selectedToken?.cryptoBalance) /
        10 ** Number(selectedToken?.decimals)
    ) {
      return true;
    }
    return false;
  }, [cryptoAmount, disabled, selectedToken]);

  return (
    <>
      <Transaction
        isSponsored={isSponsored}
        chainId={senderChain?.id ?? base.id}
        calls={callData ? [callData] : []}
      >
        <TransactionButton
          className={className}
          text={sendButtonLabel}
          pendingOverride={pendingOverride}
          successOverride={successOverride}
          errorOverride={errorOverride}
          disabled={isDisabled}
        />
        {!sendTransactionError && <TransactionSponsor />}
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
      {sendTransactionError && (
        <div className={cn(text.label2, color.foregroundMuted, 'pb-2')}>
          {sendTransactionError}
        </div>
      )}
    </>
  );
}
