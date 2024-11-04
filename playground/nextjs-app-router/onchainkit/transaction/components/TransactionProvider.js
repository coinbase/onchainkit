function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useAccount, useConfig, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { Capabilities } from '../../constants.js';
import { useCapabilitiesSafe } from '../../internal/hooks/useCapabilitiesSafe.js';
import { useValue } from '../../internal/hooks/useValue.js';
import { useOnchainKit } from '../../useOnchainKit.js';
import { TRANSACTION_TYPE_CALLS, TRANSACTION_TYPE_CONTRACTS, GENERIC_ERROR_MESSAGE } from '../constants.js';
import { useCallsStatus } from '../hooks/useCallsStatus.js';
import { useSendCall } from '../hooks/useSendCall.js';
import { useSendCalls } from '../hooks/useSendCalls.js';
import { useSendWalletTransactions } from '../hooks/useSendWalletTransactions.js';
import { useWriteContract } from '../hooks/useWriteContract.js';
import { useWriteContracts } from '../hooks/useWriteContracts.js';
import { getPaymasterUrl } from '../utils/getPaymasterUrl.js';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError.js';
import { jsx } from 'react/jsx-runtime';
const emptyContext = {};
const TransactionContext = /*#__PURE__*/createContext(emptyContext);
function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (context === emptyContext) {
    throw new Error('useTransactionContext must be used within a Transaction component');
  }
  return context;
}
function TransactionProvider({
  calls,
  capabilities: transactionCapabilities,
  chainId,
  children,
  contracts,
  isSponsored,
  onError,
  onStatus,
  onSuccess
}) {
  // Core Hooks
  const account = useAccount();
  const config = useConfig();
  const _useOnchainKit = useOnchainKit(),
    _useOnchainKit$config = _useOnchainKit.config,
    _useOnchainKit$config2 = _useOnchainKit$config === void 0 ? {
      paymaster: undefined
    } : _useOnchainKit$config,
    paymaster = _useOnchainKit$config2.paymaster;
  const _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    errorMessage = _useState2[0],
    setErrorMessage = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    errorCode = _useState4[0],
    setErrorCode = _useState4[1];
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isToastVisible = _useState6[0],
    setIsToastVisible = _useState6[1];
  const _useState7 = useState({
      statusName: 'init',
      statusData: null
    }),
    _useState8 = _slicedToArray(_useState7, 2),
    lifecycleStatus = _useState8[0],
    setLifecycleStatus = _useState8[1]; // Component lifecycle
  const _useState9 = useState(''),
    _useState10 = _slicedToArray(_useState9, 2),
    transactionId = _useState10[0],
    setTransactionId = _useState10[1];
  const _useState11 = useState(),
    _useState12 = _slicedToArray(_useState11, 2),
    transactionCount = _useState12[0],
    setTransactionCount = _useState12[1];
  const _useState13 = useState([]),
    _useState14 = _slicedToArray(_useState13, 2),
    transactionHashList = _useState14[0],
    setTransactionHashList = _useState14[1];
  const transactions = calls || contracts;
  const transactionType = calls ? TRANSACTION_TYPE_CALLS : TRANSACTION_TYPE_CONTRACTS;

  // Retrieve wallet capabilities
  const walletCapabilities = useCapabilitiesSafe({
    chainId
  });
  const _useSwitchChain = useSwitchChain(),
    switchChainAsync = _useSwitchChain.switchChainAsync;

  // Validate `calls` and `contracts` props
  if (!contracts && !calls) {
    throw new Error('Transaction: One of contracts or calls must be provided as a prop to the Transaction component.');
  }
  if (calls && contracts) {
    throw new Error('Transaction: Only one of contracts or calls can be provided as a prop to the Transaction component.');
  }

  // useWriteContracts or useWriteContract
  // Used for contract calls with an ABI and functions.
  const _useWriteContracts = useWriteContracts({
      setLifecycleStatus,
      setTransactionId
    }),
    statusWriteContracts = _useWriteContracts.status,
    writeContractsAsync = _useWriteContracts.writeContractsAsync;
  const _useWriteContract = useWriteContract({
      setLifecycleStatus,
      transactionHashList
    }),
    statusWriteContract = _useWriteContract.status,
    writeContractAsync = _useWriteContract.writeContractAsync,
    writeContractTransactionHash = _useWriteContract.data;
  // useSendCalls or useSendCall
  // Used for contract calls with raw calldata.
  const _useSendCalls = useSendCalls({
      setLifecycleStatus,
      setTransactionId
    }),
    statusSendCalls = _useSendCalls.status,
    sendCallsAsync = _useSendCalls.sendCallsAsync;
  const _useSendCall = useSendCall({
      setLifecycleStatus,
      transactionHashList
    }),
    statusSendCall = _useSendCall.status,
    sendCallAsync = _useSendCall.sendCallAsync,
    sendCallTransactionHash = _useSendCall.data;

  // Transaction Status
  // For batched, use statusSendCalls or statusWriteContracts
  // For single, use statusSendCall or statusWriteContract
  const transactionStatus = useMemo(() => {
    const transactionStatuses = walletCapabilities[Capabilities.AtomicBatch]?.supported ? {
      [TRANSACTION_TYPE_CALLS]: statusSendCalls,
      [TRANSACTION_TYPE_CONTRACTS]: statusWriteContracts
    } : {
      [TRANSACTION_TYPE_CALLS]: statusSendCall,
      [TRANSACTION_TYPE_CONTRACTS]: statusWriteContract
    };
    return transactionStatuses[transactionType];
  }, [statusSendCalls, statusWriteContracts, statusSendCall, statusWriteContract, transactionType, walletCapabilities[Capabilities.AtomicBatch]]);

  // Transaction hash for single transaction (non-batched)
  const singleTransactionHash = writeContractTransactionHash || sendCallTransactionHash;
  const capabilities = useMemo(() => {
    if (isSponsored && paymaster) {
      return _objectSpread({
        paymasterService: {
          url: paymaster
        }
      }, transactionCapabilities);
    }
    return transactionCapabilities;
  }, [isSponsored, paymaster, transactionCapabilities]);

  // useSendWalletTransactions
  // Used to send transactions based on the transaction type. Can be of type calls or contracts.
  const sendWalletTransactions = useSendWalletTransactions({
    capabilities,
    sendCallAsync,
    sendCallsAsync,
    transactionType,
    walletCapabilities,
    writeContractAsync,
    writeContractsAsync
  });
  const _useCallsStatus = useCallsStatus({
      setLifecycleStatus,
      transactionId
    }),
    batchedTransactionHash = _useCallsStatus.transactionHash,
    callStatus = _useCallsStatus.status;
  const _useWaitForTransactio = useWaitForTransactionReceipt({
      hash: singleTransactionHash || batchedTransactionHash
    }),
    receipt = _useWaitForTransactio.data;

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
        transactionReceipts: lifecycleStatus.statusData.transactionReceipts
      });
    }
    // Emit Status
    onStatus?.(lifecycleStatus);
  }, [onError, onStatus, onSuccess, lifecycleStatus, lifecycleStatus.statusData,
  // Keep statusData, so that the effect runs when it changes
  lifecycleStatus.statusName // Keep statusName, so that the effect runs when it changes
  ]);

  // Set transaction pending status when writeContracts or writeContract is pending
  useEffect(() => {
    if (transactionStatus === 'pending') {
      setLifecycleStatus({
        statusName: 'transactionPending',
        statusData: null
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
        transactionReceipts: [receipt]
      }
    });
  }, [receipt]);

  // When all transactions are succesful, get the receipts
  useEffect(() => {
    if (!transactions || transactionHashList.length !== transactionCount || transactionCount < 2) {
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
          chainId
        });
        receipts.push(txnReceipt);
      } catch (err) {
        setLifecycleStatus({
          statusName: 'error',
          statusData: {
            code: 'TmTPc01',
            // Transaction module TransactionProvider component 01 error
            error: JSON.stringify(err),
            message: GENERIC_ERROR_MESSAGE
          }
        });
      }
    }
    setLifecycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipts: receipts
      }
    });
  }, [chainId, config, transactionHashList]);
  const switchChain = useCallback(async targetChainId => {
    if (targetChainId && account.chainId !== targetChainId) {
      await switchChainAsync({
        chainId: targetChainId
      });
    }
  }, [account.chainId, switchChainAsync]);
  const buildTransaction = useCallback(async () => {
    setLifecycleStatus({
      statusName: 'buildingTransaction',
      statusData: null
    });
    try {
      const resolvedTransactions = await (typeof transactions === 'function' ? transactions() : Promise.resolve(transactions));
      setTransactionCount(resolvedTransactions?.length);
      return resolvedTransactions;
    } catch (err) {
      setLifecycleStatus({
        statusName: 'error',
        statusData: {
          code: 'TmTPc04',
          // Transaction module TransactionProvider component 04 error
          error: JSON.stringify(err),
          message: 'Error building transactions'
        }
      });
      return undefined;
    }
  }, [transactions]);
  const handleSubmit = useCallback(async () => {
    setErrorMessage('');
    setIsToastVisible(true);
    try {
      // Switch chain before attempting transactions
      await switchChain(chainId);
      const resolvedTransactions = await buildTransaction();
      await sendWalletTransactions(resolvedTransactions);
    } catch (err) {
      const errorMessage = isUserRejectedRequestError(err) ? 'Request denied.' : GENERIC_ERROR_MESSAGE;
      setLifecycleStatus({
        statusName: 'error',
        statusData: {
          code: 'TmTPc03',
          // Transaction module TransactionProvider component 03 error
          error: JSON.stringify(err),
          message: errorMessage
        }
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
    transactionCount
  });
  return /*#__PURE__*/jsx(TransactionContext.Provider, {
    value: value,
    children: children
  });
}
export { TransactionContext, TransactionProvider, useTransactionContext };
//# sourceMappingURL=TransactionProvider.js.map
