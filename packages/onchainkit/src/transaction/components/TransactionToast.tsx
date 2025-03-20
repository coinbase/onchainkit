import { useCallback } from 'react';
import { Toast } from '../../internal/components/Toast';
import type { TransactionToastReact } from '../types';
import { useTransactionContext } from './TransactionProvider';

export function TransactionToast({
  children,
  className,
  durationMs = 5000,
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
      durationMs={durationMs}
      isVisible={isToastVisible}
      onClose={closeToast}
      startTimeout={!!receipt || !!errorMessage}
    >
      {children}
    </Toast>
  );
}
