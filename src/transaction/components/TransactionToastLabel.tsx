import { cn, color, text } from '../../styles/theme';
import { useGetTransactionToast } from '../core/useGetTransactionToast';
import type { TransactionToastLabelReact } from '../types';

export function TransactionToastLabel({
  className,
}: TransactionToastLabelReact) {
  const { label } = useGetTransactionToast();
  return (
    <div className={cn(text.label1, className)}>
      <p className={color.foreground}>{label}</p>
    </div>
  );
}
