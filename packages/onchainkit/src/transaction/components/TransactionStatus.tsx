import { cn } from '../../styles/theme';
import type { TransactionStatusReact } from '../types';
import { TransactionStatusAction } from './TransactionStatusAction';
import { TransactionStatusLabel } from './TransactionStatusLabel';

export function TransactionStatus({
  children,
  className,
}: TransactionStatusReact) {
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
