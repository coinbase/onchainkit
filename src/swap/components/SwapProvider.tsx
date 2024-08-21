import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { TransactionReceipt } from 'viem';
import { useConfig, useSendTransaction } from 'wagmi';
import type { BaseError } from 'wagmi';
import { useValue } from '../../internal/hooks/useValue';
import { formatTokenAmount } from '../../internal/utils/formatTokenAmount';
import type { Token } from '../../token';
import { USER_REJECTED_ERROR_CODE } from '../constants';
import { useFromTo } from '../hooks/useFromTo';
import type {
  LifeCycleStatus,
  SwapContextType,
  SwapError,
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
  address,
  children,
  experimental,
  onStatus,
}: SwapProviderReact) {
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
    console.log('status', lifeCycleStatus);
    // Emit Status
    onStatus?.(lifeCycleStatus);
  }, [
    onStatus,
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
      if (amount === '' || Number.parseFloat(amount) === 0) {
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

  const handleSubmit = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
    async function handleSubmit(
      onError?: (error: SwapError) => void,
      onStart?: (txHash: string) => void | Promise<void>,
      onSuccess?: (txReceipt: TransactionReceipt) => void | Promise<void>,
    ) {
      if (!address || !from.token || !to.token || !from.amount) {
        return;
      }
      setLoading(true);
      setLifeCycleStatus({
        statusName: 'init',
        statusData: null,
      });
      console.log('handleSubmit');

      try {
        const response = await buildSwapTransaction({
          amount: from.amount,
          fromAddress: address,
          from: from.token,
          to: to.token,
          useAggregator,
          maxSlippage: experimental.maxSlippage?.toString(),
        });
        console.log('handleSubmit.response', response);

        if (isSwapError(response)) {
          console.log('handleSubmit.response.1');
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
          swapTransaction: response,
          config,
          setPendingTransaction,
          setLoading,
          sendTransactionAsync,
          onStart,
          onSuccess,
          useAggregator,
        });

        // TODO: refresh balances
      } catch (e) {
        const userRejected = (e as BaseError).message.includes(
          'User rejected the request.',
        );
        if (userRejected) {
          setLoading(false);
          setPendingTransaction(false);
          setLifeCycleStatus({
            statusName: 'error',
            statusData: {
              code: USER_REJECTED_ERROR_CODE,
              error: 'User rejected the request.',
              message: '',
            },
          });
        } else {
          onError?.(e as SwapError);
          setLifeCycleStatus({
            statusName: 'error',
            statusData: {
              code: 'TmSPc02', // Transaction module SwapProvider component 02 error
              error: JSON.stringify(e),
              message: '',
            },
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [
      address,
      config,
      from.amount,
      from.token,
      sendTransactionAsync,
      to.token,
      useAggregator,
      experimental.maxSlippage,
    ],
  );

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
