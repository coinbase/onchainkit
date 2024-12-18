import { cn } from '../../../../styles/theme';
import type { TransactionStatusReact } from '../../../../core-react/transaction/types';

export function TransactionStatus({
  children,
  className,
}: TransactionStatusReact) {
  return (
    <div className={cn('flex justify-between', className)}>{children}</div>
  );
}
