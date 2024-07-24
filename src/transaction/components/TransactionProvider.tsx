import { createContext, useCallback, useContext, useState } from 'react';
import { useValue } from '../../internal/hooks/useValue';
import { useCallsStatus } from '../hooks/useCallsStatus';
import { useWriteContracts } from '../hooks/useWriteContracts';
import type {
  TransactionContextType,
  TransactionProviderReact,
} from '../types';

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
  onError,
}: TransactionProviderReact) {
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const { status: writeContractsStatus, writeContracts } = useWriteContracts({
    onError,
    setErrorMessage,
    setTransactionId,
  });

  const { transactionHash, status: callStatus } = useCallsStatus({
    onError,
    transactionId,
  });

  const handleSubmit = useCallback(() => {
    setErrorMessage('');
    setIsToastVisible(true);
    writeContracts({
      contracts,
    });
  }, [contracts, writeContracts]);

  const value = useValue({
    address,
    contracts,
    errorMessage,
    isLoading: callStatus === 'PENDING',
    isToastVisible,
    onSubmit: handleSubmit,
    setErrorMessage,
    setIsToastVisible,
    setTransactionId,
    status: writeContractsStatus,
    transactionId,
    transactionHash,
  });

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
