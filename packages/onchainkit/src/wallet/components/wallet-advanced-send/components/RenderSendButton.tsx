import { Spinner } from '@/internal/components/Spinner';
import { cn, pressable, text } from '@/styles/theme';
import {
  TransactionButtonRenderParams,
  useTransactionContext,
} from '@/transaction';
import { defaultSendTxSuccessHandler } from '../utils/defaultSendTxSuccessHandler';
import { useWalletContext } from '../../WalletProvider';
import { useAccount } from 'wagmi';
import { useOnchainKit } from '@/useOnchainKit';

export type RenderSendButtonProps = TransactionButtonRenderParams & {
  label?: string;
};

export function RenderSendButton({
  onSubmit,
  isDisabled,
  label,
}: RenderSendButtonProps) {
  const context = useTransactionContext();
  const { setActiveFeature } = useWalletContext();
  const { address } = useAccount();
  const { chain: senderChain } = useOnchainKit();

  const classNames = cn(
    pressable.primary,
    'rounded-ock-default',
    'w-full rounded-xl',
    'px-4 py-3 font-medium leading-6',
    isDisabled && pressable.disabled,
    text.headline,
    'text-ock-foreground',
  );

  if (context.receipt) {
    return (
      <button
        className={classNames}
        onClick={() =>
          defaultSendTxSuccessHandler({
            transactionId: context?.transactionId,
            transactionHash: context?.transactionHash,
            senderChain: senderChain ?? undefined,
            address: address ?? undefined,
            onComplete: () => setActiveFeature(null),
          })(context.receipt)
        }
        disabled={isDisabled}
      >
        View transaction
      </button>
    );
  }
  if (context.errorMessage) {
    return (
      <button className={classNames} onClick={onSubmit} disabled={isDisabled}>
        Try again
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
      {label}
    </button>
  );
}
