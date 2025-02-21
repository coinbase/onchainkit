import { RequestContext } from '@/core/network/constants';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
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
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { BuyEvent } from '../../core/analytics/types';
import { useCapabilitiesSafe } from '../../internal/hooks/useCapabilitiesSafe';
import { useValue } from '../../internal/hooks/useValue';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../../swap/constants';
import { useAwaitCalls } from '../../swap/hooks/useAwaitCalls';
import type { LifecycleStatus, SwapUnit } from '../../swap/types';
import { isSwapError } from '../../swap/utils/isSwapError';
import { processSwapTransaction } from '../../swap/utils/processSwapTransaction';
import { GENERIC_ERROR_MESSAGE } from '../../transaction/constants';
import { isUserRejectedRequestError } from '../../transaction/utils/isUserRejectedRequestError';
import { useOnchainKit } from '../../useOnchainKit';
import { useBuyTokens } from '../hooks/useBuyTokens';
import { useOnrampEventListeners } from '../hooks/useOnrampEventListeners';
import { usePopupMonitor } from '../hooks/usePopupMonitor';
import { useResetBuyInputs } from '../hooks/useResetBuyInputs';
import type { BuyContextType, BuyProviderReact } from '../types';
import { getBuyQuote } from '../utils/getBuyQuote';
import { validateQuote } from '../utils/validateQuote';

const emptyContext = {} as BuyContextType;

export const BuyContext = createContext<BuyContextType>(emptyContext);

export function useBuyContext() {
  const context = useContext(BuyContext);
  if (context === emptyContext) {
    throw new Error('useBuyContext must be used within a Buy component');
  }
  return context;
}

export function BuyProvider({
  children,
  config = {
    maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
  },
  disabled,
  experimental,
  isSponsored,
  onError,
  onStatus,
  onSuccess,
  toToken,
  fromToken,
}: BuyProviderReact) {
  const {
    config: { paymaster } = { paymaster: undefined },
    projectId,
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
  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<LifecycleStatus>({
      statusName: 'init',
      statusData: {
        isMissingRequiredField: true,
        maxSlippage: config.maxSlippage,
      },
    }); // Component lifecycle

  const [transactionHash, setTransactionHash] = useState('');
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);
  const { from, fromETH, fromUSDC, to } = useBuyTokens(
    toToken,
    fromToken,
    address,
  );
  const { sendTransactionAsync } = useSendTransaction(); // Sending the transaction (and approval, if applicable)
  const { sendCallsAsync } = useSendCalls(); // Atomic Batch transactions (and approval, if applicable)

  // Refreshes balances and inputs post-swap
  const resetInputs = useResetBuyInputs({ fromETH, fromUSDC, from, to });
  // For batched transactions, listens to and awaits calls from the Wallet server
  const awaitCallsStatus = useAwaitCalls({
    accountConfig,
    lifecycleStatus,
    updateLifecycleStatus,
  });

  const { onPopupClose } = useOnrampEventListeners({
    updateLifecycleStatus,
    maxSlippage: config.maxSlippage,
    lifecycleStatus,
  });

  // used to detect when the popup is closed in order to stop loading state
  const { startPopupMonitor } = usePopupMonitor(onPopupClose);

  // Analytics
  const { sendAnalytics } = useAnalytics();

  // Component lifecycle emitters
  useEffect(() => {
    // Error
    if (lifecycleStatus.statusName === 'error') {
      onError?.(lifecycleStatus.statusData);
    }
    // Success
    if (lifecycleStatus.statusName === 'success') {
      onSuccess?.(lifecycleStatus?.statusData.transactionReceipt);
      const txHash =
        lifecycleStatus.statusData.transactionReceipt?.transactionHash;
      setTransactionHash(txHash);
      setHasHandledSuccess(true);

      sendAnalytics(BuyEvent.BuySuccess, {
        address,
        amount: Number(from?.amount || 0),
        from: from?.token?.address || '',
        paymaster: !!paymaster,
        to: to?.token?.address || '',
        transactionHash: txHash || '',
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
    from,
    to,
    address,
    paymaster,
    sendAnalytics,
  ]);

  useEffect(() => {
    if (!projectId) {
      console.error(
        'Project ID is required for this component, please set the projectId in the OnchainKitProvider',
      );
    }
  }, [projectId]);

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
        from?.setAmountUSD('');
        return;
      }

      fromETH.setLoading(true);
      fromUSDC.setLoading(true);
      from?.setLoading(true);

      updateLifecycleStatus({
        statusName: 'amountChange',
        statusData: {
          // when fetching quote, the previous
          // amount is irrelevant
          amountTo: amount,
          amountETH: '',
          amountUSDC: '',
          amountFrom: '',
          tokenFromETH: fromETH.token,
          tokenFromUSDC: fromUSDC.token,
          tokenFrom: from?.token,
          tokenTo: to.token,
          // when fetching quote, the destination
          // amount is missing
          isMissingRequiredField: true,
        },
      });

      try {
        const maxSlippage = lifecycleStatus.statusData.maxSlippage;

        const {
          response: responseETH,
          formattedFromAmount: formattedAmountETH,
        } = await getBuyQuote({
          amount,
          from: fromETH.token,
          maxSlippage: String(maxSlippage),
          to: to.token,
          useAggregator,
          fromSwapUnit: fromETH,
        });

        const {
          response: responseUSDC,
          formattedFromAmount: formattedAmountUSDC,
        } = await getBuyQuote({
          amount,
          from: fromUSDC.token,
          maxSlippage: String(maxSlippage),
          to: to.token,
          useAggregator,
          fromSwapUnit: fromUSDC,
        });

        const {
          response: responseFrom,
          formattedFromAmount: formattedAmountFrom,
        } = await getBuyQuote({
          amount,
          from: from?.token,
          maxSlippage: String(maxSlippage),
          to: to.token,
          useAggregator,
          fromSwapUnit: from,
        });

        const { isValid } = validateQuote({
          to,
          responseETH,
          responseUSDC,
          responseFrom,
          updateLifecycleStatus,
        });

        if (!isValid) {
          return;
        }

        updateLifecycleStatus({
          statusName: 'amountChange',
          statusData: {
            amountETH: formattedAmountETH,
            amountUSDC: formattedAmountUSDC,
            amountFrom: formattedAmountFrom || '',
            amountTo: amount,
            tokenFromETH: fromETH.token,
            tokenFromUSDC: fromUSDC.token,
            tokenFrom: from?.token,
            tokenTo: to.token,
            // if quote was fetched successfully, we
            // have all required fields
            isMissingRequiredField: !formattedAmountETH,
          },
        });
      } catch (err) {
        sendAnalytics(BuyEvent.BuyFailure, {
          error: err instanceof Error ? err.message : String(err),
          metadata: { amount },
        });
        updateLifecycleStatus({
          statusName: 'error',
          statusData: {
            code: 'TmBPc02', // Transaction module BuyProvider component 01 error
            error: JSON.stringify(err),
            message: '',
          },
        });
      } finally {
        // reset loading state when quote request resolves
        fromETH.setLoading(false);
        fromUSDC.setLoading(false);
        from?.setLoading(false);
      }
    },
    [
      to,
      from,
      fromETH,
      fromUSDC,
      useAggregator,
      updateLifecycleStatus,
      lifecycleStatus.statusData.maxSlippage,
      sendAnalytics,
    ],
  );

  const handleSubmit = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
    async (from: SwapUnit) => {
      if (!address || !from.token || !to.token || !from.amount) {
        return;
      }

      try {
        sendAnalytics(BuyEvent.BuyInitiated, {
          amount: Number(from.amount),
          token: from.token.symbol,
        });

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
          RequestContext.Buy,
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
        sendAnalytics(BuyEvent.BuyFailure, {
          error: err instanceof Error ? err.message : String(err),
          metadata: {
            token: from.token.symbol,
            amount: from.amount,
          },
        });
        const errorMessage = isUserRejectedRequestError(err)
          ? 'Request denied.'
          : GENERIC_ERROR_MESSAGE;
        updateLifecycleStatus({
          statusName: 'error',
          statusData: {
            code: 'TmBPc03',
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
      sendAnalytics,
    ],
  );

  const value = useValue({
    address,
    config,
    disabled,
    from,
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
    toToken,
    fromToken,
    startPopupMonitor,
  });

  return <BuyContext.Provider value={value}>{children}</BuyContext.Provider>;
}
