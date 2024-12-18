import { cn, text } from '../../../../styles/theme';
import { useGetTransactionStatusLabel } from '../../../../core-react/transaction/hooks/useGetTransactionStatusLabel';
import type { TransactionStatusLabelReact } from '../../../../core-react/transaction/types';

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
