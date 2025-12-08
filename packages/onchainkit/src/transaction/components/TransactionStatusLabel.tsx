import { cn, text } from '../../styles/theme';
import { useGetTransactionStatusLabel } from '../hooks/useGetTransactionStatusLabel';
import type { TransactionStatusLabelProps } from '../types';

export function TransactionStatusLabel({
  className,
}: TransactionStatusLabelProps) {
  const { label, labelClassName } = useGetTransactionStatusLabel();

  return (
    <div className={cn(text.label2, className)}>
      <p className={labelClassName}>{label}</p>
    </div>
  );
}
