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
import { buildSwapTransaction } from '../../core/api/buildSwapTransaction';
import { getSwapQuote } from '../../core/api/getSwapQuote';
import { useCapabilitiesSafe } from '../../core-react/internal/hooks/useCapabilitiesSafe';
import { useValue } from '../../core-react/internal/hooks/useValue';
import { formatTokenAmount } from '../../core/utils/formatTokenAmount';
import { GENERIC_ERROR_MESSAGE } from '../../transaction/constants';
import { isUserRejectedRequestError } from '../../transaction/utils/isUserRejectedRequestError';
import { useOnchainKit } from '../../core-react/useOnchainKit';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../constants';
import { useAwaitCalls } from '../hooks/useAwaitCalls';
import { useFundSwapTokens } from '../hooks/useFundSwapTokens';
import { useLifecycleStatus } from '../hooks/useLifecycleStatus';
import { useResetFundSwapInputs } from '../hooks/useResetFundSwapInputs';
import type {
  FundSwapContextType,
  FundSwapProviderReact,
  SwapUnit,
} from '../types';
import { isSwapError } from '../utils/isSwapError';
import { processSwapTransaction } from '../utils/processSwapTransaction';

const emptyContext = {} as FundSwapContextType;

export const FundSwapContext = createContext<FundSwapContextType>(emptyContext);

export function useFundSwapContext() {
  const context = useContext(FundSwapContext);
  if (context === emptyContext) {
    throw new Error(
      'useFundSwapContext must be used within a FundSwap component',
    );
  }
  return context;
}

export function FundSwapProvider({
  children,
  config = {
    maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
  },
  experimental,
  isSponsored,
  onError,
  onStatus,
  onSuccess,
  toToken,
}: FundSwapProviderReact) {
  const {
    config: { paymaster } = { paymaster: undefined },
  } = useOnchainKit();
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  // Feature flags
  const { useAggregator } = experimental;
  // Core Hooks
  const accountConfig = useConfig();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const walletCapabilities = useCapabilitiesSafe({
    chainId: base.id,
  }); // Swap is only available on Base
  const [lifecycleStatus, updateLifecycleStatus] = useLifecycleStatus({
    statusName: 'init',
    statusData: {
      isMissingRequiredField: true,
      maxSlippage: config.maxSlippage,
    },
  }); // Component lifecycle

  const [transactionHash, setTransactionHash] = useState('');
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);
  const { fromETH, fromUSDC, to } = useFundSwapTokens(toToken, address);
  const { sendTransactionAsync } = useSendTransaction(); // Sending the transaction (and approval, if applicable)
  const { sendCallsAsync } = useSendCalls(); // Atomic Batch transactions (and approval, if applicable)

  // Refreshes balances and inputs post-swap
  const resetInputs = useResetFundSwapInputs({ fromETH, fromUSDC, to });
  // For batched transactions, listens to and awaits calls from the Wallet server
  const awaitCallsStatus = useAwaitCalls({
    accountConfig,
    lifecycleStatus,
    updateLifecycleStatus,
  });


  // Component lifecycle emitters
  useEffect(() => {
    // Error
    if (lifecycleStatus.statusName === 'error') {
      onError?.(lifecycleStatus.statusData);
    }
    // Success
    if (lifecycleStatus.statusName === 'success') {
      onSuccess?.(lifecycleStatus.statusData.transactionReceipt);
      setTransactionHash(
        lifecycleStatus.statusData.transactionReceipt?.transactionHash,
      );
      setHasHandledSuccess(true);
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
    let timer: NodeJS.Timeout;
    // Reset status to init after success has been handled
    if (lifecycleStatus.statusName === 'success' && hasHandledSuccess) {
      timer = setTimeout(() => {
        updateLifecycleStatus({
          statusName: 'init',
          statusData: {
            isMissingRequiredField: true,
            maxSlippage: config.maxSlippage,
          },
        });
      }, 3000);
    }
    return () => {
      if (timer) {
        return clearTimeout(timer);
      }
    };
  }, [
    config.maxSlippage,
    hasHandledSuccess,
    lifecycleStatus.statusName,
    updateLifecycleStatus,
  ]);

  const handleAmountChange = useCallback(
    async (
      amount: string,
      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
    ) => {
      if (
        to.token === undefined ||
        fromETH.token === undefined ||
        fromUSDC.token === undefined
      ) {
        updateLifecycleStatus({
          statusName: 'amountChange',
          statusData: {
            amountETH: fromETH.amount,
            amountUSDC: fromUSDC.amount,
            amountTo: to.amount,
            tokenTo: to.token,
            isMissingRequiredField: true,
          },
        });
        return;
      }

      if (amount === '' || amount === '.' || Number.parseFloat(amount) === 0) {
        to.setAmount('');
        to.setAmountUSD('');
        fromETH.setAmountUSD('');
        fromUSDC.setAmountUSD('');
        return;
      }

      fromETH.setLoading(true);
      fromUSDC.setLoading(true);

      updateLifecycleStatus({
        statusName: 'amountChange',
        statusData: {
          // when fetching quote, the previous
          // amount is irrelevant
          amountTo: amount,
          amountETH: '',
          amountUSDC: '',
          tokenFromETH: fromETH.token,
          tokenFromUSDC: fromUSDC.token,
          tokenTo: to.token,
          // when fetching quote, the destination
          // amount is missing
          isMissingRequiredField: true,
        },
      });

      try {
        const maxSlippage = lifecycleStatus.statusData.maxSlippage;
        const responseETH = await getSwapQuote({
          amount,
          amountReference: 'to',
          from: fromETH.token,
          maxSlippage: String(maxSlippage),
          to: to.token,
          useAggregator,
        });
        const responseUSDC = await getSwapQuote({
          amount,
          amountReference: 'to',
          from: fromUSDC.token,
          maxSlippage: String(maxSlippage),
          to: to.token,
          useAggregator,
        });

        // If request resolves to error response set the quoteError
        // property of error state to the SwapError response
        if (isSwapError(responseETH)) {
          updateLifecycleStatus({
            statusName: 'error',
            statusData: {
              code: responseETH.code,
              error: responseETH.error,
              message: '',
            },
          });
          return;
        }
        if (isSwapError(responseUSDC)) {
          updateLifecycleStatus({
            statusName: 'error',
            statusData: {
              code: responseUSDC.code,
              error: responseUSDC.error,
              message: '',
            },
          });
          return;
        }
        const formattedAmount = formatTokenAmount(
          responseETH.fromAmount,
          responseETH.from.decimals,
        );
        const formattedUSDCAmount = formatTokenAmount(
          responseUSDC.fromAmount,
          responseUSDC.from.decimals,
        );
        fromETH.setAmountUSD(responseETH.fromAmountUSD);
        fromETH.setAmount(formattedAmount);
        fromUSDC.setAmountUSD(responseUSDC.fromAmountUSD);
        fromUSDC.setAmount(formattedUSDCAmount);

        // TODO: revisit this
        to.setAmountUSD(responseETH.toAmountUSD);

        updateLifecycleStatus({
          statusName: 'amountChange',
          statusData: {
            amountETH: formattedAmount,
            amountUSDC: formattedUSDCAmount,
            amountTo: amount,
            tokenFromETH: fromETH.token,
            tokenFromUSDC: fromUSDC.token,
            tokenTo: to.token,
            // if quote was fetched successfully, we
            // have all required fields
            isMissingRequiredField: !formattedAmount,
          },
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
        fromETH.setLoading(false);
        fromUSDC.setLoading(false);
      }
    },
    [
      to,
      fromETH,
      fromUSDC,
      useAggregator,
      updateLifecycleStatus,
      lifecycleStatus.statusData.maxSlippage,
    ],
  );

  const handleSubmit = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
    async (from: SwapUnit) => {
      if (!address || !from.token || !to.token || !from.amount) {
        return;
      }

      try {
        const maxSlippage = lifecycleStatus.statusData.maxSlippage;
        const response = await buildSwapTransaction({
          amount: from.amount,
          fromAddress: address,
          from: from.token,
          maxSlippage: String(maxSlippage),
          to: to.token,
          useAggregator,
        });
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
    },
    [
      accountConfig,
      address,
      chainId,
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
    ],
  );

  const value = useValue({
    address,
    config,
    fromETH,
    fromUSDC,
    handleAmountChange,
    handleSubmit,
    lifecycleStatus,
    updateLifecycleStatus,
    to,
    setTransactionHash,
    transactionHash,
    isDropdownOpen,
    setIsDropdownOpen,
  });

  return (
    <FundSwapContext.Provider value={value}>
      {children}
    </FundSwapContext.Provider>
  );
}
