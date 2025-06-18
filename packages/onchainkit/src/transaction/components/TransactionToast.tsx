import { useCallback } from 'react';
import { Toast } from '../../internal/components/Toast';
import type { TransactionToastProps } from '../types';
import { useTransactionContext } from './TransactionProvider';
import { TransactionToastAction } from './TransactionToastAction';
import { TransactionToastIcon } from './TransactionToastIcon';
import { TransactionToastLabel } from './TransactionToastLabel';

export function TransactionToast({
  children,
  className,
  duration = 5000,
  position = 'bottom-center',
}: TransactionToastProps) {
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
    <Toast
      position={position}
      className={className}
      duration={duration}
      open={isToastVisible}
      onClose={closeToast}
    >
      {children ?? (
        <>
          <TransactionToastIcon />
          <TransactionToastLabel />
          <TransactionToastAction />
        </>
      )}
    </Toast>
  );
}
