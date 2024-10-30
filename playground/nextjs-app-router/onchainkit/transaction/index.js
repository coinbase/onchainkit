var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/styles/theme.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
__name(cn, "cn");
var text = {
  body: "ock-font-family font-normal leading-normal",
  caption: "ock-font-family font-semibold text-xs leading-4",
  headline: "ock-font-family font-semibold leading-normal",
  label1: "ock-font-family font-semibold text-sm leading-5",
  label2: "ock-font-family text-sm leading-5",
  legal: "ock-font-family text-xs leading-4",
  title1: "ock-font-family font-semibold text-[1.75rem] leading-9",
  title3: "ock-font-family font-semibold text-xl leading-7"
};
var pressable = {
  default: "cursor-pointer ock-bg-default active:bg-[var(--ock-bg-default-active)] hover:bg-[var(--ock-bg-default-hover)]",
  alternate: "cursor-pointer ock-bg-alternate active:bg-[var(--ock-bg-alternate-active)] hover:[var(--ock-bg-alternate-hover)]",
  inverse: "cursor-pointer ock-bg-inverse active:bg-[var(--ock-bg-inverse-active)] hover:bg-[var(--ock-bg-inverse-hover)]",
  primary: "cursor-pointer ock-bg-primary active:bg-[var(--ock-bg-primary-active)] hover:bg-[var(--ock-bg-primary-hover)]",
  secondary: "cursor-pointer ock-bg-secondary active:bg-[var(--ock-bg-secondary-active)] hover:bg-[var(--ock-bg-secondary-hover)]",
  coinbaseBranding: "cursor-pointer bg-[#0052FF] hover:bg-[#0045D8]",
  shadow: "ock-shadow-default",
  disabled: "opacity-[0.38] pointer-events-none"
};
var background = {
  default: "ock-bg-default",
  alternate: "ock-bg-alternate",
  inverse: "ock-bg-inverse",
  primary: "ock-bg-primary",
  secondary: "ock-bg-secondary",
  error: "ock-bg-error",
  warning: "ock-bg-warning",
  success: "ock-bg-success",
  washed: "ock-bg-primary-washed",
  disabled: "ock-bg-primary-disabled",
  reverse: "ock-bg-default-reverse"
};
var color = {
  inverse: "ock-text-inverse",
  foreground: "ock-text-foreground",
  foregroundMuted: "ock-text-foreground-muted",
  error: "ock-text-error",
  primary: "ock-text-primary",
  success: "ock-text-success",
  warning: "ock-text-warning",
  disabled: "ock-text-disabled"
};
var border = {
  default: "ock-border-default",
  defaultActive: "ock-border-default-active",
  radius: "ock-border-radius",
  radiusInner: "ock-border-radius-inner"
};
var icon = {
  primary: "ock-icon-color-primary",
  foreground: "ock-icon-color-foreground",
  foregroundMuted: "ock-icon-color-foreground-muted",
  inverse: "ock-icon-color-inverse",
  error: "ock-icon-color-error",
  success: "ock-icon-color-success",
  warning: "ock-icon-color-warning"
};

// src/useIsMounted.ts
import { useEffect, useState } from "react";
function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  });
  return isMounted;
}
__name(useIsMounted, "useIsMounted");

// src/useOnchainKit.tsx
import { useContext } from "react";

// src/OnchainKitProvider.tsx
import { createContext, useMemo } from "react";

// src/OnchainKitConfig.ts
import { baseSepolia } from "viem/chains";
var ONCHAIN_KIT_CONFIG = {
  address: null,
  apiKey: null,
  chain: baseSepolia,
  config: {
    appearance: {
      name: null,
      logo: null,
      mode: null,
      theme: null
    },
    paymaster: null
  },
  rpcUrl: null,
  schemaId: null,
  projectId: null
};

// src/OnchainKitProvider.tsx
var OnchainKitContext = /* @__PURE__ */ createContext(ONCHAIN_KIT_CONFIG);

// src/useOnchainKit.tsx
function useOnchainKit() {
  return useContext(OnchainKitContext);
}
__name(useOnchainKit, "useOnchainKit");

// src/internal/hooks/usePreferredColorScheme.ts
import { useEffect as useEffect2, useState as useState2 } from "react";
function usePreferredColorScheme() {
  const [colorScheme, setColorScheme] = useState2("light");
  useEffect2(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setColorScheme(mediaQuery.matches ? "dark" : "light");
    function updateColorScheme(event) {
      setColorScheme(event.matches ? "dark" : "light");
    }
    __name(updateColorScheme, "updateColorScheme");
    mediaQuery.addEventListener("change", updateColorScheme);
    return () => mediaQuery.removeEventListener("change", updateColorScheme);
  }, []);
  return colorScheme;
}
__name(usePreferredColorScheme, "usePreferredColorScheme");

// src/useTheme.ts
function useTheme() {
  const preferredMode = usePreferredColorScheme();
  const { config: { appearance } = {} } = useOnchainKit();
  const { theme = "default", mode = "auto" } = appearance || {};
  if (theme === "cyberpunk" || theme === "base" || theme === "hacker") {
    return theme;
  }
  switch (mode) {
    case "auto":
      return `${theme}-${preferredMode}`;
    case "dark":
      return `${theme}-dark`;
    case "light":
      return `${theme}-light`;
    default:
      return `${theme}-${preferredMode}`;
  }
}
__name(useTheme, "useTheme");

// src/transaction/components/TransactionProvider.tsx
import { createContext as createContext2, useCallback as useCallback2, useContext as useContext2, useEffect as useEffect3, useMemo as useMemo4, useState as useState3 } from "react";
import { useAccount as useAccount2, useConfig, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

// src/constants.ts
var Capabilities = /* @__PURE__ */ function(Capabilities2) {
  Capabilities2["AtomicBatch"] = "atomicBatch";
  Capabilities2["AuxiliaryFunds"] = "auxiliaryFunds";
  Capabilities2["PaymasterService"] = "paymasterService";
  return Capabilities2;
}({});

// src/internal/hooks/useCapabilitiesSafe.ts
import { useMemo as useMemo2 } from "react";
import { useAccount } from "wagmi";
import { useCapabilities } from "wagmi/experimental";
function useCapabilitiesSafe({ chainId }) {
  const { isConnected } = useAccount();
  const { data: capabilities, error } = useCapabilities({
    query: {
      enabled: isConnected
    }
  });
  return useMemo2(() => {
    if (error || !capabilities || !capabilities[chainId]) {
      return {};
    }
    return capabilities[chainId];
  }, [
    capabilities,
    chainId,
    error
  ]);
}
__name(useCapabilitiesSafe, "useCapabilitiesSafe");

// src/internal/hooks/useValue.ts
import { useMemo as useMemo3 } from "react";
function useValue(object) {
  return useMemo3(() => object, [
    object
  ]);
}
__name(useValue, "useValue");

// src/transaction/constants.ts
var GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";
var METHOD_NOT_SUPPORTED_ERROR_SUBSTRING = "this request method is not supported";
var TRANSACTION_TYPE_CALLS = "TRANSACTION_TYPE_CALLS";
var TRANSACTION_TYPE_CONTRACTS = "TRANSACTION_TYPE_CONTRACTS";

// src/transaction/hooks/useCallsStatus.ts
import { useCallsStatus as useCallsStatusWagmi } from "wagmi/experimental";
function useCallsStatus({ setLifecycleStatus, transactionId }) {
  try {
    const { data } = useCallsStatusWagmi({
      id: transactionId,
      query: {
        refetchInterval: /* @__PURE__ */ __name((query) => {
          return query.state.data?.status === "CONFIRMED" ? false : 1e3;
        }, "refetchInterval"),
        enabled: !!transactionId
      }
    });
    const transactionHash = data?.receipts?.[0]?.transactionHash;
    return {
      status: data?.status,
      transactionHash
    };
  } catch (err) {
    setLifecycleStatus({
      statusName: "error",
      statusData: {
        code: "TmUCSh01",
        error: JSON.stringify(err),
        message: ""
      }
    });
    return {
      status: "error",
      transactionHash: void 0
    };
  }
}
__name(useCallsStatus, "useCallsStatus");

// src/transaction/hooks/useSendCall.ts
import { useSendTransaction as useSendCallWagmi } from "wagmi";

// src/transaction/utils/isUserRejectedRequestError.ts
function isUserRejectedRequestError(err) {
  if (err?.cause?.name === "UserRejectedRequestError") {
    return true;
  }
  if (err?.shortMessage?.includes("User rejected the request.")) {
    return true;
  }
  return false;
}
__name(isUserRejectedRequestError, "isUserRejectedRequestError");

// src/transaction/hooks/useSendCall.ts
function useSendCall({ setLifecycleStatus, transactionHashList }) {
  const { status, sendTransactionAsync: sendCallAsync, data } = useSendCallWagmi({
    mutation: {
      onError: /* @__PURE__ */ __name((e) => {
        const errorMessage = isUserRejectedRequestError(e) ? "Request denied." : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: "error",
          statusData: {
            code: "TmUSCh01",
            error: e.message,
            message: errorMessage
          }
        });
      }, "onError"),
      onSuccess: /* @__PURE__ */ __name((hash) => {
        setLifecycleStatus({
          statusName: "transactionLegacyExecuted",
          statusData: {
            transactionHashList: [
              ...transactionHashList,
              hash
            ]
          }
        });
      }, "onSuccess")
    }
  });
  return {
    status,
    sendCallAsync,
    data
  };
}
__name(useSendCall, "useSendCall");

// src/transaction/hooks/useSendCalls.ts
import { useSendCalls as useSendCallsWagmi } from "wagmi/experimental";
function useSendCalls({ setLifecycleStatus, setTransactionId }) {
  const { status, sendCallsAsync, data } = useSendCallsWagmi({
    mutation: {
      onError: /* @__PURE__ */ __name((e) => {
        const errorMessage = isUserRejectedRequestError(e) ? "Request denied." : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: "error",
          statusData: {
            code: "TmUSCSh01",
            error: e.message,
            message: errorMessage
          }
        });
      }, "onError"),
      onSuccess: /* @__PURE__ */ __name((id) => {
        setTransactionId(id);
      }, "onSuccess")
    }
  });
  return {
    status,
    sendCallsAsync,
    data
  };
}
__name(useSendCalls, "useSendCalls");

// src/transaction/hooks/useSendWalletTransactions.tsx
import { useCallback } from "react";

// src/transaction/utils/sendBatchedTransactions.ts
var sendBatchedTransactions = /* @__PURE__ */ __name(async ({ capabilities, sendCallsAsync, transactions, transactionType, writeContractsAsync }) => {
  if (!transactions) {
    return;
  }
  if (transactionType === TRANSACTION_TYPE_CONTRACTS) {
    await writeContractsAsync({
      contracts: transactions,
      capabilities
    });
  }
  if (transactionType === TRANSACTION_TYPE_CALLS) {
    await sendCallsAsync({
      calls: transactions,
      capabilities
    });
  }
}, "sendBatchedTransactions");

// src/transaction/utils/sendSingleTransactions.ts
var sendSingleTransactions = /* @__PURE__ */ __name(async ({ sendCallAsync, transactions, transactionType, writeContractAsync }) => {
  for (const transaction of transactions) {
    if (transactionType === TRANSACTION_TYPE_CALLS) {
      await sendCallAsync(transaction);
    } else {
      await writeContractAsync(transaction);
    }
  }
}, "sendSingleTransactions");

// src/transaction/hooks/useSendWalletTransactions.tsx
var useSendWalletTransactions = /* @__PURE__ */ __name(({ capabilities, sendCallAsync, sendCallsAsync, transactionType, walletCapabilities, writeContractAsync, writeContractsAsync }) => {
  return useCallback(async (transactions) => {
    if (!transactions) {
      return;
    }
    const resolvedTransactions = await Promise.resolve(transactions);
    if (walletCapabilities[Capabilities.AtomicBatch]?.supported) {
      await sendBatchedTransactions({
        capabilities,
        sendCallsAsync,
        transactions: resolvedTransactions,
        transactionType,
        writeContractsAsync
      });
    } else {
      await sendSingleTransactions({
        sendCallAsync,
        transactions: resolvedTransactions,
        transactionType,
        writeContractAsync
      });
    }
  }, [
    writeContractsAsync,
    writeContractAsync,
    sendCallsAsync,
    sendCallAsync,
    capabilities,
    transactionType,
    walletCapabilities
  ]);
}, "useSendWalletTransactions");

// src/transaction/hooks/useWriteContract.ts
import { useWriteContract as useWriteContractWagmi } from "wagmi";
function useWriteContract({ setLifecycleStatus, transactionHashList }) {
  const { status, writeContractAsync, data } = useWriteContractWagmi({
    mutation: {
      onError: /* @__PURE__ */ __name((e) => {
        const errorMessage = isUserRejectedRequestError(e) ? "Request denied." : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: "error",
          statusData: {
            code: "TmUWCh01",
            error: e.message,
            message: errorMessage
          }
        });
      }, "onError"),
      onSuccess: /* @__PURE__ */ __name((hash) => {
        setLifecycleStatus({
          statusName: "transactionLegacyExecuted",
          statusData: {
            transactionHashList: [
              ...transactionHashList,
              hash
            ]
          }
        });
      }, "onSuccess")
    }
  });
  return {
    status,
    writeContractAsync,
    data
  };
}
__name(useWriteContract, "useWriteContract");

// src/transaction/hooks/useWriteContracts.ts
import { useWriteContracts as useWriteContractsWagmi } from "wagmi/experimental";
function useWriteContracts({ setLifecycleStatus, setTransactionId }) {
  const { status, writeContractsAsync } = useWriteContractsWagmi({
    mutation: {
      onError: /* @__PURE__ */ __name((e) => {
        if (e.message.includes(METHOD_NOT_SUPPORTED_ERROR_SUBSTRING)) {
          return;
        }
        const errorMessage = isUserRejectedRequestError(e) ? "Request denied." : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: "error",
          statusData: {
            code: "TmUWCSh01",
            error: e.message,
            message: errorMessage
          }
        });
      }, "onError"),
      onSuccess: /* @__PURE__ */ __name((id) => {
        setTransactionId(id);
      }, "onSuccess")
    }
  });
  return {
    status,
    writeContractsAsync
  };
}
__name(useWriteContracts, "useWriteContracts");

// src/transaction/utils/getPaymasterUrl.ts
var getPaymasterUrl = /* @__PURE__ */ __name((capabilities) => {
  return capabilities?.paymasterService?.url || null;
}, "getPaymasterUrl");

// src/transaction/components/TransactionProvider.tsx
var emptyContext = {};
var TransactionContext = /* @__PURE__ */ createContext2(emptyContext);
function useTransactionContext() {
  const context = useContext2(TransactionContext);
  if (context === emptyContext) {
    throw new Error("useTransactionContext must be used within a Transaction component");
  }
  return context;
}
__name(useTransactionContext, "useTransactionContext");
function TransactionProvider({ calls, capabilities: transactionCapabilities, chainId, children, contracts, isSponsored, onError, onStatus, onSuccess }) {
  const account = useAccount2();
  const config = useConfig();
  const { config: { paymaster } = {
    paymaster: void 0
  } } = useOnchainKit();
  const [errorMessage, setErrorMessage] = useState3("");
  const [errorCode, setErrorCode] = useState3("");
  const [isToastVisible, setIsToastVisible] = useState3(false);
  const [lifecycleStatus, setLifecycleStatus] = useState3({
    statusName: "init",
    statusData: null
  });
  const [transactionId, setTransactionId] = useState3("");
  const [transactionCount, setTransactionCount] = useState3();
  const [transactionHashList, setTransactionHashList] = useState3([]);
  const transactions = calls || contracts;
  const transactionType = calls ? TRANSACTION_TYPE_CALLS : TRANSACTION_TYPE_CONTRACTS;
  const walletCapabilities = useCapabilitiesSafe({
    chainId
  });
  const { switchChainAsync } = useSwitchChain();
  if (!contracts && !calls) {
    throw new Error("Transaction: One of contracts or calls must be provided as a prop to the Transaction component.");
  }
  if (calls && contracts) {
    throw new Error("Transaction: Only one of contracts or calls can be provided as a prop to the Transaction component.");
  }
  const { status: statusWriteContracts, writeContractsAsync } = useWriteContracts({
    setLifecycleStatus,
    setTransactionId
  });
  const { status: statusWriteContract, writeContractAsync, data: writeContractTransactionHash } = useWriteContract({
    setLifecycleStatus,
    transactionHashList
  });
  const { status: statusSendCalls, sendCallsAsync } = useSendCalls({
    setLifecycleStatus,
    setTransactionId
  });
  const { status: statusSendCall, sendCallAsync, data: sendCallTransactionHash } = useSendCall({
    setLifecycleStatus,
    transactionHashList
  });
  const transactionStatus = useMemo4(() => {
    const transactionStatuses = walletCapabilities[Capabilities.AtomicBatch]?.supported ? {
      [TRANSACTION_TYPE_CALLS]: statusSendCalls,
      [TRANSACTION_TYPE_CONTRACTS]: statusWriteContracts
    } : {
      [TRANSACTION_TYPE_CALLS]: statusSendCall,
      [TRANSACTION_TYPE_CONTRACTS]: statusWriteContract
    };
    return transactionStatuses[transactionType];
  }, [
    statusSendCalls,
    statusWriteContracts,
    statusSendCall,
    statusWriteContract,
    transactionType,
    walletCapabilities[Capabilities.AtomicBatch]
  ]);
  const singleTransactionHash = writeContractTransactionHash || sendCallTransactionHash;
  const capabilities = useMemo4(() => {
    if (isSponsored && paymaster) {
      return {
        paymasterService: {
          url: paymaster
        },
        // this needs to be below so devs can override default paymaster
        // with their personal paymaster in production playgroundd
        ...transactionCapabilities
      };
    }
    return transactionCapabilities;
  }, [
    isSponsored,
    paymaster,
    transactionCapabilities
  ]);
  const sendWalletTransactions = useSendWalletTransactions({
    capabilities,
    sendCallAsync,
    sendCallsAsync,
    transactionType,
    walletCapabilities,
    writeContractAsync,
    writeContractsAsync
  });
  const { transactionHash: batchedTransactionHash, status: callStatus } = useCallsStatus({
    setLifecycleStatus,
    transactionId
  });
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: singleTransactionHash || batchedTransactionHash
  });
  useEffect3(() => {
    setErrorMessage("");
    if (lifecycleStatus.statusName === "error") {
      setErrorMessage(lifecycleStatus.statusData.message);
      setErrorCode(lifecycleStatus.statusData.code);
      onError?.(lifecycleStatus.statusData);
    }
    if (lifecycleStatus.statusName === "transactionLegacyExecuted") {
      setTransactionHashList(lifecycleStatus.statusData.transactionHashList);
    }
    if (lifecycleStatus.statusName === "success") {
      onSuccess?.({
        transactionReceipts: lifecycleStatus.statusData.transactionReceipts
      });
    }
    onStatus?.(lifecycleStatus);
  }, [
    onError,
    onStatus,
    onSuccess,
    lifecycleStatus,
    lifecycleStatus.statusData,
    lifecycleStatus.statusName
  ]);
  useEffect3(() => {
    if (transactionStatus === "pending") {
      setLifecycleStatus({
        statusName: "transactionPending",
        statusData: null
      });
    }
  }, [
    transactionStatus
  ]);
  useEffect3(() => {
    if (!receipt) {
      return;
    }
    setLifecycleStatus({
      statusName: "success",
      statusData: {
        transactionReceipts: [
          receipt
        ]
      }
    });
  }, [
    receipt
  ]);
  useEffect3(() => {
    if (!transactions || transactionHashList.length !== transactionCount || transactionCount < 2) {
      return;
    }
    getTransactionLegacyReceipts();
  }, [
    transactions,
    transactionCount,
    transactionHashList
  ]);
  const getTransactionLegacyReceipts = useCallback2(async () => {
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
          statusName: "error",
          statusData: {
            code: "TmTPc01",
            error: JSON.stringify(err),
            message: GENERIC_ERROR_MESSAGE
          }
        });
      }
    }
    setLifecycleStatus({
      statusName: "success",
      statusData: {
        transactionReceipts: receipts
      }
    });
  }, [
    chainId,
    config,
    transactionHashList
  ]);
  const switchChain = useCallback2(async (targetChainId) => {
    if (targetChainId && account.chainId !== targetChainId) {
      await switchChainAsync({
        chainId: targetChainId
      });
    }
  }, [
    account.chainId,
    switchChainAsync
  ]);
  const buildTransaction = useCallback2(async () => {
    setLifecycleStatus({
      statusName: "buildingTransaction",
      statusData: null
    });
    try {
      const resolvedTransactions = await (typeof transactions === "function" ? transactions() : Promise.resolve(transactions));
      setTransactionCount(resolvedTransactions?.length);
      return resolvedTransactions;
    } catch (err) {
      setLifecycleStatus({
        statusName: "error",
        statusData: {
          code: "TmTPc04",
          error: JSON.stringify(err),
          message: "Error building transactions"
        }
      });
      return void 0;
    }
  }, [
    transactions
  ]);
  const handleSubmit = useCallback2(async () => {
    setErrorMessage("");
    setIsToastVisible(true);
    try {
      await switchChain(chainId);
      const resolvedTransactions = await buildTransaction();
      await sendWalletTransactions(resolvedTransactions);
    } catch (err) {
      const errorMessage2 = isUserRejectedRequestError(err) ? "Request denied." : GENERIC_ERROR_MESSAGE;
      setLifecycleStatus({
        statusName: "error",
        statusData: {
          code: "TmTPc03",
          error: JSON.stringify(err),
          message: errorMessage2
        }
      });
    }
  }, [
    buildTransaction,
    chainId,
    sendWalletTransactions,
    switchChain
  ]);
  const value = useValue({
    chainId,
    errorCode,
    errorMessage,
    isLoading: callStatus === "PENDING",
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
  return /* @__PURE__ */ React.createElement(TransactionContext.Provider, {
    value
  }, children);
}
__name(TransactionProvider, "TransactionProvider");

// src/transaction/components/Transaction.tsx
function Transaction({ calls, capabilities, chainId, className, children, contracts, isSponsored, onError, onStatus, onSuccess }) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();
  const { chain } = useOnchainKit();
  if (!isMounted) {
    return null;
  }
  const accountChainId = chainId ? chainId : chain.id;
  return /* @__PURE__ */ React.createElement(TransactionProvider, {
    calls,
    capabilities,
    chainId: accountChainId,
    contracts,
    isSponsored,
    onError,
    onStatus,
    onSuccess
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(componentTheme, "flex w-full flex-col gap-2", className)
  }, children));
}
__name(Transaction, "Transaction");

// src/transaction/components/TransactionButton.tsx
import { useCallback as useCallback3, useMemo as useMemo5 } from "react";
import { useAccount as useAccount3, useChainId } from "wagmi";
import { useShowCallsStatus } from "wagmi/experimental";

// src/internal/components/Spinner.tsx
function Spinner({ className }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex h-full items-center justify-center",
    "data-testid": "ockSpinner"
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn("animate-spin border-2 border-gray-200 border-t-3", "rounded-full border-t-gray-400 px-2.5 py-2.5", className)
  }));
}
__name(Spinner, "Spinner");

// src/network/getChainExplorer.ts
import { baseSepolia as baseSepolia2 } from "viem/chains";
function getChainExplorer(chainId) {
  if (chainId === baseSepolia2.id) {
    return "https://sepolia.basescan.org";
  }
  return "https://basescan.org";
}
__name(getChainExplorer, "getChainExplorer");

// src/transaction/utils/isSpinnerDisplayed.ts
function isSpinnerDisplayed({ errorMessage, hasReceipt, isInProgress, transactionHash, transactionId }) {
  const isWaitingForReceipt = transactionId || transactionHash;
  if (hasReceipt || errorMessage) {
    return false;
  }
  if (isInProgress || isWaitingForReceipt) {
    return true;
  }
  return false;
}
__name(isSpinnerDisplayed, "isSpinnerDisplayed");

// src/transaction/components/TransactionButton.tsx
function TransactionButton({ className, disabled = false, text: idleText = "Transact", errorOverride, successOverride, pendingOverride }) {
  const { chainId, errorMessage, isLoading, lifecycleStatus, onSubmit, receipt, transactions, transactionCount, transactionHash, transactionId } = useTransactionContext();
  const { address } = useAccount3();
  const accountChainId = chainId ?? useChainId();
  const { showCallsStatus } = useShowCallsStatus();
  const isLegacyTransactionInProgress = lifecycleStatus.statusName === "transactionLegacyExecuted" && transactionCount !== lifecycleStatus?.statusData?.transactionHashList?.length;
  const isInProgress = lifecycleStatus.statusName === "buildingTransaction" || lifecycleStatus.statusName === "transactionPending" || isLegacyTransactionInProgress || isLoading;
  const isMissingProps = !transactions || !address;
  const isWaitingForReceipt = !!transactionId || !!transactionHash;
  const isDisabled = !receipt && (isInProgress || isMissingProps || isWaitingForReceipt || disabled);
  const displayPendingState = isSpinnerDisplayed({
    errorMessage,
    hasReceipt: !!receipt,
    isInProgress,
    transactionHash,
    transactionId
  });
  const { errorText, successText, pendingContent } = useMemo5(() => {
    const successText2 = successOverride?.text ?? "View transaction";
    const errorText2 = errorOverride?.text ?? "Try again";
    const pendingContent2 = pendingOverride?.text ?? /* @__PURE__ */ React.createElement(Spinner, null);
    return {
      successText: successText2,
      errorText: errorText2,
      pendingContent: pendingContent2
    };
  }, [
    errorOverride,
    pendingOverride,
    successOverride
  ]);
  const successHandler = useCallback3(() => {
    if (successOverride?.onClick && receipt) {
      return successOverride?.onClick?.(receipt);
    }
    if (receipt && transactionId) {
      return showCallsStatus({
        id: transactionId
      });
    }
    const chainExplorer = getChainExplorer(accountChainId);
    return window.open(`${chainExplorer}/tx/${transactionHash}`, "_blank", "noopener,noreferrer");
  }, [
    accountChainId,
    successOverride,
    showCallsStatus,
    transactionId,
    transactionHash,
    receipt
  ]);
  const errorHandler = useCallback3(() => {
    if (errorOverride?.onClick) {
      return errorOverride?.onClick?.();
    }
    return onSubmit();
  }, [
    errorOverride,
    onSubmit
  ]);
  const buttonContent = useMemo5(() => {
    if (receipt) {
      return successText;
    }
    if (errorMessage) {
      return errorText;
    }
    if (displayPendingState) {
      return pendingContent;
    }
    return idleText;
  }, [
    displayPendingState,
    errorMessage,
    errorText,
    idleText,
    pendingContent,
    receipt,
    successText
  ]);
  const handleSubmit = useCallback3(() => {
    if (receipt) {
      successHandler();
    } else if (errorMessage) {
      errorHandler();
    } else {
      onSubmit();
    }
  }, [
    errorMessage,
    errorHandler,
    onSubmit,
    receipt,
    successHandler
  ]);
  return /* @__PURE__ */ React.createElement("button", {
    className: cn(pressable.primary, border.radius, "w-full rounded-xl", "px-4 py-3 font-medium text-base text-white leading-6", isDisabled && pressable.disabled, text.headline, className),
    onClick: handleSubmit,
    type: "button",
    disabled: isDisabled,
    "data-testid": "ockTransactionButton_Button"
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(text.headline, color.inverse, "flex justify-center")
  }, buttonContent));
}
__name(TransactionButton, "TransactionButton");

// src/transaction/components/TransactionToast.tsx
import { useCallback as useCallback4, useEffect as useEffect4, useMemo as useMemo6 } from "react";

// src/internal/svg/closeSvg.tsx
var closeSvg = /* @__PURE__ */ React.createElement("svg", {
  "aria-label": "ock-closeSvg",
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("title", null, "Close SVG"), /* @__PURE__ */ React.createElement("path", {
  d: "M2.14921 1L1 2.1492L6.8508 8L1 13.8508L2.1492 15L8 9.1492L13.8508 15L15 13.8508L9.14921 8L15 2.1492L13.8508 1L8 6.8508L2.14921 1Z",
  className: icon.foreground
}));

// src/transaction/components/TransactionToast.tsx
function TransactionToast({ children, className, durationMs = 3e3, position = "bottom-center" }) {
  const { errorMessage, isLoading, isToastVisible, receipt, setIsToastVisible, transactionHash, transactionId } = useTransactionContext();
  const closeToast = useCallback4(() => {
    setIsToastVisible(false);
  }, [
    setIsToastVisible
  ]);
  const positionClass = useMemo6(() => {
    if (position === "bottom-right") {
      return "bottom-5 left-3/4";
    }
    if (position === "top-right") {
      return "top-[100px] left-3/4";
    }
    if (position === "top-center") {
      return "top-[100px] left-2/4";
    }
    return "bottom-5 left-2/4";
  }, [
    position
  ]);
  useEffect4(() => {
    let timer;
    if (receipt || errorMessage) {
      timer = setTimeout(() => {
        setIsToastVisible(false);
      }, durationMs);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    errorMessage,
    durationMs,
    receipt,
    setIsToastVisible
  ]);
  const isInProgress = !receipt && !isLoading && !transactionHash && !errorMessage && !transactionId;
  if (!isToastVisible || isInProgress) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(background.default, "flex animate-enter items-center justify-between rounded-lg", "p-2 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]", "-translate-x-2/4 fixed z-20", positionClass, className)
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center gap-4 p-2"
  }, children), /* @__PURE__ */ React.createElement("button", {
    className: "p-2",
    onClick: closeToast,
    type: "button",
    "data-testid": "ockCloseButton"
  }, closeSvg));
}
__name(TransactionToast, "TransactionToast");

// src/transaction/hooks/useGetTransactionToastAction.tsx
import { useMemo as useMemo7 } from "react";
import { useChainId as useChainId2 } from "wagmi";
import { useShowCallsStatus as useShowCallsStatus2 } from "wagmi/experimental";
function useGetTransactionToastAction() {
  const { chainId, errorMessage, onSubmit, transactionHash, transactionId } = useTransactionContext();
  const accountChainId = chainId ?? useChainId2();
  const { showCallsStatus } = useShowCallsStatus2();
  return useMemo7(() => {
    const chainExplorer = getChainExplorer(accountChainId);
    let actionElement = null;
    if (transactionHash) {
      actionElement = /* @__PURE__ */ React.createElement("a", {
        href: `${chainExplorer}/tx/${transactionHash}`,
        target: "_blank",
        rel: "noreferrer"
      }, /* @__PURE__ */ React.createElement("span", {
        className: cn(text.label1, color.primary)
      }, "View transaction"));
    }
    if (transactionId) {
      actionElement = /* @__PURE__ */ React.createElement("button", {
        onClick: /* @__PURE__ */ __name(() => showCallsStatus({
          id: transactionId
        }), "onClick"),
        type: "button"
      }, /* @__PURE__ */ React.createElement("span", {
        className: cn(text.label1, color.primary)
      }, "View transaction"));
    }
    if (errorMessage) {
      actionElement = /* @__PURE__ */ React.createElement("button", {
        type: "button",
        onClick: onSubmit
      }, /* @__PURE__ */ React.createElement("span", {
        className: cn(text.label1, color.primary)
      }, "Try again"));
    }
    return {
      actionElement
    };
  }, [
    accountChainId,
    errorMessage,
    onSubmit,
    showCallsStatus,
    transactionHash,
    transactionId
  ]);
}
__name(useGetTransactionToastAction, "useGetTransactionToastAction");

// src/transaction/components/TransactionToastAction.tsx
function TransactionToastAction({ className }) {
  const { actionElement } = useGetTransactionToastAction();
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label1, "text-nowrap", className)
  }, actionElement);
}
__name(TransactionToastAction, "TransactionToastAction");

// src/transaction/components/TransactionToastIcon.tsx
import { useMemo as useMemo8 } from "react";

// src/internal/svg/errorSvg.tsx
var errorSvg = /* @__PURE__ */ React.createElement("svg", {
  "aria-label": "ock-errorSvg",
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "data-testid": "ock-errorSvg"
}, /* @__PURE__ */ React.createElement("title", null, "Error SVG"), /* @__PURE__ */ React.createElement("path", {
  d: "M8 16C12.4183 16 16 12.4183 16 8C16 3.58171 12.4183 0 8 0C3.58172 0 0 3.58171 0 8C0 12.4183 3.58172 16 8 16ZM11.7576 5.0909L8.84853 8L11.7576 10.9091L10.9091 11.7576L8 8.84851L5.09093 11.7576L4.2424 10.9091L7.15147 8L4.2424 5.0909L5.09093 4.24239L8 7.15145L10.9091 4.24239L11.7576 5.0909Z",
  fill: "#E11D48"
}));

// src/internal/svg/successSvg.tsx
var successSvg = /* @__PURE__ */ React.createElement("svg", {
  "aria-label": "ock-successSvg",
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "data-testid": "ock-successSvg"
}, /* @__PURE__ */ React.createElement("title", null, "Success SVG"), /* @__PURE__ */ React.createElement("path", {
  d: "M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM6.72667 11.5333L3.73333 8.54L4.67333 7.6L6.72667 9.65333L11.44 4.94L12.38 5.88L6.72667 11.5333Z",
  fill: "#65A30D"
}));

// src/transaction/components/TransactionToastIcon.tsx
function TransactionToastIcon({ className }) {
  const { errorMessage, isLoading, receipt, transactionHash, transactionId } = useTransactionContext();
  const isInProgress = isLoading || !!transactionId || !!transactionHash;
  const icon2 = useMemo8(() => {
    if (receipt) {
      return successSvg;
    }
    if (errorMessage) {
      return errorSvg;
    }
    if (isInProgress) {
      return /* @__PURE__ */ React.createElement(Spinner, {
        className: "px-1.5 py-1.5"
      });
    }
    return null;
  }, [
    isInProgress,
    errorMessage,
    receipt
  ]);
  if (!icon2) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label2, className)
  }, icon2);
}
__name(TransactionToastIcon, "TransactionToastIcon");

// src/transaction/hooks/useGetTransactionToastLabel.tsx
import { useMemo as useMemo9 } from "react";
function useGetTransactionToastLabel() {
  const { errorMessage, isLoading, lifecycleStatus, receipt, transactionHash, transactionId } = useTransactionContext();
  const isInProgress = isLoading || !!transactionId || !!transactionHash;
  const isBuildingTransaction = lifecycleStatus.statusName === "buildingTransaction";
  return useMemo9(() => {
    let label = "";
    let labelClassName = color.foregroundMuted;
    if (isBuildingTransaction) {
      label = "Building transaction";
    }
    if (isInProgress) {
      label = "Transaction in progress";
    }
    if (receipt) {
      label = "Successful";
    }
    if (errorMessage) {
      label = "Something went wrong";
      labelClassName = color.error;
    }
    return {
      label,
      labelClassName
    };
  }, [
    errorMessage,
    isBuildingTransaction,
    isInProgress,
    receipt
  ]);
}
__name(useGetTransactionToastLabel, "useGetTransactionToastLabel");

// src/transaction/components/TransactionToastLabel.tsx
function TransactionToastLabel({ className }) {
  const { label } = useGetTransactionToastLabel();
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label1, "text-nowrap", className)
  }, /* @__PURE__ */ React.createElement("p", {
    className: color.foreground
  }, label));
}
__name(TransactionToastLabel, "TransactionToastLabel");

// src/transaction/components/TransactionDefault.tsx
function TransactionDefault({ calls, capabilities, chainId, className, contracts, disabled, onError, onStatus, onSuccess }) {
  return /* @__PURE__ */ React.createElement(Transaction, {
    calls,
    capabilities,
    chainId,
    className,
    contracts,
    onError,
    onStatus,
    onSuccess
  }, /* @__PURE__ */ React.createElement(TransactionButton, {
    disabled
  }), /* @__PURE__ */ React.createElement(TransactionToast, null, /* @__PURE__ */ React.createElement(TransactionToastIcon, null), /* @__PURE__ */ React.createElement(TransactionToastLabel, null), /* @__PURE__ */ React.createElement(TransactionToastAction, null)));
}
__name(TransactionDefault, "TransactionDefault");

// src/transaction/components/TransactionSponsor.tsx
function TransactionSponsor({ className }) {
  const { errorMessage, lifecycleStatus, paymasterUrl, receipt, transactionHash, transactionId } = useTransactionContext();
  const transactionInProgress = transactionId || transactionHash;
  if (lifecycleStatus.statusName !== "init" || !paymasterUrl || errorMessage || transactionInProgress || receipt) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label2, "flex", className)
  }, /* @__PURE__ */ React.createElement("p", {
    className: color.foregroundMuted
  }, "Zero transaction fee"));
}
__name(TransactionSponsor, "TransactionSponsor");

// src/transaction/components/TransactionStatus.tsx
function TransactionStatus({ children, className }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex justify-between", className)
  }, children);
}
__name(TransactionStatus, "TransactionStatus");

// src/transaction/hooks/useGetTransactionStatusAction.tsx
import { useMemo as useMemo10 } from "react";
import { useChainId as useChainId3 } from "wagmi";
import { useShowCallsStatus as useShowCallsStatus3 } from "wagmi/experimental";
function useGetTransactionStatusAction() {
  const { chainId, receipt, transactionHash, transactionId } = useTransactionContext();
  const accountChainId = chainId ?? useChainId3();
  const { showCallsStatus } = useShowCallsStatus3();
  return useMemo10(() => {
    const chainExplorer = getChainExplorer(accountChainId);
    let actionElement = null;
    if (transactionHash) {
      actionElement = /* @__PURE__ */ React.createElement("a", {
        href: `${chainExplorer}/tx/${transactionHash}`,
        target: "_blank",
        rel: "noreferrer"
      }, /* @__PURE__ */ React.createElement("span", {
        className: cn(text.label1, color.primary)
      }, "View transaction"));
    }
    if (transactionId) {
      actionElement = /* @__PURE__ */ React.createElement("button", {
        onClick: /* @__PURE__ */ __name(() => showCallsStatus({
          id: transactionId
        }), "onClick"),
        type: "button"
      }, /* @__PURE__ */ React.createElement("span", {
        className: cn(text.label1, color.primary)
      }, "View transaction"));
    }
    if (receipt) {
      actionElement = null;
    }
    return {
      actionElement
    };
  }, [
    accountChainId,
    receipt,
    showCallsStatus,
    transactionHash,
    transactionId
  ]);
}
__name(useGetTransactionStatusAction, "useGetTransactionStatusAction");

// src/transaction/components/TransactionStatusAction.tsx
function TransactionStatusAction({ className }) {
  const { actionElement } = useGetTransactionStatusAction();
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label2, "min-w-[70px]", className)
  }, actionElement);
}
__name(TransactionStatusAction, "TransactionStatusAction");

// src/transaction/hooks/useGetTransactionStatusLabel.tsx
import { useMemo as useMemo11 } from "react";
function useGetTransactionStatusLabel() {
  const { errorMessage, isLoading, receipt, lifecycleStatus, transactionHash, transactionId } = useTransactionContext();
  const isInProgress = isLoading || !!transactionId || !!transactionHash;
  const isPending = lifecycleStatus.statusName === "transactionPending";
  const isBuildingTransaction = lifecycleStatus.statusName === "buildingTransaction";
  return useMemo11(() => {
    let label = "";
    let labelClassName = color.foregroundMuted;
    if (isBuildingTransaction) {
      label = "Building transaction...";
    }
    if (isPending) {
      label = "Confirm in wallet.";
    }
    if (isInProgress) {
      label = "Transaction in progress...";
    }
    if (receipt) {
      label = "Successful";
    }
    if (errorMessage) {
      label = errorMessage;
      labelClassName = color.error;
    }
    return {
      label,
      labelClassName
    };
  }, [
    errorMessage,
    isBuildingTransaction,
    isInProgress,
    isPending,
    receipt
  ]);
}
__name(useGetTransactionStatusLabel, "useGetTransactionStatusLabel");

// src/transaction/components/TransactionStatusLabel.tsx
function TransactionStatusLabel({ className }) {
  const { label, labelClassName } = useGetTransactionStatusLabel();
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label2, className)
  }, /* @__PURE__ */ React.createElement("p", {
    className: labelClassName
  }, label));
}
__name(TransactionStatusLabel, "TransactionStatusLabel");
export {
  Transaction,
  TransactionButton,
  TransactionDefault,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel
};
//# sourceMappingURL=index.js.map