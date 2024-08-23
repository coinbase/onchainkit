import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAccount, useConfig, useSendTransaction } from 'wagmi';
import { useValue } from '../../internal/hooks/useValue';
import { formatTokenAmount } from '../../internal/utils/formatTokenAmount';
import type { Token } from '../../token';
import { GENERIC_ERROR_MESSAGE } from '../../transaction/constants';
import { isUserRejectedRequestError } from '../../transaction/utils/isUserRejectedRequestError';
import { useFromTo } from '../hooks/useFromTo';
import type {
  LifeCycleStatus,
  SwapContextType,
  SwapProviderReact,
} from '../types';
import { buildSwapTransaction } from '../utils/buildSwapTransaction';
import { getSwapQuote } from '../utils/getSwapQuote';
import { isSwapError } from '../utils/isSwapError';
import { processSwapTransaction } from '../utils/processSwapTransaction';

const emptyContext = {} as SwapContextType;

export const SwapContext = createContext<SwapContextType>(emptyContext);

export function useSwapContext() {
  const context = useContext(SwapContext);
  if (context === emptyContext) {
    throw new Error('useSwapContext must be used within a Swap component');
  }
  return context;
}

export function SwapProvider({
  children,
  experimental,
  onError,
  onStatus,
  onSuccess,
}: SwapProviderReact) {
  const { address } = useAccount();
  // Feature flags
  const { useAggregator } = experimental;

  // Core Hooks
  const config = useConfig();
  const [loading, setLoading] = useState(false);
  const [isTransactionPending, setPendingTransaction] = useState(false);
  const [lifeCycleStatus, setLifeCycleStatus] = useState<LifeCycleStatus>({
    statusName: 'init',
    statusData: null,
  }); // Component lifecycle
  const { from, to } = useFromTo(address);
  const { sendTransactionAsync } = useSendTransaction(); // Sending the transaction (and approval, if applicable)

  // Component lifecycle emitters
  useEffect(() => {
    // Error
    if (lifeCycleStatus.statusName === 'error') {
      setLoading(false);
      setPendingTransaction(false);
      onError?.(lifeCycleStatus.statusData);
    }
    if (lifeCycleStatus.statusName === 'transactionPending') {
      setLoading(true);
      setPendingTransaction(true);
    }
    if (lifeCycleStatus.statusName === 'transactionApproved') {
      setPendingTransaction(false);
    }
    // Success
    if (lifeCycleStatus.statusName === 'success') {
      setLoading(false);
      setPendingTransaction(false);
      onSuccess?.(lifeCycleStatus.statusData.transactionReceipt);
    }
    // Emit Status
    onStatus?.(lifeCycleStatus);
  }, [
    onError,
    onStatus,
    onSuccess,
    lifeCycleStatus,
    lifeCycleStatus.statusData, // Keep statusData, so that the effect runs when it changes
    lifeCycleStatus.statusName, // Keep statusName, so that the effect runs when it changes
  ]);

  const handleToggle = useCallback(() => {
    from.setAmount(to.amount);
    to.setAmount(from.amount);
    from.setToken(to.token);
    to.setToken(from.token);
  }, [from, to]);

  const handleAmountChange = useCallback(
    async (
      type: 'from' | 'to',
      amount: string,
      sToken?: Token,
      dToken?: Token,
      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
    ) => {
      const source = type === 'from' ? from : to;
      const destination = type === 'from' ? to : from;

      source.token = sToken ?? source.token;
      destination.token = dToken ?? destination.token;

      if (source.token === undefined || destination.token === undefined) {
        return;
      }
      if (amount === '' || amount === '.' || Number.parseFloat(amount) === 0) {
        return destination.setAmount('');
      }

      // When toAmount changes we fetch quote for fromAmount
      // so set isFromQuoteLoading to true
      destination.setLoading(true);
      setLifeCycleStatus({
        statusName: 'amountChange',
        statusData: null,
      });

      try {
        const response = await getSwapQuote({
          amount,
          amountReference: 'from',
          from: source.token,
          to: destination.token,
          maxSlippage: experimental.maxSlippage?.toString(),
          useAggregator,
        });
        // If request resolves to error response set the quoteError
        // property of error state to the SwapError response
        if (isSwapError(response)) {
          setLifeCycleStatus({
            statusName: 'error',
            statusData: {
              code: response.code,
              error: response.error,
              message: '',
            },
          });
          return;
        }

        const formattedAmount = formatTokenAmount(
          response.toAmount,
          response?.to?.decimals,
        );

        destination.setAmount(formattedAmount);
      } catch (err) {
        setLifeCycleStatus({
          statusName: 'error',
          statusData: {
            code: 'TmSPc01', // Transaction module SwapProvider component 01 error
            error: JSON.stringify(err),
            message: '',
          },
        });
      } finally {
        // reset loading state when quote request resolves
        destination.setLoading(false);
      }
    },
    [from, experimental.maxSlippage, to, useAggregator],
  );

  const handleSubmit = useCallback(async () => {
    if (!address || !from.token || !to.token || !from.amount) {
      return;
    }
    setLifeCycleStatus({
      statusName: 'init',
      statusData: null,
    });

    try {
      const response = await buildSwapTransaction({
        amount: from.amount,
        fromAddress: address,
        from: from.token,
        to: to.token,
        useAggregator,
        maxSlippage: experimental.maxSlippage?.toString(),
      });
      if (isSwapError(response)) {
        setLifeCycleStatus({
          statusName: 'error',
          statusData: {
            code: response.code,
            error: response.error,
            message: response.message,
          },
        });
        return;
      }
      await processSwapTransaction({
        config,
        sendTransactionAsync,
        setLifeCycleStatus,
        swapTransaction: response,
        useAggregator,
      });

      // TODO: refresh balances
    } catch (err) {
      const errorMessage = isUserRejectedRequestError(err)
        ? 'Request denied.'
        : GENERIC_ERROR_MESSAGE;
      setLifeCycleStatus({
        statusName: 'error',
        statusData: {
          code: 'TmSPc02', // Transaction module SwapProvider component 02 error
          error: JSON.stringify(err),
          message: errorMessage,
        },
      });
    }
  }, [
    address,
    config,
    from.amount,
    from.token,
    sendTransactionAsync,
    to.token,
    useAggregator,
    experimental.maxSlippage,
  ]);

  const value = useValue({
    from,
    loading,
    handleAmountChange,
    handleToggle,
    handleSubmit,
    lifeCycleStatus,
    isTransactionPending,
    setLifeCycleStatus,
    to,
  });

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
}
