import { cn } from '../../styles/theme';
import type { TransactionGasFeeReact } from '../types';

export function TransactionGasFee({
  children,
  className,
}: TransactionGasFeeReact) {
  return (
    <div className={cn('flex justify-between', className)}>{children}</div>
  );
}
