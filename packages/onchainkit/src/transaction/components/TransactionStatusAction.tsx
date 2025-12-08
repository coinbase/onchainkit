import { cn, text } from '../../styles/theme';
import { useGetTransactionStatusAction } from '../hooks/useGetTransactionStatusAction';
import type { TransactionStatusActionProps } from '../types';

export function TransactionStatusAction({
  className,
}: TransactionStatusActionProps) {
  const { actionElement } = useGetTransactionStatusAction();

  return (
    <div className={cn(text.label2, 'min-w-[70px]', className)}>
      {actionElement}
    </div>
  );
}
