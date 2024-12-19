import { useTransactionContext } from '@/core-react/transaction/providers/TransactionProvider';
import type { TransactionToastReact } from '@/core-react/transaction/types';
import { Toast } from '@/internal/components/Toast';
import { useCallback } from 'react';

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
