import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useValue } from '../../internal/hooks/useValue';
import { useWriteContract } from '../hooks/useWriteContract';
import { useWriteContracts } from '../hooks/useWriteContracts';
import { useCallsStatus } from '../hooks/useCallsStatus';
import { writeContract } from 'wagmi';
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
  const [gasFee, setGasFee] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const { status: statusWriteContract, writeContract } = useWriteContract({
    onError,
    setErrorMessage,
    setTransactionId,
  });

  const { status: statusWriteContracts, writeContracts } = useWriteContracts({
    onError,
    setErrorMessage,
    setTransactionId,
  });

  const { transactionHash } = useCallsStatus({ onError, transactionId });

  const handleSubmit = useCallback(() => {
    setErrorMessage('');
    setIsToastVisible(true);
<<<<<<< HEAD
    
    // if multiple contracts then use writeContracts
    // if single contract then use writeContract
    if (contracts.length > 1) {
      writeContracts({
        contracts,
      });
    } else {
      writeContract(contracts[0]);
    }

    writeContracts({
      contracts,
    });
  }, [contracts, writeContracts]);
=======

    console.log('Contracts: ', contracts);
    console.log('Contracts length: ', contracts.length);

    // if multiple contracts then use writeContracts
    // if single contract then use writeContract
    if (contracts.length > 1) {
      writeContracts({
        contracts,
      });
    } else {
      writeContract(contracts[0]);
    }
<<<<<<< HEAD
  }, [contracts, handleWriteContract, handleWriteContracts]);
>>>>>>> 580397c (asdf)
=======
  }, [contracts, writeContracts, writeContract]);
>>>>>>> 26b3742 (Save changes)

  useEffect(() => {
    // TODO: replace with gas estimation call
    setGasFee('0.03');
  }, []);

  const value = useValue({
    address,
    contracts,
    errorMessage,
    gasFee,
    isLoading:
      statusWriteContracts === 'pending' || statusWriteContract === 'pending',
    isToastVisible,
    onSubmit: handleSubmit,
    setErrorMessage,
    setIsToastVisible,
    setTransactionId,
    status: contracts.length > 1 ? statusWriteContracts : 'idle',
    transactionId,
    transactionHash,
  });

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
