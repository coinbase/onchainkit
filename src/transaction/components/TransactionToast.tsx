import { useCallback, useEffect, useMemo } from 'react';
import { closeSvg } from '../../internal/svg/closeSvg';
import { cn } from '../../styles/theme';
import type { TransactionToastReact } from '../types';
import { useTransactionContext } from './TransactionProvider';

export function TransactionToast({
  children,
  className,
  durationMs = 3000,
  position = 'bottom-center',
}: TransactionToastReact) {
  const {
    errorMessage,
    isLoading,
    isToastVisible,
    receipt,
    setIsToastVisible,
    transactionHash,
    transactionId,
  } = useTransactionContext();

  const closeToast = useCallback(() => {
    setIsToastVisible(false);
  }, [setIsToastVisible]);

  const positionClass = useMemo(() => {
    if (position === 'bottom-right') {
      return 'bottom-5 left-3/4';
    }
    if (position === 'top-right') {
      return 'top-[100px] left-3/4';
    }
    if (position === 'top-center') {
      return 'top-[100px] left-2/4';
    }
    return 'bottom-5 left-2/4';
  }, [position]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    // hide toast after 5 seconds once
    // it reaches final state (success or error)
    if (receipt || errorMessage) {
      timer = setTimeout(() => {
        setIsToastVisible(false);
      }, durationMs);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessage, durationMs, receipt, setIsToastVisible]);

  const isInProgress =
    !receipt &&
    !isLoading &&
    !transactionHash &&
    !errorMessage &&
    !transactionId;

  if (!isToastVisible || isInProgress) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex animate-enter items-center justify-between rounded-lg',
        'bg-gray-100 p-2 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]',
        '-translate-x-2/4 fixed z-20',
        positionClass,
        className,
      )}
    >
      <div className="flex items-center gap-4 p-2">{children}</div>
      <button
        className="p-2"
        onClick={closeToast}
        type="button"
        data-testid="ockCloseButton"
      >
        {closeSvg}
      </button>
    </div>
  );
}
