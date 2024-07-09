import { createContext, useContext } from 'react';
import type { TransactionContextType } from '../types';
import { useValue } from '../../internal/hooks/useValue';

const emptyContext = {} as TransactionContextType;

export const TransactionContext =
  createContext<TransactionContextType>(emptyContext);

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (context === emptyContext) {
    throw new Error(
      'useTransactionContext must be used within a Transaction component',
    );
  }
  return context;
}

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useValue({
    error: undefined,
    loading: false,
  });

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
