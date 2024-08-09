import { cn, text } from '../../styles/theme';
import { useGetTransactionAction } from '../hooks/useGetTransactionAction';
import type { TransactionToastActionReact } from '../types';

export function TransactionToastAction({
  className,
}: TransactionToastActionReact) {
  const { actionElement } = useGetTransactionAction({ context: 'toast' });

  return (
    <div className={cn(text.label1, 'text-nowrap', className)}>
      {actionElement}
    </div>
  );
}
