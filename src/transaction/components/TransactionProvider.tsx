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

  const handleWriteContract = useCallback(
    (contract: any) => {
      console.log("running handleWriteContract");
      writeContract(contract);
    },
    [writeContract]
  );

  const handleWriteContracts = useCallback(
    (contractsToWrite: any) => {
      console.log("running handleWriteContracts");
      writeContracts({
        contracts: contractsToWrite,
      });
    },
    [writeContracts]
  );

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

    console.log("Contracts: ", contracts);
    console.log("Contracts length: ", contracts.length);

    if (contracts.length > 1) {
      handleWriteContracts(contracts);
    } else if (contracts.length === 1) {
      handleWriteContract(contracts[0]);
    } else {
      console.error("No contracts provided");
      setErrorMessage("No contracts provided");
    }
  }, [contracts, handleWriteContract, handleWriteContracts]);
>>>>>>> 580397c (asdf)

  useEffect(() => {
    // TODO: replace with gas estimation call
    setGasFee('0.03');
  }, []);

  const value = useValue({
    address,
    contracts,
    errorMessage,
    gasFee,
    isLoading: statusWriteContract === 'pending' || statusWriteContracts === 'pending',
    isToastVisible,
    onSubmit: handleSubmit,
    setErrorMessage,
    setIsToastVisible,
    setTransactionId,
    status: contracts.length > 1 ? statusWriteContracts : statusWriteContract,
    transactionId,
    transactionHash,
  });

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}