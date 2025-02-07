import { RequestContext } from '@/core/network/constants';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { base } from 'viem/chains';
import { useAccount, useConfig, useSendTransaction } from 'wagmi';
import { useSwitchChain } from 'wagmi';
import { useSendCalls } from 'wagmi/experimental';
import { buildSwapTransaction } from '../../api/buildSwapTransaction';
import { getSwapQuote } from '../../api/getSwapQuote';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { SwapEvent } from '../../core/analytics/types';
import { useCapabilitiesSafe } from '../../internal/hooks/useCapabilitiesSafe';
import { useLifecycleStatus } from '../../internal/hooks/useLifecycleStatus';
import { useValue } from '../../internal/hooks/useValue';
import { formatTokenAmount } from '../../internal/utils/formatTokenAmount';
import type { Token } from '../../token';
import { GENERIC_ERROR_MESSAGE } from '../../transaction/constants';
import { isUserRejectedRequestError } from '../../transaction/utils/isUserRejectedRequestError';
import { useOnchainKit } from '../../useOnchainKit';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../constants';
import { useAwaitCalls } from '../hooks/useAwaitCalls';
import { useFromTo } from '../hooks/useFromTo';
import { useResetInputs } from '../hooks/useResetInputs';
import type {
  LifecycleStatus,
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
    maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
  },
  experimental,
  isSponsored,
  onError,
  onStatus,
  onSuccess,
}: SwapProviderReact) {
  const {
    config: { paymaster } = { paymaster: undefined },
  } = useOnchainKit();
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  // Feature flags
  const { useAggregator } = experimental;
  // Core Hooks
  const accountConfig = useConfig();

  const walletCapabilities = useCapabilitiesSafe({
    chainId: base.id,
  }); // Swap is only available on Base
  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<LifecycleStatus>({
      statusName: 'init',
      statusData: {
        isMissingRequiredField: true,
        maxSlippage: config.maxSlippage,
      },
    }); // Component lifecycle

  const [isToastVisible, setIsToastVisible] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);
  const { from, to } = useFromTo(address);
  const { sendTransactionAsync } = useSendTransaction(); // Sending the transaction (and approval, if applicable)
  const { sendCallsAsync } = useSendCalls(); // Atomic Batch transactions (and approval, if applicable)

  // Refreshes balances and inputs post-swap
  const resetInputs = useResetInputs({ from, to });
  // For batched transactions, listens to and awaits calls from the Wallet server
  const awaitCallsStatus = useAwaitCalls({
    accountConfig,
    lifecycleStatus,
    updateLifecycleStatus,
  });

  const { sendAnalytics } = useAnalytics();

  // Component lifecycle emitters
  useEffect(() => {
    // Error
    if (lifecycleStatus.statusName === 'error') {
      onError?.(lifecycleStatus.statusData);
      sendAnalytics(SwapEvent.SwapFailure, {
        error: lifecycleStatus.statusData.error,
        metadata: lifecycleStatus.statusData,
      });
    }
    // Success
    if (lifecycleStatus.statusName === 'success') {
      onSuccess?.(lifecycleStatus.statusData.transactionReceipt);
      setTransactionHash(
        lifecycleStatus.statusData?.transactionReceipt.transactionHash,
      );
      setHasHandledSuccess(true);
      setIsToastVisible(true);
      sendAnalytics(SwapEvent.SwapSuccess, {
        paymaster: !!paymaster,
        transactionHash:
          lifecycleStatus.statusData.transactionReceipt?.transactionHash,
        amount: Number(from.amount),
        from: from.token?.symbol || '',
        to: to.token?.symbol || '',
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
    sendAnalytics,
    paymaster,
    from.amount,
    from.token?.symbol,
    to.token?.symbol,
  ]);

  useEffect(() => {
    // Reset inputs after status reset. `resetInputs` is dependent
    // on 'from' and 'to' so moved to separate useEffect to
    // prevents multiple calls to `onStatus`
    if (lifecycleStatus.statusName === 'init' && hasHandledSuccess) {
      setHasHandledSuccess(false);
      resetInputs();
    }
  }, [hasHandledSuccess, lifecycleStatus.statusName, resetInputs]);

  useEffect(() => {
    // For batched transactions, `transactionApproved` will contain the calls ID
    // We'll use the `useAwaitCalls` hook to listen to the call status from the wallet server
    // This will update the lifecycle status to `success` once the calls are confirmed
    if (
      lifecycleStatus.statusName === 'transactionApproved' &&
      lifecycleStatus.statusData.transactionType === 'Batched'
    ) {
      awaitCallsStatus();
    }
  }, [
    awaitCallsStatus,
    lifecycleStatus,
    lifecycleStatus.statusData,
    lifecycleStatus.statusName,
  ]);

  useEffect(() => {
    // Reset status to init after success has been handled
    if (lifecycleStatus.statusName === 'success' && hasHandledSuccess) {
      updateLifecycleStatus({
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
    lifecycleStatus.statusName,
    updateLifecycleStatus,
  ]);

  const handleToggle = useCallback(() => {
    from.setAmount(to.amount);
    to.setAmount(from.amount);
    from.setToken?.(to.token);
    to.setToken?.(from.token);

    updateLifecycleStatus({
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
  }, [from, to, updateLifecycleStatus]);

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
        updateLifecycleStatus({
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
        destination.setAmount('');
        destination.setAmountUSD('');
        source.setAmountUSD('');
        return;
      }

      // When toAmount changes we fetch quote for fromAmount
      // so set isFromQuoteLoading to true
      destination.setLoading(true);
      updateLifecycleStatus({
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
        const maxSlippage = lifecycleStatus.statusData.maxSlippage;
        const response = await getSwapQuote(
          {
            amount,
            amountReference: 'from',
            from: source.token,
            maxSlippage: String(maxSlippage),
            to: destination.token,
            useAggregator,
          },
          RequestContext.Swap,
        );
        // If request resolves to error response set the quoteError
        // property of error state to the SwapError response
        if (isSwapError(response)) {
          updateLifecycleStatus({
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
        destination.setAmountUSD(response.toAmountUSD);
        destination.setAmount(formattedAmount);
        source.setAmountUSD(response.fromAmountUSD);
        updateLifecycleStatus({
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
        sendAnalytics(SwapEvent.SwapInitiated, {
          amount: Number(amount),
        });
      } catch (err) {
        updateLifecycleStatus({
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
    [
      from,
      to,
      lifecycleStatus,
      updateLifecycleStatus,
      useAggregator,
      sendAnalytics,
    ],
  );

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
  const handleSubmit = useCallback(async () => {
    if (!address || !from.token || !to.token || !from.amount) {
      return;
    }

    try {
      const maxSlippage = lifecycleStatus.statusData.maxSlippage;
      const response = await buildSwapTransaction(
        {
          amount: from.amount,
          fromAddress: address,
          from: from.token,
          maxSlippage: String(maxSlippage),
          to: to.token,
          useAggregator,
        },
        RequestContext.Swap,
      );
      if (isSwapError(response)) {
        updateLifecycleStatus({
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
        chainId,
        config: accountConfig,
        isSponsored,
        paymaster: paymaster || '',
        sendCallsAsync,
        sendTransactionAsync,
        swapTransaction: response,
        switchChainAsync,
        updateLifecycleStatus,
        useAggregator,
        walletCapabilities,
      });
    } catch (err) {
      const errorMessage = isUserRejectedRequestError(err)
        ? 'Request denied.'
        : GENERIC_ERROR_MESSAGE;
      updateLifecycleStatus({
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
    chainId,
    from.amount,
    from.token,
    isSponsored,
    lifecycleStatus,
    paymaster,
    sendCallsAsync,
    sendTransactionAsync,
    switchChainAsync,
    to.token,
    updateLifecycleStatus,
    useAggregator,
    walletCapabilities,
  ]);

  const value = useValue({
    address,
    config,
    from,
    handleAmountChange,
    handleToggle,
    handleSubmit,
    lifecycleStatus,
    updateLifecycleStatus,
    to,
    isToastVisible,
    setIsToastVisible,
    setTransactionHash,
    transactionHash,
  });

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
}
