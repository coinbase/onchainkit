import { cn, text } from '../../styles/theme';
import { useGetTransactionStatus } from '../core/useGetTransactionStatus';
import type { TransactionStatusActionReact } from '../types';

export function TransactionStatusAction({
  className,
}: TransactionStatusActionReact) {
  const { actionElement } = useGetTransactionStatus();

  return <div className={cn(text.label2, className)}>{actionElement}</div>;
}
