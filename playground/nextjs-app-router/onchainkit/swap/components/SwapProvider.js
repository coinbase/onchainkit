function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base } from 'viem/chains';
import { useAccount, useSwitchChain, useConfig, useSendTransaction } from 'wagmi';
import { useSendCalls } from 'wagmi/experimental';
import { buildSwapTransaction } from '../../api/buildSwapTransaction.js';
import { getSwapQuote } from '../../api/getSwapQuote.js';
import { useCapabilitiesSafe } from '../../internal/hooks/useCapabilitiesSafe.js';
import { useValue } from '../../internal/hooks/useValue.js';
import { formatTokenAmount } from '../../internal/utils/formatTokenAmount.js';
import { GENERIC_ERROR_MESSAGE } from '../../transaction/constants.js';
import { isUserRejectedRequestError } from '../../transaction/utils/isUserRejectedRequestError.js';
import { useOnchainKit } from '../../useOnchainKit.js';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../constants.js';
import { useAwaitCalls } from '../hooks/useAwaitCalls.js';
import { useFromTo } from '../hooks/useFromTo.js';
import { useLifecycleStatus } from '../hooks/useLifecycleStatus.js';
import { useResetInputs } from '../hooks/useResetInputs.js';
import { isSwapError } from '../utils/isSwapError.js';
import { processSwapTransaction } from '../utils/processSwapTransaction.js';
import { jsx } from 'react/jsx-runtime';
const emptyContext = {};
const SwapContext = /*#__PURE__*/createContext(emptyContext);
function useSwapContext() {
  const context = useContext(SwapContext);
  if (context === emptyContext) {
    throw new Error('useSwapContext must be used within a Swap component');
  }
  return context;
}
function SwapProvider({
  children,
  config = {
    maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE
  },
  experimental,
  isSponsored,
  onError,
  onStatus,
  onSuccess
}) {
  const _useOnchainKit = useOnchainKit(),
    _useOnchainKit$config = _useOnchainKit.config,
    _useOnchainKit$config2 = _useOnchainKit$config === void 0 ? {
      paymaster: undefined
    } : _useOnchainKit$config,
    paymaster = _useOnchainKit$config2.paymaster;
  const _useAccount = useAccount(),
    address = _useAccount.address,
    chainId = _useAccount.chainId;
  const _useSwitchChain = useSwitchChain(),
    switchChainAsync = _useSwitchChain.switchChainAsync;
  // Feature flags
  const useAggregator = experimental.useAggregator;
  // Core Hooks
  const accountConfig = useConfig();
  const walletCapabilities = useCapabilitiesSafe({
    chainId: base.id
  }); // Swap is only available on Base
  const _useLifecycleStatus = useLifecycleStatus({
      statusName: 'init',
      statusData: {
        isMissingRequiredField: true,
        maxSlippage: config.maxSlippage
      }
    }),
    _useLifecycleStatus2 = _slicedToArray(_useLifecycleStatus, 2),
    lifecycleStatus = _useLifecycleStatus2[0],
    updateLifecycleStatus = _useLifecycleStatus2[1]; // Component lifecycle

  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isToastVisible = _useState2[0],
    setIsToastVisible = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    transactionHash = _useState4[0],
    setTransactionHash = _useState4[1];
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    hasHandledSuccess = _useState6[0],
    setHasHandledSuccess = _useState6[1];
  const _useFromTo = useFromTo(address),
    from = _useFromTo.from,
    to = _useFromTo.to;
  const _useSendTransaction = useSendTransaction(),
    sendTransactionAsync = _useSendTransaction.sendTransactionAsync; // Sending the transaction (and approval, if applicable)
  const _useSendCalls = useSendCalls(),
    sendCallsAsync = _useSendCalls.sendCallsAsync; // Atomic Batch transactions (and approval, if applicable)

  // Refreshes balances and inputs post-swap
  const resetInputs = useResetInputs({
    from,
    to
  });
  // For batched transactions, listens to and awaits calls from the Wallet server
  const awaitCallsStatus = useAwaitCalls({
    accountConfig,
    lifecycleStatus,
    updateLifecycleStatus
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
      setTransactionHash(lifecycleStatus.statusData.transactionReceipt?.transactionHash);
      setHasHandledSuccess(true);
      setIsToastVisible(true);
    }
    // Emit Status
    onStatus?.(lifecycleStatus);
  }, [onError, onStatus, onSuccess, lifecycleStatus, lifecycleStatus.statusData,
  // Keep statusData, so that the effect runs when it changes
  lifecycleStatus.statusName // Keep statusName, so that the effect runs when it changes
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
    if (lifecycleStatus.statusName === 'transactionApproved' && lifecycleStatus.statusData.transactionType === 'Batched') {
      awaitCallsStatus();
    }
  }, [awaitCallsStatus, lifecycleStatus, lifecycleStatus.statusData, lifecycleStatus.statusName]);
  useEffect(() => {
    // Reset status to init after success has been handled
    if (lifecycleStatus.statusName === 'success' && hasHandledSuccess) {
      updateLifecycleStatus({
        statusName: 'init',
        statusData: {
          isMissingRequiredField: true,
          maxSlippage: config.maxSlippage
        }
      });
    }
  }, [config.maxSlippage, hasHandledSuccess, lifecycleStatus.statusName, updateLifecycleStatus]);
  const handleToggle = useCallback(() => {
    from.setAmount(to.amount);
    to.setAmount(from.amount);
    from.setToken(to.token);
    to.setToken(from.token);
    updateLifecycleStatus({
      statusName: 'amountChange',
      statusData: {
        amountFrom: from.amount,
        amountTo: to.amount,
        tokenFrom: from.token,
        tokenTo: to.token,
        // token is missing
        isMissingRequiredField: !from.token || !to.token || !from.amount || !to.amount
      }
    });
  }, [from, to, updateLifecycleStatus]);
  const handleAmountChange = useCallback(async (type, amount, sToken, dToken) => {
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
          isMissingRequiredField: true
        }
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
        isMissingRequiredField: true
      }
    });
    try {
      const maxSlippage = lifecycleStatus.statusData.maxSlippage;
      const response = await getSwapQuote({
        amount,
        amountReference: 'from',
        from: source.token,
        maxSlippage: String(maxSlippage),
        to: destination.token,
        useAggregator
      });
      // If request resolves to error response set the quoteError
      // property of error state to the SwapError response
      if (isSwapError(response)) {
        updateLifecycleStatus({
          statusName: 'error',
          statusData: {
            code: response.code,
            error: response.error,
            message: ''
          }
        });
        return;
      }
      const formattedAmount = formatTokenAmount(response.toAmount, response.to.decimals);
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
          isMissingRequiredField: !formattedAmount
        }
      });
    } catch (err) {
      updateLifecycleStatus({
        statusName: 'error',
        statusData: {
          code: 'TmSPc01',
          // Transaction module SwapProvider component 01 error
          error: JSON.stringify(err),
          message: ''
        }
      });
    } finally {
      // reset loading state when quote request resolves
      destination.setLoading(false);
    }
  }, [from, to, lifecycleStatus, updateLifecycleStatus, useAggregator]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
  const handleSubmit = useCallback(async () => {
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
        useAggregator
      });
      if (isSwapError(response)) {
        updateLifecycleStatus({
          statusName: 'error',
          statusData: {
            code: response.code,
            error: response.error,
            message: response.message
          }
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
        walletCapabilities
      });
    } catch (err) {
      const errorMessage = isUserRejectedRequestError(err) ? 'Request denied.' : GENERIC_ERROR_MESSAGE;
      updateLifecycleStatus({
        statusName: 'error',
        statusData: {
          code: 'TmSPc02',
          // Transaction module SwapProvider component 02 error
          error: JSON.stringify(err),
          message: errorMessage
        }
      });
    }
  }, [accountConfig, address, chainId, from.amount, from.token, isSponsored, lifecycleStatus, paymaster, sendCallsAsync, sendTransactionAsync, switchChainAsync, to.token, updateLifecycleStatus, useAggregator, walletCapabilities]);
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
    transactionHash
  });
  return /*#__PURE__*/jsx(SwapContext.Provider, {
    value: value,
    children: children
  });
}
export { SwapContext, SwapProvider, useSwapContext };
//# sourceMappingURL=SwapProvider.js.map
