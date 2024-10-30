import { cn, text } from '../../styles/theme';
import { useGetTransactionStatusLabel } from '../hooks/useGetTransactionStatusLabel';
import type { TransactionStatusLabelReact } from '../types';

export function TransactionStatusLabel({
  className,
}: TransactionStatusLabelReact) {
  const { label, labelClassName } = useGetTransactionStatusLabel();

  return (
    <div className={cn(text.label2, className)}>
      <p className={labelClassName}>{label}</p>
    </div>
  );
}
