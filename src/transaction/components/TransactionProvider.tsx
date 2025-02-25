import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Address } from 'viem';
import {
  useAccount,
  useConfig,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import {
  TransactionEvent,
  type TransactionEventData,
} from '../../core/analytics/types';
import { Capabilities } from '../../core/constants';
import { useCapabilitiesSafe } from '../../internal/hooks/useCapabilitiesSafe';
import { useValue } from '../../internal/hooks/useValue';
import { useOnchainKit } from '../../useOnchainKit';
import { GENERIC_ERROR_MESSAGE } from '../constants';
import { useCallsStatus } from '../hooks/useCallsStatus';
import { useSendCall } from '../hooks/useSendCall';
import { useSendCalls } from '../hooks/useSendCalls';
import { useSendWalletTransactions } from '../hooks/useSendWalletTransactions';
import type {
  LifecycleStatus,
  TransactionContextType,
  TransactionProviderReact,
} from '../types';
import { getPaymasterUrl } from '../utils/getPaymasterUrl';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';

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
  calls,
  capabilities: transactionCapabilities,
  chainId,
  children,
  contracts,
  isSponsored,
  onError,
  onStatus,
  onSuccess,
  resetAfter,
}: TransactionProviderReact) {
  // Core Hooks
  const account = useAccount();
  const config = useConfig();
  const {
    config: { paymaster } = { paymaster: undefined },
  } = useOnchainKit();

  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [lifecycleStatus, setLifecycleStatus] = useState<LifecycleStatus>({
    statusName: 'init',
    statusData: null,
  }); // Component lifecycle
  const [transactionId, setTransactionId] = useState('');
  const [transactionCount, setTransactionCount] = useState<
    number | undefined
  >();
  const [transactionHashList, setTransactionHashList] = useState<Address[]>([]);
  const transactions = calls || contracts;

  // Retrieve wallet capabilities
  const walletCapabilities = useCapabilitiesSafe({
    chainId,
  });

  const { switchChainAsync } = useSwitchChain();

  // Validate `calls` and `contracts` props
  if (!contracts && !calls) {
    throw new Error(
      'Transaction: calls or contracts must be provided as a prop to the Transaction component.',
    );
  }

  // Validate `calls` and `contracts` props
  if (calls && contracts) {
    throw new Error(
      'Transaction: Only one of contracts or calls can be provided as a prop to the Transaction component.',
    );
  }

  // useSendCalls or useSendCall
  // Used for contract calls with raw calldata.
  const {
    status: statusSendCalls,
    sendCallsAsync,
    reset: resetSendCalls,
  } = useSendCalls({
    setLifecycleStatus,
    setTransactionId,
  });

  const {
    status: statusSendCall,
    sendCallAsync,
    data: singleTransactionHash,
    reset: resetSendCall,
  } = useSendCall({
    setLifecycleStatus,
    transactionHashList,
  });

  // Transaction Status
  // For batched, use statusSendCalls
  // For single, use statusSendCall
  const transactionStatus = useMemo(() => {
    if (walletCapabilities[Capabilities.AtomicBatch]?.supported) {
      return statusSendCalls;
    }
    return statusSendCall;
  }, [statusSendCall, statusSendCalls, walletCapabilities]);

  const capabilities = useMemo(() => {
    if (isSponsored && paymaster) {
      return {
        paymasterService: { url: paymaster },
        // this needs to be below so devs can override default paymaster
        // with their personal paymaster in production playgroundd
        ...transactionCapabilities,
      };
    }
    return transactionCapabilities;
  }, [isSponsored, paymaster, transactionCapabilities]);

  // useSendWalletTransactions
  // Used to send transactions based on the transaction type. Can be of type calls or contracts.
  const sendWalletTransactions = useSendWalletTransactions({
    capabilities,
    sendCallAsync,
    sendCallsAsync,
    walletCapabilities,
  });

  const { transactionHash: batchedTransactionHash, status: callStatus } =
    useCallsStatus({
      setLifecycleStatus,
      transactionId,
    });

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: singleTransactionHash || batchedTransactionHash,
  });

  const { sendAnalytics } = useAnalytics();

  const handleAnalytics = useCallback(
    (event: TransactionEvent, data: TransactionEventData[TransactionEvent]) => {
      sendAnalytics(event, data);
    },
    [sendAnalytics],
  );

  // Component lifecycle emitters
  useEffect(() => {
    setErrorMessage('');
    // Error
    if (lifecycleStatus.statusName === 'error') {
      setErrorMessage(lifecycleStatus.statusData.message);
      setErrorCode(lifecycleStatus.statusData.code);
      onError?.(lifecycleStatus.statusData);
    }
    // Transaction Legacy Executed
    if (lifecycleStatus.statusName === 'transactionLegacyExecuted') {
      setTransactionHashList(lifecycleStatus.statusData.transactionHashList);
    }
    // Success
    if (lifecycleStatus.statusName === 'success') {
      onSuccess?.({
        transactionReceipts: lifecycleStatus.statusData.transactionReceipts,
      });
    }
    // Emit Status
    onStatus?.(lifecycleStatus);
  }, [
    onError,
    onStatus,
    onSuccess,
    lifecycleStatus,
    lifecycleStatus.statusData, // Keep statusData, so that the effect runs when it changes
    lifecycleStatus.statusName, // Keep statusName, so that the effect runs when it changes
  ]);

  // Set transaction pending status when writeContracts or writeContract is pending
  useEffect(() => {
    if (transactionStatus === 'pending') {
      setLifecycleStatus({
        statusName: 'transactionPending',
        statusData: null,
      });
    }
  }, [transactionStatus]);

  // Trigger success status when receipt is generated by useWaitForTransactionReceipt
  useEffect(() => {
    if (!receipt) {
      return;
    }
    setLifecycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipts: [receipt],
      },
    });
    if (resetAfter) {
      // Reset all internal state
      const timeoutId = setTimeout(() => {
        setErrorMessage('');
        setErrorCode('');
        setIsToastVisible(false);
        setTransactionId('');
        setTransactionHashList([]);
        setTransactionCount(undefined);
        resetSendCalls();
        resetSendCall();
      }, resetAfter);

      return () => clearTimeout(timeoutId);
    }
  }, [receipt, resetAfter, resetSendCalls, resetSendCall]);

  // When all transactions are successful, get the receipts
  useEffect(() => {
    if (
      !transactions ||
      transactionHashList.length !== transactionCount ||
      transactionCount < 2
    ) {
      return;
    }
    getTransactionLegacyReceipts();
  }, [transactions, transactionCount, transactionHashList]);

  const getTransactionLegacyReceipts = useCallback(async () => {
    const receipts = [];
    for (const hash of transactionHashList) {
      try {
        const txnReceipt = await waitForTransactionReceipt(config, {
          hash,
          chainId,
        });
        receipts.push(txnReceipt);
      } catch (err) {
        setLifecycleStatus({
          statusName: 'error',
          statusData: {
            code: 'TmTPc01', // Transaction module TransactionProvider component 01 error
            error: JSON.stringify(err),
            message: GENERIC_ERROR_MESSAGE,
          },
        });
      }
    }
    setLifecycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipts: receipts,
      },
    });
  }, [chainId, config, transactionHashList]);

  const switchChain = useCallback(
    async (targetChainId: number | undefined) => {
      if (targetChainId && account.chainId !== targetChainId) {
        await switchChainAsync({ chainId: targetChainId });
      }
    },
    [account.chainId, switchChainAsync],
  );

  const buildTransaction = useCallback(async () => {
    setLifecycleStatus({
      statusName: 'buildingTransaction',
      statusData: null,
    });
    try {
      handleAnalytics(TransactionEvent.TransactionInitiated, {
        address: account.address,
      });
      const resolvedTransactions = await (typeof transactions === 'function'
        ? transactions()
        : Promise.resolve(transactions));
      setTransactionCount(resolvedTransactions?.length);
      return resolvedTransactions;
    } catch (err) {
      handleAnalytics(TransactionEvent.TransactionFailure, {
        error: (err as Error).message,
        metadata: {
          code: errorCode,
        },
      });
      setLifecycleStatus({
        statusName: 'error',
        statusData: {
          code: 'TmTPc04', // Transaction module TransactionProvider component 04 error
          error: JSON.stringify(err),
          message: 'Error building transactions',
        },
      });
      return undefined;
    }
  }, [transactions, handleAnalytics, account.address, errorCode]);

  const handleSubmit = useCallback(async () => {
    setErrorMessage('');
    setIsToastVisible(true);
    try {
      // Switch chain before attempting transactions
      await switchChain(chainId);
      const resolvedTransactions = await buildTransaction();
      await sendWalletTransactions(resolvedTransactions);
    } catch (err) {
      const errorMessage = isUserRejectedRequestError(err)
        ? 'Request denied.'
        : GENERIC_ERROR_MESSAGE;
      setLifecycleStatus({
        statusName: 'error',
        statusData: {
          code: 'TmTPc03', // Transaction module TransactionProvider component 03 error
          error: JSON.stringify(err),
          message: errorMessage,
        },
      });
    }
  }, [buildTransaction, chainId, sendWalletTransactions, switchChain]);

  const value = useValue({
    chainId,
    errorCode,
    errorMessage,
    isLoading: callStatus === 'PENDING',
    isToastVisible,
    lifecycleStatus,
    onSubmit: handleSubmit,
    paymasterUrl: getPaymasterUrl(capabilities),
    receipt,
    setIsToastVisible,
    setLifecycleStatus,
    setTransactionId,
    transactions,
    transactionId,
    transactionHash: singleTransactionHash || batchedTransactionHash,
    transactionCount,
  });

  useEffect(() => {
    if (!receipt) {
      return;
    }

    if (receipt.status === 'success') {
      handleAnalytics(TransactionEvent.TransactionSuccess, {
        paymaster: Boolean(isSponsored && paymaster),
        address: account.address,
        transactionHash: receipt.transactionHash,
      });
    } else {
      handleAnalytics(TransactionEvent.TransactionFailure, {
        error: 'Transaction failed',
        metadata: {
          code: errorCode,
        },
      });
    }
  }, [
    receipt,
    handleAnalytics,
    isSponsored,
    paymaster,
    account.address,
    errorCode,
  ]);

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
