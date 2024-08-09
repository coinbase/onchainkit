import { cn, text } from '../../styles/theme';
import { useGetTransactionAction } from '../hooks/useGetTransactionAction';
import type { TransactionStatusActionReact } from '../types';

export function TransactionStatusAction({
  className,
}: TransactionStatusActionReact) {
  const { actionElement } = useGetTransactionAction({ context: 'status' });

  return (
    <div className={cn(text.label2, 'min-w-[70px]', className)}>
      {actionElement}
    </div>
  );
}
