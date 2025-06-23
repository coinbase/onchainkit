import { cn, text } from '../../styles/theme';
import type { TransactionSponsorProps } from '../types';
import { useTransactionContext } from './TransactionProvider';

export function TransactionSponsor({ className }: TransactionSponsorProps) {
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
      <p className={'text-foreground-muted'}>Zero transaction fee</p>
    </div>
  );
}
