import { cn, text } from '../../styles/theme';
import { useGetTransactionToastLabel } from '../hooks/useGetTransactionToastLabel';
import type { TransactionToastLabelReact } from '../types';

export function TransactionToastLabel({
  className,
}: TransactionToastLabelReact) {
  const { label } = useGetTransactionToastLabel();
  return (
    <div className={cn(text.label1, 'text-nowrap', className)}>
      <p className={'text-ock-text-foreground'}>{label}</p>
    </div>
  );
}
