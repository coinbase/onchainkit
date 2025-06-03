'use client';
import { Spinner } from '@/internal/components/Spinner';
import { cn, pressable, text } from '@/styles/theme';
import { ConnectWallet } from '@/wallet/components/ConnectWallet';
import type { SwapButtonReact } from '../types';
import { useSwapContext } from './SwapProvider';
import { Wallet } from '@/wallet';

export function SwapButton({
  className,
  label = 'Swap',
  disabled = false,
}: SwapButtonReact) {
  const {
    address,
    to,
    from,
    lifecycleStatus: { statusName },
    handleSubmit,
  } = useSwapContext();

  const isLoading =
    to.loading ||
    from.loading ||
    statusName === 'transactionPending' ||
    statusName === 'transactionApproved';

  const isDisabled =
    !from.amount ||
    !from.token ||
    !to.amount ||
    !to.token ||
    disabled ||
    isLoading;

  // disable swap if to and from token are the same
  const isSwapInvalid = to.token?.address === from.token?.address;

  // prompt user to connect wallet
  if (!isDisabled && !address) {
    return (
      <Wallet>
        <ConnectWallet className={cn('mt-4 w-full', className)} />
      </Wallet>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        'bg-ock-bg-primary',
        'rounded-ock-default',
        'w-full rounded-xl',
        'mt-4 px-4 py-3',
        isDisabled && pressable.disabled,
        text.headline,
        className,
      )}
      onClick={() => handleSubmit()}
      disabled={isDisabled || isSwapInvalid}
      data-testid="ockSwapButton_Button"
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <span className={cn(text.headline, 'text-ock-text-inverse')}>
          {label}
        </span>
      )}
    </button>
  );
}
