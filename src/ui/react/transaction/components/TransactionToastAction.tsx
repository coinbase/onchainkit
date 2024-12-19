import type { TransactionToastActionReact } from '../../../../core-react/transaction/types';
import { cn, text } from '../../../../styles/theme';
import { useGetTransactionToastAction } from '../hooks/useGetTransactionToastAction';

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
