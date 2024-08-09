import { cn, color, text } from '../../styles/theme';
import { useGetTransactionLabel } from '../hooks/useGetTransactionLabel';
import type { TransactionToastLabelReact } from '../types';

export function TransactionToastLabel({
  className,
}: TransactionToastLabelReact) {
  const { label } = useGetTransactionLabel({ context: 'toast' });
  return (
    <div className={cn(text.label1, 'text-nowrap', className)}>
      <p className={color.foreground}>{label}</p>
    </div>
  );
}
