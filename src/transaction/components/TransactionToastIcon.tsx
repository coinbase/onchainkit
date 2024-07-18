import { cn, text } from '../../styles/theme';
import { useGetTransactionToast } from '../hooks/useGetTransactionToast';
import type { TransactionToastIconReact } from '../types';

export function TransactionToastIcon({ className }: TransactionToastIconReact) {
  const { icon } = useGetTransactionToast();
  return <div className={cn(text.label2, className)}>{icon}</div>;
}
