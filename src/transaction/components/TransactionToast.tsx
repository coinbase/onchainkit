import { useCallback } from 'react';
import { cn } from '../../styles/theme';
import { useTransactionContext } from './TransactionProvider';
import type { TransactionToastReact } from '../types';

const closeSVG = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.14921 1L1 2.1492L6.8508 8L1 13.8508L2.1492 15L8 9.1492L13.8508 15L15 13.8508L9.14921 8L15 2.1492L13.8508 1L8 6.8508L2.14921 1Z"
      fill="#030712"
    />
  </svg>
);

export function TransactionToast({
  children,
  className,
}: TransactionToastReact) {
  const { isToastVisible, setIsToastVisible } = useTransactionContext();

  const closeToast = useCallback(() => {
    setIsToastVisible(false);
  }, [setIsToastVisible]);

  if (!isToastVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg',
        'p-2 bg-gray-100 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]',
        'fixed -translate-x-2/4 left-2/4 bottom-5',
        className,
      )}
    >
      <div className="flex items-center p-2 gap-4">{children}</div>
      <button className="p-2" onClick={closeToast} type="button">
        {closeSVG}
      </button>
    </div>
  );
}
