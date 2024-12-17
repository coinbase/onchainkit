import { errorSvg } from '@/core/svg/errorSvg';
import { successSvg } from '@/core/svg/successSvg';
import { useMemo } from 'react';
import { cn, text } from '../../styles/theme';
import { Spinner } from '../../ui/react/internal/Spinner';
import type { TransactionToastIconReact } from '../types';
import { useTransactionContext } from './TransactionProvider';

export function TransactionToastIcon({ className }: TransactionToastIconReact) {
  const { errorMessage, isLoading, receipt, transactionHash, transactionId } =
    useTransactionContext();
  const isInProgress = isLoading || !!transactionId || !!transactionHash;

  const icon = useMemo(() => {
    // txn successful
    if (receipt) {
      return successSvg;
    }
    if (errorMessage) {
      return errorSvg;
    }
    if (isInProgress) {
      return <Spinner className="px-1.5 py-1.5" />;
    }
    return null;
  }, [isInProgress, errorMessage, receipt]);

  if (!icon) {
    return null;
  }

  return <div className={cn(text.label2, className)}>{icon}</div>;
}
