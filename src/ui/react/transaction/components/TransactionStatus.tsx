import type { TransactionStatusReact } from '../../../../core-react/transaction/types';
import { cn } from '../../../../styles/theme';

export function TransactionStatus({
  children,
  className,
}: TransactionStatusReact) {
  return (
    <div className={cn('flex justify-between', className)}>{children}</div>
  );
}
