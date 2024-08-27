import { Avatar, Name } from '../../identity';
import { Spinner } from '../../internal/components/Spinner';
import { background, cn, color, pressable, text } from '../../styles/theme';
import { ConnectWallet, Wallet } from '../../wallet';
import type { SwapButtonReact } from '../types';
import { useSwapContext } from './SwapProvider';

export function SwapButton({ className, disabled = false }: SwapButtonReact) {
  const { address, to, from, loading, isTransactionPending, handleSubmit } =
    useSwapContext();

  const isLoading =
    to.loading || from.loading || loading || isTransactionPending;

  const isDisabled =
    !from.amount ||
    !from.token ||
    !to.amount ||
    !to.token ||
    disabled ||
    isLoading;

  // prompt user to connect wallet
  if (!isDisabled && !address) {
    return (
      <Wallet className="mt-4 w-full">
        <ConnectWallet className="w-full">
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
      </Wallet>
    );
  }
  return (
    <button
      type="button"
      className={cn(
        background.primary,
        'w-full rounded-xl',
        'mt-4 px-4 py-3',
        isDisabled && pressable.disabled,
        text.headline,
        className,
      )}
      onClick={() => handleSubmit()}
      disabled={isDisabled}
      data-testid="ockSwapButton_Button"
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <span className={cn(text.headline, color.inverse)}>Swap</span>
      )}
    </button>
  );
}
