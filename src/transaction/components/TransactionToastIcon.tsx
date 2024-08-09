import { useMemo } from 'react';
import { cn, text } from '../../styles/theme';
import type { TransactionToastIconReact } from '../types';
import { useTransactionContext } from './TransactionProvider';
import { Spinner } from '../../internal/components/Spinner';
import { successSvg } from '../../internal/svg/successSvg';
import { errorSvg } from '../../internal/svg/errorSvg';

export function TransactionToastIcon({ className }: TransactionToastIconReact) {
  const { errorMessage, isLoading, receipt, transactionHash, transactionId } =
    useTransactionContext();
  const isInProgress = isLoading || !!transactionId || !!transactionHash;

  const icon = useMemo(() => {
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
  return <div className={cn(text.label2, className)}>{icon}</div>;
}
