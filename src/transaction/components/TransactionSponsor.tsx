import { cn, color, text } from '../../styles/theme';
import type { TransactionSponsorReact } from '../types';
import { useTransactionContext } from './TransactionProvider';

export function TransactionSponsor({ className }: TransactionSponsorReact) {
  const {
    errorMessage,
    hasPaymaster,
    receipt,
    statusWriteContract,
    statusWriteContracts,
    transactionHash,
    transactionId,
  } = useTransactionContext();

  const transactionInProgress = transactionId || transactionHash;
  if (
    statusWriteContract !== 'idle' ||
    statusWriteContracts !== 'idle' ||
    !hasPaymaster ||
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
