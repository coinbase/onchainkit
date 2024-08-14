import { cn, text } from '../../styles/theme';
import { useGetTransactionToastAction } from '../hooks/useGetTransactionToastAction';
import type { TransactionToastActionReact } from '../types';

export function TransactionToastAction({
  className,
}: TransactionToastActionReact) {
  const { actionElement } = useGetTransactionToastAction();

  return (
    <div className={cn(text.label1, 'text-nowrap', className)}>
      {actionElement}
    </div>
  );
}
