import { cn } from '../../styles/theme';
import type { TransactionStatusReact } from '../types';
import { TransactionStatusAction } from './TransactionStatusAction';
import { TransactionStatusLabel } from './TransactionStatusLabel';

function TransactionStatusDefaultContent() {
  return (
    <>
      <TransactionStatusLabel />
      <TransactionStatusAction />
    </>
  );
}

export function TransactionStatus({
  children = <TransactionStatusDefaultContent />,
  className,
}: TransactionStatusReact) {
  return (
    <div className={cn('flex justify-between', className)}>{children}</div>
  );
}
