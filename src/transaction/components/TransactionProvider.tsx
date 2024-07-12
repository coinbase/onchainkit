import { createContext, useContext, useEffect, useState } from 'react';
import type {
  TransactionContextType,
  TransactionProviderReact,
} from '../types';
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
  address,
  children,
  contracts,
}: TransactionProviderReact) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [gasFee, setGasFee] = useState('');

  useEffect(() => {
    // TODO: replace with gas estimation call
    setGasFee('0.03');
  }, []);

  const value = useValue({
    address,
    contracts,
    error: undefined,
    errorMessage,
    gasFee,
    isLoading,
    setErrorMessage,
    setIsLoading,
    transactionId,
    setTransactionId,
  });

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
