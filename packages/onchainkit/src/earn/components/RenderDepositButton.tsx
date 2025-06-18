import { Spinner } from '@/internal/components/Spinner';
import { cn, pressable, text } from '@/styles/theme';
import { TransactionButtonRenderParams } from '@/transaction';

export type RenderDepositButtonProps = TransactionButtonRenderParams & {
  depositAmountError: string | null;
  depositedAmount: string;
  vaultToken?: { symbol: string };
};

export function RenderDepositButton({
  context,
  onSubmit,
  onSuccess,
  isDisabled,
  depositAmountError,
  depositedAmount,
  vaultToken,
}: RenderDepositButtonProps) {
  const classNames = cn(
    pressable.primary,
    'rounded-ock-default',
    'w-full rounded-xl',
    'px-4 py-3 font-medium leading-6',
    isDisabled && pressable.disabled,
    text.headline,
    'text-ock-text-inverse',
  );

  if (context.receipt) {
    return (
      <button className={classNames} onClick={onSuccess} disabled={isDisabled}>
        {`Deposited ${depositedAmount} ${vaultToken?.symbol}`}
      </button>
    );
  }
  if (context.errorMessage || depositAmountError) {
    return (
      <button className={classNames} onClick={onSubmit} disabled={isDisabled}>
        {depositAmountError ?? 'Try again'}
      </button>
    );
  }
  if (context.isLoading) {
    return (
      <button className={classNames} disabled={isDisabled}>
        <Spinner />
      </button>
    );
  }
  return (
    <button className={classNames} disabled={isDisabled} onClick={onSubmit}>
      Deposit
    </button>
  );
}
