import { cn, text } from '../../styles/theme';
import { useGetTransactionLabel } from '../hooks/useGetTransactionLabel';
import type { TransactionStatusLabelReact } from '../types';

export function TransactionStatusLabel({
  className,
}: TransactionStatusLabelReact) {
  const { label, labelClassName } = useGetTransactionLabel({
    context: 'status',
  });

  return (
    <div className={cn(text.label2, className)}>
      <p className={labelClassName}>{label}</p>
    </div>
  );
}
