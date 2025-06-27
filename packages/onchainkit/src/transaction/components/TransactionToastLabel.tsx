import { cn, text } from '../../styles/theme';
import { useGetTransactionToastLabel } from '../hooks/useGetTransactionToastLabel';
import type { TransactionToastLabelProps } from '../types';

export function TransactionToastLabel({
  className,
}: TransactionToastLabelProps) {
  const { label } = useGetTransactionToastLabel();
  return (
    <div className={cn(text.label1, 'text-nowrap', className)}>
      <p className={'text-ock-foreground'}>{label}</p>
    </div>
  );
}
