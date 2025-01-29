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
import { useMemo } from 'react';
import { useSendContext } from './SendProvider';

type SendButtonProps = {
  label?: string;
  className?: string;
} & Pick<
  TransactionButtonReact,
  'disabled' | 'pendingOverride' | 'successOverride' | 'errorOverride'
>;

export function SendButton({
  label = 'Continue',
  className,
  disabled,
  successOverride,
  pendingOverride,
  errorOverride,
}: SendButtonProps) {
  const isSponsored = false;
  const chainId = 8453;

  const { cryptoAmount, selectedToken, callData, sendTransactionError } =
    useSendContext();

  const handleOnStatus = () => {};

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
        chainId={chainId}
        calls={callData ? [callData] : []}
        onStatus={handleOnStatus}
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
