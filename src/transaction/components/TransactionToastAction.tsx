import { cn, text } from '../../styles/theme';
import { useGetTransactionToast } from '../hooks/useGetTransactionToast';
import type { TransactionToastActionReact } from '../types';

export function TransactionToastAction({
  className,
}: TransactionToastActionReact) {
  const { actionElement } = useGetTransactionToast();

  return (
    <div className={cn(text.label1, 'text-nowrap', className)}>
      {actionElement}
    </div>
  );
}
