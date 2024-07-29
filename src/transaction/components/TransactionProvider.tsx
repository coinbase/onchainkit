import { createContext, useCallback, useContext, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
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
  capabilities,
  chainId,
  children,
  contracts,
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
    hash: writeContractTransactionHash || transactionHash,
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

  const switchChain = useCallback(
    async (targetChainId: number | undefined) => {
      if (targetChainId && account.chainId !== targetChainId) {
        await switchChainAsync({ chainId: targetChainId });
      }
    },
    [account.chainId, switchChainAsync],
  );

  const executeContracts = useCallback(async () => {
    await writeContractsAsync({
      contracts,
      capabilities,
    });
  }, [writeContractsAsync, contracts, capabilities]);

  const handleSubmitErrors = useCallback(
    async (err: unknown) => {
      if (
        err instanceof Error &&
        err.message.includes(METHOD_NOT_SUPPORTED_ERROR_SUBSTRING)
      ) {
        try {
          await fallbackToWriteContract();
        } catch (_err) {
          setErrorMessage(genericErrorMessage);
        }
      } else {
        setErrorMessage(genericErrorMessage);
      }
    },
    [fallbackToWriteContract],
  );

  const handleSubmit = useCallback(async () => {
    setErrorMessage('');
    setIsToastVisible(true);
    try {
      await switchChain(chainId);
      await executeContracts();
    } catch (err) {
      await handleSubmitErrors(err);
    }
  }, [chainId, executeContracts, handleSubmitErrors, switchChain]);

  const value = useValue({
    address,
    chainId,
    contracts,
    errorMessage,
    hasPaymaster: !!capabilities?.paymasterService?.url,
    isLoading: callStatus === 'PENDING',
    isToastVisible,
    onSubmit: handleSubmit,
    receipt,
    setErrorMessage,
    setIsToastVisible,
    setTransactionId,
    statusWriteContracts,
    statusWriteContract,
    transactionId,
    transactionHash: transactionHash || writeContractTransactionHash,
  });
  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
