import { createContext, useCallback, useContext, useState } from 'react';
import { useValue } from '../../internal/hooks/useValue';
import { useCallsStatus } from '../hooks/useCallsStatus';
import { useWriteContract } from '../hooks/useWriteContract';
import {
  genericErrorMessage,
  useWriteContracts,
} from '../hooks/useWriteContracts';
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

  const { status: statusWriteContracts, writeContracts } = useWriteContracts({
    onError,
    setErrorMessage,
    setTransactionId,
  });

  const {
    status: statusWriteContract,
    writeContract,
    data: writeContractTransactionHash,
  } = useWriteContract({
    onError,
    setErrorMessage,
    setTransactionId,
  });

  const { transactionHash } = useCallsStatus({ onError, transactionId });

  const fallbackToWriteContract = useCallback(async () => {
    for (const contract of contracts) {
      try {
        await writeContract(contract);
      } catch (_err) {
        setErrorMessage(genericErrorMessage);
      }
    }
  }, [contracts, writeContract]);

  const handleSubmit = useCallback(async () => {
    setErrorMessage('');
    setIsToastVisible(true);
    try {
      const result = await writeContracts({
        contracts,
      });

      if (result === undefined) {
        await fallbackToWriteContract();
      }
    } catch (_err) {
      setErrorMessage(genericErrorMessage);
    }
  }, [contracts, writeContracts, fallbackToWriteContract]);

  const value = useValue({
    address,
    contracts,
    errorMessage,
    isLoading:
      statusWriteContract === 'pending' || statusWriteContracts === 'pending',
    isToastVisible,
    onSubmit: handleSubmit,
    setErrorMessage,
    setIsToastVisible,
    setTransactionId,
    status: statusWriteContract || statusWriteContracts,
    transactionId,
    transactionHash: transactionHash || writeContractTransactionHash,
  });

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
