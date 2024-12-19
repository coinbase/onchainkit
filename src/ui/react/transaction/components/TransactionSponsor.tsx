import { useTransactionContext } from '@/core-react/transaction/providers/TransactionProvider';
import type { TransactionSponsorReact } from '@/core-react/transaction/types';
import { cn, color, text } from '@/styles/theme';

export function TransactionSponsor({ className }: TransactionSponsorReact) {
  const {
    errorMessage,
    lifecycleStatus,
    paymasterUrl,
    receipt,
    transactionHash,
    transactionId,
  } = useTransactionContext();

  const transactionInProgress = transactionId || transactionHash;
  if (
    lifecycleStatus.statusName !== 'init' ||
    !paymasterUrl ||
    errorMessage ||
    transactionInProgress ||
    receipt
  ) {
    return null;
  }

  return (
    <div className={cn(text.label2, 'flex', className)}>
      <p className={color.foregroundMuted}>Zero transaction fee</p>
    </div>
  );
}
