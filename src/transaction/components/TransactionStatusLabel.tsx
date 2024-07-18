import { cn, text } from '../../styles/theme';
import { useGetTransactionStatus } from '../hooks/useGetTransactionStatus';
import type { TransactionStatusLabelReact } from '../types';

export function TransactionStatusLabel({
  className,
}: TransactionStatusLabelReact) {
  const { label, labelClassName } = useGetTransactionStatus();

  return (
    <div className={cn(text.label2, className)}>
      <p className={labelClassName}>{label}</p>
    </div>
  );
}
