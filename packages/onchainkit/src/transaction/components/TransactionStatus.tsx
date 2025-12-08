import { cn } from '../../styles/theme';
import type { TransactionStatusProps } from '../types';
import { TransactionStatusAction } from './TransactionStatusAction';
import { TransactionStatusLabel } from './TransactionStatusLabel';

export function TransactionStatus({
  children,
  className,
}: TransactionStatusProps) {
  return (
    <div className={cn('flex justify-between', className)}>
      {children ?? (
        <>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </>
      )}
    </div>
  );
}
