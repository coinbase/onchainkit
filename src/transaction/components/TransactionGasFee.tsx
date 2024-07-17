import { cn } from '../../styles/theme';
import { useTransactionContext } from './TransactionProvider';
import type { TransactionGasFeeReact } from '../types';

export function TransactionGasFee({
  children,
  className,
}: TransactionGasFeeReact) {
  const { status } = useTransactionContext();
  if (status !== 'idle') {
    return null;
  }
  return (
    <div className={cn('flex justify-between', className)}>{children}</div>
  );
}
