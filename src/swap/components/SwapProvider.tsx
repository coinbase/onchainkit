import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAccount, useConfig, useSendTransaction } from 'wagmi';
import { buildSwapTransaction } from '../../api/buildSwapTransaction';
import { getSwapQuote } from '../../api/getSwapQuote';
import { useValue } from '../../internal/hooks/useValue';
import { formatTokenAmount } from '../../internal/utils/formatTokenAmount';
import type { Token } from '../../token';
import { GENERIC_ERROR_MESSAGE } from '../../transaction/constants';
import { isUserRejectedRequestError } from '../../transaction/utils/isUserRejectedRequestError';
import { DEFAULT_MAX_SLIPPAGE } from '../constants';
import { useFromTo } from '../hooks/useFromTo';
import { useResetInputs } from '../hooks/useResetInputs';
import type {
  LifeCycleStatus,
  LifeCycleStatusUpdate,
  SwapContextType,
  SwapProviderReact,
} from '../types';
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
  config = {
    maxSlippage: DEFAULT_MAX_SLIPPAGE,
  },
  experimental,
  onError,
  onStatus,
  onSuccess,
}: SwapProviderReact) {
  const { address } = useAccount();
  // Feature flags
  const { useAggregator } = experimental;
  // Core Hooks
  const accountConfig = useConfig();
  const [lifeCycleStatus, setLifeCycleStatus] = useState<LifeCycleStatus>({
    statusName: 'init',
    statusData: {
      isMissingRequiredField: true,
      maxSlippage: config.maxSlippage,
    },
  }); // Component lifecycle

  // Update lifecycle status, statusData will be persisted for the full lifeCycle
  const updateLifeCycleStatus = useCallback(
    (newStatus: LifeCycleStatusUpdate) => {
      setLifeCycleStatus((prevStatus: LifeCycleStatus) => {
        // do not persist errors
        const persistedStatusData =
          prevStatus.statusName === 'error'
            ? (({ error, code, message, ...statusData }) => statusData)(
                prevStatus.statusData,
              )
            : prevStatus.statusData;
        return {
          statusName: newStatus.statusName,
          statusData: {
            ...persistedStatusData,
            ...newStatus.statusData,
          },
        } as LifeCycleStatus;
      });
    },
    [],
  );

  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);
  const { from, to } = useFromTo(address);
  const { sendTransactionAsync } = useSendTransaction(); // Sending the transaction (and approval, if applicable)

  // Refreshes balances and inputs post-swap
  const resetInputs = useResetInputs({ from, to });

  // Component lifecycle emitters
  useEffect(() => {
    // Error
    if (lifeCycleStatus.statusName === 'error') {
      onError?.(lifeCycleStatus.statusData);
    }
    // Success
    if (lifeCycleStatus.statusName === 'success') {
      onSuccess?.(lifeCycleStatus.statusData.transactionReceipt);
      setHasHandledSuccess(true);
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

  useEffect(() => {
    // Reset inputs after status reset. `resetInputs` is dependent
    // on 'from' and 'to' so moved to separate useEffect to
    // prevents multiple calls to `onStatus`
    if (lifeCycleStatus.statusName === 'init' && hasHandledSuccess) {
      setHasHandledSuccess(false);
      resetInputs();
    }
  }, [hasHandledSuccess, lifeCycleStatus.statusName, resetInputs]);

  useEffect(() => {
    // Reset status to init after success has been handled
    if (lifeCycleStatus.statusName === 'success' && hasHandledSuccess) {
      updateLifeCycleStatus({
        statusName: 'init',
        statusData: {
          isMissingRequiredField: true,
          maxSlippage: config.maxSlippage,
        },
      });
    }
  }, [
    config.maxSlippage,
    hasHandledSuccess,
    lifeCycleStatus.statusName,
    updateLifeCycleStatus,
  ]);

  const handleToggle = useCallback(() => {
    from.setAmount(to.amount);
    to.setAmount(from.amount);
    from.setToken(to.token);
    to.setToken(from.token);

    updateLifeCycleStatus({
      statusName: 'amountChange',
      statusData: {
        amountFrom: from.amount,
        amountTo: to.amount,
        tokenFrom: from.token,
        tokenTo: to.token,
        // token is missing
        isMissingRequiredField:
          !from.token || !to.token || !from.amount || !to.amount,
      },
    });
  }, [from, to, updateLifeCycleStatus]);

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

      // if token is missing alert user via isMissingRequiredField
      if (source.token === undefined || destination.token === undefined) {
        updateLifeCycleStatus({
          statusName: 'amountChange',
          statusData: {
            amountFrom: from.amount,
            amountTo: to.amount,
            tokenFrom: from.token,
            tokenTo: to.token,
            // token is missing
            isMissingRequiredField: true,
          },
        });
        return;
      }
      if (amount === '' || amount === '.' || Number.parseFloat(amount) === 0) {
        return destination.setAmount('');
      }

      // When toAmount changes we fetch quote for fromAmount
      // so set isFromQuoteLoading to true
      destination.setLoading(true);
      updateLifeCycleStatus({
        statusName: 'amountChange',
        statusData: {
          // when fetching quote, the previous
          // amount is irrelevant
          amountFrom: type === 'from' ? amount : '',
          amountTo: type === 'to' ? amount : '',
          tokenFrom: from.token,
          tokenTo: to.token,
          // when fetching quote, the destination
          // amount is missing
          isMissingRequiredField: true,
        },
      });

      try {
        const maxSlippage = lifeCycleStatus.statusData.maxSlippage;
        const response = await getSwapQuote({
          amount,
          amountReference: 'from',
          from: source.token,
          maxSlippage: String(maxSlippage),
          to: destination.token,
          useAggregator,
        });
        // If request resolves to error response set the quoteError
        // property of error state to the SwapError response
        if (isSwapError(response)) {
          updateLifeCycleStatus({
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
          response.to.decimals,
        );
        destination.setAmount(formattedAmount);
        updateLifeCycleStatus({
          statusName: 'amountChange',
          statusData: {
            amountFrom: type === 'from' ? amount : formattedAmount,
            amountTo: type === 'to' ? amount : formattedAmount,
            tokenFrom: from.token,
            tokenTo: to.token,
            // if quote was fetched successfully, we
            // have all required fields
            isMissingRequiredField: !formattedAmount,
          },
        });
      } catch (err) {
        updateLifeCycleStatus({
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
    [from, to, lifeCycleStatus, updateLifeCycleStatus, useAggregator],
  );

  const handleSubmit = useCallback(async () => {
    if (!address || !from.token || !to.token || !from.amount) {
      return;
    }

    try {
      const maxSlippage = lifeCycleStatus.statusData.maxSlippage;
      const response = await buildSwapTransaction({
        amount: from.amount,
        fromAddress: address,
        from: from.token,
        maxSlippage: String(maxSlippage),
        to: to.token,
        useAggregator,
      });
      if (isSwapError(response)) {
        updateLifeCycleStatus({
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
        config: accountConfig,
        sendTransactionAsync,
        updateLifeCycleStatus,
        swapTransaction: response,
        useAggregator,
      });

      // TODO: refresh balances
    } catch (err) {
      const errorMessage = isUserRejectedRequestError(err)
        ? 'Request denied.'
        : GENERIC_ERROR_MESSAGE;
      updateLifeCycleStatus({
        statusName: 'error',
        statusData: {
          code: 'TmSPc02', // Transaction module SwapProvider component 02 error
          error: JSON.stringify(err),
          message: errorMessage,
        },
      });
    }
  }, [
    accountConfig,
    address,
    from.amount,
    from.token,
    lifeCycleStatus,
    sendTransactionAsync,
    to.token,
    updateLifeCycleStatus,
    useAggregator,
  ]);

  const value = useValue({
    address,
    from,
    handleAmountChange,
    handleToggle,
    handleSubmit,
    lifeCycleStatus,
    updateLifeCycleStatus,
    to,
  });

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
}
