function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { base } from 'viem/chains';
import { useAccount, useConnect, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { useWriteContracts, useCallsStatus } from 'wagmi/experimental';
import { useValue } from '../../internal/hooks/useValue.js';
import { isUserRejectedRequestError } from '../../transaction/utils/isUserRejectedRequestError.js';
import { useOnchainKit } from '../../useOnchainKit.js';
import { useIsWalletACoinbaseSmartWallet } from '../../wallet/hooks/useIsWalletACoinbaseSmartWallet.js';
import { CHECKOUT_LIFECYCLESTATUS, GENERIC_ERROR_MESSAGE, CheckoutErrorCode, USER_REJECTED_ERROR, NO_CONNECTED_ADDRESS_ERROR, CHECKOUT_INSUFFICIENT_BALANCE_ERROR_MESSAGE, CHECKOUT_INSUFFICIENT_BALANCE_ERROR, NO_CONTRACTS_ERROR } from '../constants.js';
import { useCommerceContracts } from '../hooks/useCommerceContracts.js';
import { useLifecycleStatus } from '../hooks/useLifecycleStatus.js';
import { jsx } from 'react/jsx-runtime';
const emptyContext = {};
const CheckoutContext = /*#__PURE__*/createContext(emptyContext);
function useCheckoutContext() {
  const context = useContext(CheckoutContext);
  if (context === emptyContext) {
    throw new Error('useCheckoutContext must be used within a Checkout component');
  }
  return context;
}
function CheckoutProvider({
  chargeHandler,
  children,
  isSponsored,
  onStatus,
  productId
}) {
  // Core hooks
  const _useOnchainKit = useOnchainKit(),
    _useOnchainKit$config = _useOnchainKit.config,
    _useOnchainKit$config2 = _useOnchainKit$config === void 0 ? {
      appearance: {
        name: undefined,
        logo: undefined
      },
      paymaster: undefined
    } : _useOnchainKit$config,
    appearance = _useOnchainKit$config2.appearance,
    paymaster = _useOnchainKit$config2.paymaster;
  const _useAccount = useAccount(),
    address = _useAccount.address,
    chainId = _useAccount.chainId,
    isConnected = _useAccount.isConnected;
  const _useConnect = useConnect(),
    connectAsync = _useConnect.connectAsync;
  const _useSwitchChain = useSwitchChain(),
    switchChainAsync = _useSwitchChain.switchChainAsync;
  const _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    chargeId = _useState2[0],
    setChargeId = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    transactionId = _useState4[0],
    setTransactionId = _useState4[1];
  const _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    errorMessage = _useState6[0],
    setErrorMessage = _useState6[1];
  const isSmartWallet = useIsWalletACoinbaseSmartWallet();

  // Refs
  const fetchedDataUseEffect = useRef(false);
  const fetchedDataHandleSubmit = useRef(false);
  const userRejectedRef = useRef(false);
  const contractsRef = useRef();
  const insufficientBalanceRef = useRef(false);
  const priceInUSDCRef = useRef('');

  // Helper function used in both `useEffect` and `handleSubmit` to fetch data from the Commerce API and set state and refs
  const fetchData = useCallback(async address => {
    updateLifecycleStatus({
      statusName: CHECKOUT_LIFECYCLESTATUS.FETCHING_DATA,
      statusData: {}
    });
    const _await$fetchContracts = await fetchContracts(address),
      contracts = _await$fetchContracts.contracts,
      hydratedChargeId = _await$fetchContracts.chargeId,
      insufficientBalance = _await$fetchContracts.insufficientBalance,
      priceInUSDC = _await$fetchContracts.priceInUSDC,
      error = _await$fetchContracts.error;
    if (error) {
      setErrorMessage(GENERIC_ERROR_MESSAGE);
      updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
        statusData: {
          code: CheckoutErrorCode.UNEXPECTED_ERROR,
          error: error.name,
          message: error.message
        }
      });
      return;
    }
    setChargeId(hydratedChargeId);
    contractsRef.current = contracts;
    insufficientBalanceRef.current = insufficientBalance;
    priceInUSDCRef.current = priceInUSDC;
    updateLifecycleStatus({
      statusName: CHECKOUT_LIFECYCLESTATUS.READY,
      statusData: {
        chargeId,
        contracts: contractsRef.current || []
      }
    });
  }, [chargeId]);

  // Component lifecycle
  const _useLifecycleStatus = useLifecycleStatus({
      statusName: CHECKOUT_LIFECYCLESTATUS.INIT,
      statusData: {}
    }),
    lifecycleStatus = _useLifecycleStatus.lifecycleStatus,
    updateLifecycleStatus = _useLifecycleStatus.updateLifecycleStatus;

  // Transaction hooks
  const fetchContracts = useCommerceContracts({
    chargeHandler,
    productId
  });
  const _useWriteContracts = useWriteContracts({
      /* v8 ignore start */
      mutation: {
        onSuccess: id => {
          setTransactionId(id);
        }
      }
      /* v8 ignore stop */
    }),
    status = _useWriteContracts.status,
    writeContractsAsync = _useWriteContracts.writeContractsAsync;
  const _useCallsStatus = useCallsStatus({
      id: transactionId,
      query: {
        /* v8 ignore next 3 */
        refetchInterval: query => {
          return query.state.data?.status === 'CONFIRMED' ? false : 1000;
        },
        enabled: !!transactionId
      }
    }),
    data = _useCallsStatus.data;
  const transactionHash = data?.receipts?.[0]?.transactionHash;
  const _useWaitForTransactio = useWaitForTransactionReceipt({
      hash: transactionHash
    }),
    receipt = _useWaitForTransactio.data;

  // Component lifecycle emitters
  useEffect(() => {
    onStatus?.(lifecycleStatus);
  }, [lifecycleStatus, lifecycleStatus.statusData,
  // Keep statusData, so that the effect runs when it changes
  lifecycleStatus.statusName,
  // Keep statusName, so that the effect runs when it changes
  onStatus]);

  // Set transaction pending status when writeContracts is pending
  useEffect(() => {
    if (status === 'pending') {
      updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.PENDING,
        statusData: {}
      });
    }
  }, [status, updateLifecycleStatus]);

  // Trigger success status when receipt is generated by useWaitForTransactionReceipt
  useEffect(() => {
    if (!receipt) {
      return;
    }
    updateLifecycleStatus({
      statusName: CHECKOUT_LIFECYCLESTATUS.SUCCESS,
      statusData: {
        transactionReceipts: [receipt],
        chargeId: chargeId,
        receiptUrl: `https://commerce.coinbase.com/pay/${chargeId}/receipt`
      }
    });
  }, [chargeId, receipt, updateLifecycleStatus]);

  // We need to pre-load transaction data in `useEffect` when the wallet is already connected due to a Smart Wallet popup blocking issue in Safari iOS
  useEffect(() => {
    if (lifecycleStatus.statusName === CHECKOUT_LIFECYCLESTATUS.INIT && address && !fetchedDataHandleSubmit.current) {
      fetchedDataUseEffect.current = true;
      fetchData(address);
    }
  }, [address, fetchData, lifecycleStatus]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component to deprecate funding flow
  const handleSubmit = useCallback(async () => {
    try {
      // Open Coinbase Commerce receipt
      if (lifecycleStatus.statusName === CHECKOUT_LIFECYCLESTATUS.SUCCESS) {
        window.open(`https://commerce.coinbase.com/pay/${chargeId}/receipt`, '_blank', 'noopener,noreferrer');
        return;
      }
      // Open funding flow
      // TODO: Deprecate this once we have USDC Magic Spend
      if (lifecycleStatus.statusName === CHECKOUT_LIFECYCLESTATUS.ERROR && lifecycleStatus.statusData?.code === CheckoutErrorCode.INSUFFICIENT_BALANCE) {
        window.open(`https://keys.coinbase.com/fund?asset=USDC&chainId=8453&presetCryptoAmount=${priceInUSDCRef.current}`, '_blank', 'noopener,noreferrer');
        // Reset status
        setErrorMessage('');
        updateLifecycleStatus({
          statusName: CHECKOUT_LIFECYCLESTATUS.INIT,
          statusData: {}
        });
        return;
      }
      if (errorMessage === USER_REJECTED_ERROR) {
        // Reset status if previous request was a rejection
        setErrorMessage('');
      }
      let connectedAddress = address;
      let connectedChainId = chainId;
      if (!isConnected || !isSmartWallet) {
        // Prompt for wallet connection
        // This is defaulted to Coinbase Smart Wallet
        fetchedDataHandleSubmit.current = true; // Set this here so useEffect does not run
        const _await$connectAsync = await connectAsync({
            /* v8 ignore next 5 */
            connector: coinbaseWallet({
              appName: appearance?.name ?? undefined,
              appLogoUrl: appearance?.logo ?? undefined,
              preference: 'smartWalletOnly'
            })
          }),
          accounts = _await$connectAsync.accounts,
          _connectedChainId = _await$connectAsync.chainId;
        connectedAddress = accounts[0];
        connectedChainId = _connectedChainId;
      }

      // This shouldn't ever happen, but to make Typescript happy
      /* v8 ignore start */
      if (!connectedAddress) {
        setErrorMessage(GENERIC_ERROR_MESSAGE);
        updateLifecycleStatus({
          statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
          statusData: {
            code: CheckoutErrorCode.UNEXPECTED_ERROR,
            error: NO_CONNECTED_ADDRESS_ERROR,
            message: NO_CONNECTED_ADDRESS_ERROR
          }
        });
        return;
      }
      /* v8 ignore stop */

      // Fetch contracts if not already done in useEffect
      // Don't re-fetch contracts if the user rejected the previous request, and just use the cached data
      /* v8 ignore next 3 */
      if (!fetchedDataUseEffect.current && !userRejectedRef.current) {
        await fetchData(connectedAddress);
      }

      // Switch chain, if applicable
      if (connectedChainId !== base.id) {
        await switchChainAsync({
          chainId: base.id
        });
      }

      // Check for sufficient balance
      if (insufficientBalanceRef.current && priceInUSDCRef.current) {
        setErrorMessage(CHECKOUT_INSUFFICIENT_BALANCE_ERROR_MESSAGE(priceInUSDCRef.current));
        updateLifecycleStatus({
          statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
          statusData: {
            code: CheckoutErrorCode.INSUFFICIENT_BALANCE,
            error: CHECKOUT_INSUFFICIENT_BALANCE_ERROR,
            message: CHECKOUT_INSUFFICIENT_BALANCE_ERROR_MESSAGE(priceInUSDCRef.current)
          }
        });
        return;
      }

      // Contracts weren't successfully fetched from `fetchContracts`
      if (!contractsRef.current || contractsRef.current.length === 0) {
        setErrorMessage(GENERIC_ERROR_MESSAGE);
        updateLifecycleStatus({
          statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
          statusData: {
            code: CheckoutErrorCode.UNEXPECTED_ERROR,
            error: NO_CONTRACTS_ERROR,
            message: NO_CONTRACTS_ERROR
          }
        });
        return;
      }

      // Open keys.coinbase.com for payment
      await writeContractsAsync({
        contracts: contractsRef.current,
        capabilities: isSponsored ? {
          paymasterService: {
            url: paymaster
          }
        } : undefined
      });
    } catch (error) {
      const isUserRejectedError = error.message?.includes('User denied connection request') || isUserRejectedRequestError(error);
      const errorCode = isUserRejectedError ? CheckoutErrorCode.USER_REJECTED_ERROR : CheckoutErrorCode.UNEXPECTED_ERROR;
      const errorMessage = isUserRejectedError ? USER_REJECTED_ERROR : GENERIC_ERROR_MESSAGE;
      if (isUserRejectedError) {
        // Set the ref so that we can use the cached commerce API call
        userRejectedRef.current = true;
      }
      setErrorMessage(errorMessage);
      updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
        statusData: {
          code: errorCode,
          error: JSON.stringify(error),
          message: errorMessage
        }
      });
    }
  }, [address, appearance, chainId, chargeId, connectAsync, errorMessage, fetchData, isConnected, isSmartWallet, isSponsored, lifecycleStatus.statusData, lifecycleStatus.statusName, paymaster, switchChainAsync, updateLifecycleStatus, writeContractsAsync]);
  const value = useValue({
    errorMessage,
    lifecycleStatus,
    onSubmit: handleSubmit,
    updateLifecycleStatus
  });
  return /*#__PURE__*/jsx(CheckoutContext.Provider, {
    value: value,
    children: children
  });
}
export { CheckoutContext, CheckoutProvider, useCheckoutContext };
//# sourceMappingURL=CheckoutProvider.js.map
