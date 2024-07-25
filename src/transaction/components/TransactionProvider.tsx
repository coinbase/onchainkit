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
import { useWaitForTransactionReceipt } from 'wagmi';

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

  const { transactionHash, status: callStatus } = useCallsStatus({
    onError,
    transactionId,
  });

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  const fallbackToWriteContract = useCallback(async () => {
    // EOAs don't support batching, so we process contracts individually.
    // This gracefully handles accidental batching attempts with EOAs.
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

      // EOA accounts always fail on writeContracts, returning undefined.
      // Fallback to writeContract, which works for EOAs.
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
    isLoading: callStatus === 'PENDING',
    isToastVisible,
    onSubmit: handleSubmit,
    receipt,
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
