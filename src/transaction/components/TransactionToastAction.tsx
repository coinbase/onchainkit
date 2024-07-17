import { cn, text } from '../../styles/theme';
import { useGetTransactionToast } from '../core/useGetTransactionToast';
import type { TransactionToastActionReact } from '../types';

export function TransactionToastAction({
  className,
}: TransactionToastActionReact) {
  const { actionElement } = useGetTransactionToast();

  return <div className={cn(text.label1, className)}>{actionElement}</div>;
}
