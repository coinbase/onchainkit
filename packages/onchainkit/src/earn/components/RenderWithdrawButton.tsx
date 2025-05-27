import { Spinner } from '@/internal/components/Spinner';
import { cn, pressable, text } from '@/styles/theme';
import { TransactionButtonRenderParams } from '@/transaction/types';

export type RenderWithdrawButtonProps = TransactionButtonRenderParams & {
  withdrawAmountError: string | null;
  withdrawnAmount: string;
  vaultToken?: { symbol: string };
};

export function RenderWithdrawButton({
  context,
  onSubmit,
  onSuccess,
  isDisabled,
  withdrawAmountError,
  withdrawnAmount,
  vaultToken,
}: RenderWithdrawButtonProps) {
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
        {`Withdrew ${withdrawnAmount} ${vaultToken?.symbol}`}
      </button>
    );
  }
  if (context.errorMessage) {
    return (
      <button className={classNames} onClick={onSubmit} disabled={isDisabled}>
        {withdrawAmountError ?? 'Try again'}
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
      Withdraw
    </button>
  );
}
