import type { TransactionStatusActionReact } from '../../../../core-react/transaction/types';
import { cn, text } from '../../../../styles/theme';
import { useGetTransactionStatusAction } from '../hooks/useGetTransactionStatusAction';

export function TransactionStatusAction({
  className,
}: TransactionStatusActionReact) {
  const { actionElement } = useGetTransactionStatusAction();

  return (
    <div className={cn(text.label2, 'min-w-[70px]', className)}>
      {actionElement}
    </div>
  );
}
