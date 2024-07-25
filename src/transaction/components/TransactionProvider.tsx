import { createContext, useCallback, useContext, useState } from 'react';
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useValue } from '../../internal/hooks/useValue';
import { METHOD_NOT_SUPPORTED_ERROR_SUBSTRING } from '../constants';
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
  chainId,
  contracts,
  capabilities,
  onError,
}: TransactionProviderReact) {
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const account = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const { status: statusWriteContracts, writeContractsAsync } =
    useWriteContracts({
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
      if (chainId && account.chainId !== chainId) {
        await switchChainAsync({ chainId });
      }

      await writeContractsAsync({
        contracts,
        capabilities,
      });
    } catch (err: any) {
      // EOA accounts always fail on writeContracts, returning undefined.
      // Fallback to writeContract, which works for EOAs.
      if (err.message.includes(METHOD_NOT_SUPPORTED_ERROR_SUBSTRING)) {
        try {
          await fallbackToWriteContract();
        } catch (_err) {
          setErrorMessage(genericErrorMessage);
        }
      } else {
        setErrorMessage(genericErrorMessage);
      }
    }
  }, [contracts, writeContractsAsync, fallbackToWriteContract]);

  const value = useValue({
    address,
    chainId,
    contracts,
    errorMessage,
    isLoading: callStatus === 'PENDING',
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
