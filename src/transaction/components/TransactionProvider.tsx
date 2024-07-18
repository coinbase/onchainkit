import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useValue } from '../../internal/hooks/useValue';
import { useWriteContracts } from '../hooks/useWriteContracts';
import { useCallsStatus } from '../hooks/useCallsStatus';
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
}: TransactionProviderReact) {
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [gasFee, setGasFee] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const { status, writeContracts } = useWriteContracts({
    setErrorMessage,
    setTransactionId,
  });

  const { transactionHash } = useCallsStatus({ transactionId });

  const handleSubmit = useCallback(async () => {
    try {
      setErrorMessage('');
      setIsToastVisible(true);
      await writeContracts({
        contracts,
      });
    } catch (err) {
      // TODO: handle error better
      console.log({ err });
      setErrorMessage('Something went wrong');
    }
  }, [contracts, writeContracts]);

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
    isLoading: status === 'pending',
    isToastVisible,
    onSubmit: handleSubmit,
    setErrorMessage,
    setIsToastVisible,
    setTransactionId,
    status,
    transactionId,
    transactionHash,
  });

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
