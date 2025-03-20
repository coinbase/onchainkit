import { cn } from '../../styles/theme';
import type { TransactionStatusReact } from '../types';

export function TransactionStatus({
  children,
  className,
}: TransactionStatusReact) {
  return (
    <div className={cn('flex justify-between', className)}>{children}</div>
  );
}
