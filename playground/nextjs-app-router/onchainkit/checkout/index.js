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

// src/checkout/components/CheckoutProvider.tsx
import { createContext as createContext2, useCallback as useCallback3, useContext as useContext2, useEffect as useEffect3, useRef, useState as useState4 } from "react";
import { base } from "viem/chains";
import { useAccount as useAccount3, useConnect, useSwitchChain } from "wagmi";
import { useWaitForTransactionReceipt } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { useWriteContracts } from "wagmi/experimental";
import { useCallsStatus } from "wagmi/experimental";

// src/internal/hooks/useValue.ts
import { useMemo as useMemo2 } from "react";
function useValue(object) {
  return useMemo2(() => object, [
    object
  ]);
}
__name(useValue, "useValue");

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

// src/wallet/hooks/useIsWalletACoinbaseSmartWallet.ts
import { useAccount as useAccount2 } from "wagmi";

// src/internal/hooks/useCapabilitiesSafe.ts
import { useMemo as useMemo3 } from "react";
import { useAccount } from "wagmi";
import { useCapabilities } from "wagmi/experimental";
function useCapabilitiesSafe({ chainId }) {
  const { isConnected } = useAccount();
  const { data: capabilities, error } = useCapabilities({
    query: {
      enabled: isConnected
    }
  });
  return useMemo3(() => {
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

// src/wallet/hooks/useIsWalletACoinbaseSmartWallet.ts
var COINBASE_WALLET_SDK_CONNECTOR_ID = "coinbaseWalletSDK";
function useIsWalletACoinbaseSmartWallet() {
  const { chain } = useOnchainKit();
  const { connector } = useAccount2();
  const walletCapabilities = useCapabilitiesSafe({
    chainId: chain.id
  });
  return connector?.id === COINBASE_WALLET_SDK_CONNECTOR_ID && walletCapabilities.atomicBatch?.supported === true;
}
__name(useIsWalletACoinbaseSmartWallet, "useIsWalletACoinbaseSmartWallet");

// src/checkout/constants.ts
var GENERAL_CHECKOUT_ERROR_MESSAGE = "CHECKOUT_ERROR";
var GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";
var NO_CONTRACTS_ERROR = "Contracts are not available";
var NO_CONNECTED_ADDRESS_ERROR = "No connected address";
var CHECKOUT_TOO_MANY_REQUESTS_ERROR_MESSAGE = "CHECKOUT_TOO_MANY_REQUESTS_ERROR";
var CHECKOUT_INSUFFICIENT_BALANCE_ERROR = "User has insufficient balance";
var CHECKOUT_INSUFFICIENT_BALANCE_ERROR_MESSAGE = /* @__PURE__ */ __name((priceInUSD) => {
  return `You need at least ${priceInUSD} USDC to continue with payment`;
}, "CHECKOUT_INSUFFICIENT_BALANCE_ERROR_MESSAGE");
var CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE = "CHECKOUT_INVALID_CHARGE_ERROR";
var CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE = "CHECKOUT_INVALID_PARAMETER_ERROR";
var UNCAUGHT_CHECKOUT_ERROR_MESSAGE = "UNCAUGHT_CHECKOUT_ERROR";
var USER_REJECTED_ERROR = "Request denied.";
var CheckoutErrorCode = /* @__PURE__ */ function(CheckoutErrorCode2) {
  CheckoutErrorCode2["INSUFFICIENT_BALANCE"] = "insufficient_balance";
  CheckoutErrorCode2["GENERIC_ERROR"] = "generic_error";
  CheckoutErrorCode2["UNEXPECTED_ERROR"] = "unexpected_error";
  CheckoutErrorCode2["USER_REJECTED_ERROR"] = "user_rejected";
  return CheckoutErrorCode2;
}({});
var CHECKOUT_LIFECYCLESTATUS = /* @__PURE__ */ function(CHECKOUT_LIFECYCLESTATUS2) {
  CHECKOUT_LIFECYCLESTATUS2["FETCHING_DATA"] = "fetchingData";
  CHECKOUT_LIFECYCLESTATUS2["INIT"] = "init";
  CHECKOUT_LIFECYCLESTATUS2["PENDING"] = "pending";
  CHECKOUT_LIFECYCLESTATUS2["READY"] = "ready";
  CHECKOUT_LIFECYCLESTATUS2["SUCCESS"] = "success";
  CHECKOUT_LIFECYCLESTATUS2["ERROR"] = "error";
  return CHECKOUT_LIFECYCLESTATUS2;
}({});
var USDC_ADDRESS_BASE = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
var CONTRACT_METHODS = /* @__PURE__ */ function(CONTRACT_METHODS2) {
  CONTRACT_METHODS2["APPROVE"] = "approve";
  CONTRACT_METHODS2["BALANCE_OF"] = "balanceOf";
  CONTRACT_METHODS2["TRANSFER_TOKEN_PRE_APPROVED"] = "transferTokenPreApproved";
  return CONTRACT_METHODS2;
}({});
var COMMERCE_ABI = [
  {
    type: "function",
    name: "transferTokenPreApproved",
    inputs: [
      {
        name: "_intent",
        type: "tuple",
        components: [
          {
            name: "recipientAmount",
            type: "uint256"
          },
          {
            name: "deadline",
            type: "uint256"
          },
          {
            name: "recipient",
            type: "address"
          },
          {
            name: "recipientCurrency",
            type: "address"
          },
          {
            name: "refundDestination",
            type: "address"
          },
          {
            name: "feeAmount",
            type: "uint256"
          },
          {
            name: "id",
            type: "bytes16"
          },
          {
            name: "operator",
            type: "address"
          },
          {
            name: "signature",
            type: "bytes"
          },
          {
            name: "prefix",
            type: "bytes"
          }
        ]
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  }
];

// src/checkout/hooks/useCommerceContracts.tsx
import { useCallback } from "react";
import { formatUnits as formatUnits2 } from "viem";
import { useConfig } from "wagmi";

// src/checkout/utils/getCommerceContracts.ts
import { erc20Abi } from "viem";
function getCommerceContracts({ transaction }) {
  const { callData, metaData } = transaction;
  return [
    {
      address: callData.recipientCurrency,
      abi: erc20Abi,
      functionName: CONTRACT_METHODS.APPROVE,
      args: [
        metaData.contractAddress,
        BigInt(callData.recipientAmount) + BigInt(callData.feeAmount)
      ]
    },
    {
      address: metaData.contractAddress,
      abi: COMMERCE_ABI,
      functionName: CONTRACT_METHODS.TRANSFER_TOKEN_PRE_APPROVED,
      args: [
        {
          id: callData.id,
          recipientAmount: BigInt(callData.recipientAmount),
          deadline: BigInt(Math.floor(new Date(callData.deadline).getTime() / 1e3)),
          recipient: callData.recipient,
          recipientCurrency: callData.recipientCurrency,
          refundDestination: callData.refundDestination,
          feeAmount: BigInt(callData.feeAmount),
          operator: callData.operator,
          signature: callData.signature,
          prefix: callData.prefix
        }
      ]
    }
  ];
}
__name(getCommerceContracts, "getCommerceContracts");

// src/checkout/utils/getUSDCBalance.ts
import { formatUnits } from "viem";
import { erc20Abi as erc20Abi2 } from "viem";
import { readContract } from "wagmi/actions";
var getUSDCBalance = /* @__PURE__ */ __name(async ({ address, config }) => {
  const result = await readContract(config, {
    abi: erc20Abi2,
    address: USDC_ADDRESS_BASE,
    functionName: CONTRACT_METHODS.BALANCE_OF,
    args: [
      address
    ]
  });
  return formatUnits(result, 6);
}, "getUSDCBalance");

// src/version.ts
var version = "0.35.2";

// src/network/constants.ts
var POST_METHOD = "POST";
var JSON_HEADERS = {
  "Content-Type": "application/json",
  "OnchainKit-Version": version
};
var JSON_RPC_VERSION = "2.0";

// src/network/getRPCUrl.ts
var getRPCUrl = /* @__PURE__ */ __name(() => {
  if (!ONCHAIN_KIT_CONFIG.rpcUrl && !ONCHAIN_KIT_CONFIG.apiKey) {
    throw new Error("API Key Unset: You can use the Coinbase Developer Platform RPC by providing an API key in `OnchainKitProvider` or by manually calling `setOnchainKitConfig`: https://portal.cdp.coinbase.com/products/onchainkit");
  }
  return ONCHAIN_KIT_CONFIG.rpcUrl || `https://api.developer.coinbase.com/rpc/v1/${ONCHAIN_KIT_CONFIG.chain.name.replace(" ", "-").toLowerCase()}/${ONCHAIN_KIT_CONFIG.apiKey}`;
}, "getRPCUrl");

// src/network/request.ts
function buildRequestBody(method, params) {
  return {
    id: 1,
    jsonrpc: JSON_RPC_VERSION,
    method,
    params
  };
}
__name(buildRequestBody, "buildRequestBody");
async function sendRequest(method, params) {
  try {
    const body = buildRequestBody(method, params);
    const url = getRPCUrl();
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: JSON_HEADERS,
      method: POST_METHOD
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`sendRequest: error sending request: ${error.message}`);
    throw error;
  }
}
__name(sendRequest, "sendRequest");

// src/network/definitions/pay.ts
var CDP_HYDRATE_CHARGE = "cdp_hydrateCharge";
var CDP_CREATE_PRODUCT_CHARGE = "cdp_createProductCharge";

// src/api/utils/getPayErrorMessage.ts
function getPayErrorMessage(errorCode) {
  if (!errorCode) {
    return UNCAUGHT_CHECKOUT_ERROR_MESSAGE;
  }
  if (errorCode === -32001) {
    return CHECKOUT_TOO_MANY_REQUESTS_ERROR_MESSAGE;
  }
  if (errorCode === -32601) {
    return CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE;
  }
  if (errorCode === -32602) {
    return CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE;
  }
  return GENERAL_CHECKOUT_ERROR_MESSAGE;
}
__name(getPayErrorMessage, "getPayErrorMessage");

// src/api/buildPayTransaction.ts
async function buildPayTransaction({ address, chargeId, productId }) {
  try {
    let res;
    if (chargeId) {
      res = await sendRequest(CDP_HYDRATE_CHARGE, [
        {
          sender: address,
          chargeId
        }
      ]);
    } else if (productId) {
      res = await sendRequest(CDP_CREATE_PRODUCT_CHARGE, [
        {
          sender: address,
          productId
        }
      ]);
    } else {
      return {
        code: "AmBPTa01",
        error: "No chargeId or productId provided",
        message: getPayErrorMessage()
      };
    }
    if (res.error) {
      return {
        code: "AmBPTa02",
        error: res.error.message,
        message: getPayErrorMessage(res.error?.code)
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: "AmBPTa03",
      error: "Something went wrong",
      message: getPayErrorMessage()
    };
  }
}
__name(buildPayTransaction, "buildPayTransaction");

// src/checkout/utils/handlePayRequest.ts
var handlePayRequest = /* @__PURE__ */ __name(async ({ address, chargeHandler, productId }) => {
  const buildPayTransactionParams = {
    address
  };
  if (chargeHandler) {
    buildPayTransactionParams.chargeId = await chargeHandler();
  } else if (productId) {
    buildPayTransactionParams.productId = productId;
  }
  const response = await buildPayTransaction(buildPayTransactionParams);
  if ("error" in response) {
    throw new Error(response.error);
  }
  return response;
}, "handlePayRequest");

// src/checkout/hooks/useCommerceContracts.tsx
var useCommerceContracts = /* @__PURE__ */ __name(({ chargeHandler, productId }) => {
  const config = useConfig();
  return useCallback(async (address) => {
    try {
      const [response, usdcBalance] = await Promise.all([
        handlePayRequest({
          address,
          chargeHandler,
          productId
        }),
        getUSDCBalance({
          address,
          config
        })
      ]);
      const { id: chargeId } = response;
      const contracts = getCommerceContracts({
        transaction: response
      });
      const priceInUSDC = formatUnits2(BigInt(response.callData.feeAmount) + BigInt(response.callData.recipientAmount), 6);
      const insufficientBalance = Number.parseFloat(usdcBalance) < Number.parseFloat(priceInUSDC);
      return {
        chargeId,
        contracts,
        insufficientBalance,
        priceInUSDC
      };
    } catch (error) {
      console.error("Unexpected error fetching contracts:", error);
      return {
        chargeId: "",
        contracts: null,
        insufficientBalance: false,
        error
      };
    }
  }, [
    config,
    chargeHandler,
    productId
  ]);
}, "useCommerceContracts");

// src/checkout/hooks/useLifecycleStatus.tsx
import { useCallback as useCallback2, useState as useState3 } from "react";
function useLifecycleStatus(initialState) {
  const [lifecycleStatus, setLifecycleStatus] = useState3(initialState);
  const updateLifecycleStatus = useCallback2((newStatus) => {
    setLifecycleStatus((prevStatus) => {
      const persistedStatusData = prevStatus.statusName === CHECKOUT_LIFECYCLESTATUS.ERROR ? (({ error, code, message, ...statusData }) => statusData)(prevStatus.statusData) : prevStatus.statusData;
      return {
        statusName: newStatus.statusName,
        statusData: {
          ...persistedStatusData,
          ...newStatus.statusData
        }
      };
    });
  }, []);
  return {
    lifecycleStatus,
    updateLifecycleStatus
  };
}
__name(useLifecycleStatus, "useLifecycleStatus");

// src/checkout/components/CheckoutProvider.tsx
var emptyContext = {};
var CheckoutContext = /* @__PURE__ */ createContext2(emptyContext);
function useCheckoutContext() {
  const context = useContext2(CheckoutContext);
  if (context === emptyContext) {
    throw new Error("useCheckoutContext must be used within a Checkout component");
  }
  return context;
}
__name(useCheckoutContext, "useCheckoutContext");
function CheckoutProvider({ chargeHandler, children, isSponsored, onStatus, productId }) {
  const { config: { appearance, paymaster } = {
    appearance: {
      name: void 0,
      logo: void 0
    },
    paymaster: void 0
  } } = useOnchainKit();
  const { address, chainId, isConnected } = useAccount3();
  const { connectAsync } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const [chargeId, setChargeId] = useState4("");
  const [transactionId, setTransactionId] = useState4("");
  const [errorMessage, setErrorMessage] = useState4("");
  const isSmartWallet = useIsWalletACoinbaseSmartWallet();
  const fetchedDataUseEffect = useRef(false);
  const fetchedDataHandleSubmit = useRef(false);
  const userRejectedRef = useRef(false);
  const contractsRef = useRef();
  const insufficientBalanceRef = useRef(false);
  const priceInUSDCRef = useRef("");
  const fetchData = useCallback3(async (address2) => {
    updateLifecycleStatus({
      statusName: CHECKOUT_LIFECYCLESTATUS.FETCHING_DATA,
      statusData: {}
    });
    const { contracts, chargeId: hydratedChargeId, insufficientBalance, priceInUSDC, error } = await fetchContracts(address2);
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
  }, [
    chargeId
  ]);
  const { lifecycleStatus, updateLifecycleStatus } = useLifecycleStatus({
    statusName: CHECKOUT_LIFECYCLESTATUS.INIT,
    statusData: {}
  });
  const fetchContracts = useCommerceContracts({
    chargeHandler,
    productId
  });
  const { status, writeContractsAsync } = useWriteContracts({
    /* v8 ignore start */
    mutation: {
      onSuccess: /* @__PURE__ */ __name((id) => {
        setTransactionId(id);
      }, "onSuccess")
    }
  });
  const { data } = useCallsStatus({
    id: transactionId,
    query: {
      /* v8 ignore next 3 */
      refetchInterval: /* @__PURE__ */ __name((query) => {
        return query.state.data?.status === "CONFIRMED" ? false : 1e3;
      }, "refetchInterval"),
      enabled: !!transactionId
    }
  });
  const transactionHash = data?.receipts?.[0]?.transactionHash;
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: transactionHash
  });
  useEffect3(() => {
    onStatus?.(lifecycleStatus);
  }, [
    lifecycleStatus,
    lifecycleStatus.statusData,
    lifecycleStatus.statusName,
    onStatus
  ]);
  useEffect3(() => {
    if (status === "pending") {
      updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.PENDING,
        statusData: {}
      });
    }
  }, [
    status,
    updateLifecycleStatus
  ]);
  useEffect3(() => {
    if (!receipt) {
      return;
    }
    updateLifecycleStatus({
      statusName: CHECKOUT_LIFECYCLESTATUS.SUCCESS,
      statusData: {
        transactionReceipts: [
          receipt
        ],
        chargeId,
        receiptUrl: `https://commerce.coinbase.com/pay/${chargeId}/receipt`
      }
    });
  }, [
    chargeId,
    receipt,
    updateLifecycleStatus
  ]);
  useEffect3(() => {
    if (lifecycleStatus.statusName === CHECKOUT_LIFECYCLESTATUS.INIT && address && !fetchedDataHandleSubmit.current) {
      fetchedDataUseEffect.current = true;
      fetchData(address);
    }
  }, [
    address,
    fetchData,
    lifecycleStatus
  ]);
  const handleSubmit = useCallback3(async () => {
    try {
      if (lifecycleStatus.statusName === CHECKOUT_LIFECYCLESTATUS.SUCCESS) {
        window.open(`https://commerce.coinbase.com/pay/${chargeId}/receipt`, "_blank", "noopener,noreferrer");
        return;
      }
      if (lifecycleStatus.statusName === CHECKOUT_LIFECYCLESTATUS.ERROR && lifecycleStatus.statusData?.code === CheckoutErrorCode.INSUFFICIENT_BALANCE) {
        window.open(`https://keys.coinbase.com/fund?asset=USDC&chainId=8453&presetCryptoAmount=${priceInUSDCRef.current}`, "_blank", "noopener,noreferrer");
        setErrorMessage("");
        updateLifecycleStatus({
          statusName: CHECKOUT_LIFECYCLESTATUS.INIT,
          statusData: {}
        });
        return;
      }
      if (errorMessage === USER_REJECTED_ERROR) {
        setErrorMessage("");
      }
      let connectedAddress = address;
      let connectedChainId = chainId;
      if (!isConnected || !isSmartWallet) {
        fetchedDataHandleSubmit.current = true;
        const { accounts, chainId: _connectedChainId } = await connectAsync({
          /* v8 ignore next 5 */
          connector: coinbaseWallet({
            appName: appearance?.name ?? void 0,
            appLogoUrl: appearance?.logo ?? void 0,
            preference: "smartWalletOnly"
          })
        });
        connectedAddress = accounts[0];
        connectedChainId = _connectedChainId;
      }
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
      if (!fetchedDataUseEffect.current && !userRejectedRef.current) {
        await fetchData(connectedAddress);
      }
      if (connectedChainId !== base.id) {
        await switchChainAsync({
          chainId: base.id
        });
      }
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
      await writeContractsAsync({
        contracts: contractsRef.current,
        capabilities: isSponsored ? {
          paymasterService: {
            url: paymaster
          }
        } : void 0
      });
    } catch (error) {
      const isUserRejectedError = error.message?.includes("User denied connection request") || isUserRejectedRequestError(error);
      const errorCode = isUserRejectedError ? CheckoutErrorCode.USER_REJECTED_ERROR : CheckoutErrorCode.UNEXPECTED_ERROR;
      const errorMessage2 = isUserRejectedError ? USER_REJECTED_ERROR : GENERIC_ERROR_MESSAGE;
      if (isUserRejectedError) {
        userRejectedRef.current = true;
      }
      setErrorMessage(errorMessage2);
      updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
        statusData: {
          code: errorCode,
          error: JSON.stringify(error),
          message: errorMessage2
        }
      });
    }
  }, [
    address,
    appearance,
    chainId,
    chargeId,
    connectAsync,
    errorMessage,
    fetchData,
    isConnected,
    isSmartWallet,
    isSponsored,
    lifecycleStatus.statusData,
    lifecycleStatus.statusName,
    paymaster,
    switchChainAsync,
    updateLifecycleStatus,
    writeContractsAsync
  ]);
  const value = useValue({
    errorMessage,
    lifecycleStatus,
    onSubmit: handleSubmit,
    updateLifecycleStatus
  });
  return /* @__PURE__ */ React.createElement(CheckoutContext.Provider, {
    value
  }, children);
}
__name(CheckoutProvider, "CheckoutProvider");

// src/checkout/components/Checkout.tsx
function Checkout({ chargeHandler, children, className, isSponsored, onStatus, productId }) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();
  if (!isMounted) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(CheckoutProvider, {
    chargeHandler,
    isSponsored,
    onStatus,
    productId
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(componentTheme, "flex w-full flex-col gap-2", className)
  }, children));
}
__name(Checkout, "Checkout");

// src/checkout/components/CheckoutButton.tsx
import { useMemo as useMemo5 } from "react";

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

// src/internal/hooks/useIcon.tsx
import { isValidElement, useMemo as useMemo4 } from "react";

// src/internal/svg/coinbasePaySvg.tsx
var coinbasePaySvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-coinbasePaySvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M10.0145 14.1666C7.82346 14.1666 6.04878 12.302 6.04878 9.99996C6.04878 7.69788 7.82346 5.83329 10.0145 5.83329C11.9776 5.83329 13.6069 7.33677 13.9208 9.30552H17.9163C17.5793 5.02774 14.172 1.66663 10.0145 1.66663C5.63568 1.66663 2.08301 5.39926 2.08301 9.99996C2.08301 14.6007 5.63568 18.3333 10.0145 18.3333C14.172 18.3333 17.5793 14.9722 17.9163 10.6944H13.9208C13.6069 12.6632 11.9776 14.1666 10.0145 14.1666Z",
  fill: "#f9fafb"
}));

// src/internal/svg/fundWallet.tsx
var fundWalletSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-fundWalletSvg",
  width: "18",
  height: "18",
  viewBox: "0 0 18 18",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M13.5 4.5C13.5 6.15685 14.8431 7.5 16.5 7.5V10.5C14.8431 10.5 13.5 11.8431 13.5 13.5H4.5C4.5 11.8431 3.15685 10.5 1.5 10.5L1.5 13.5V7.5C3.15685 7.5 4.5 6.15685 4.5 4.5H13.5ZM0 3V15H18V3H0ZM11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25C10.2426 11.25 11.25 10.2426 11.25 9Z",
  fill: "#0A0B0D",
  className: icon.foreground
}));

// src/internal/svg/swapSettings.tsx
var swapSettingsSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-swapSettingsSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 19 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M8.92071 5.89742e-08C8.00371 5.89742e-08 7.22171 0.663 7.07071 1.567L6.89271 2.639C6.87271 2.759 6.77771 2.899 6.59571 2.987C6.25306 3.15171 5.92344 3.34226 5.60971 3.557C5.44371 3.672 5.27571 3.683 5.15971 3.64L4.14271 3.258C3.72695 3.10224 3.26941 3.09906 2.85152 3.24904C2.43364 3.39901 2.08254 3.69241 1.86071 4.077L0.938708 5.674C0.716797 6.05836 0.638423 6.50897 0.717525 6.94569C0.796628 7.3824 1.02808 7.7769 1.37071 8.059L2.21071 8.751C2.30571 8.829 2.38071 8.98 2.36471 9.181C2.33621 9.56013 2.33621 9.94087 2.36471 10.32C2.37971 10.52 2.30571 10.672 2.21171 10.75L1.37071 11.442C1.02808 11.7241 0.796628 12.1186 0.717525 12.5553C0.638423 12.992 0.716797 13.4426 0.938708 13.827L1.86071 15.424C2.08269 15.8084 2.43387 16.1016 2.85173 16.2514C3.2696 16.4012 3.72706 16.3978 4.14271 16.242L5.16171 15.86C5.27671 15.817 5.44471 15.829 5.61171 15.942C5.92371 16.156 6.25271 16.347 6.59671 16.512C6.77871 16.6 6.87371 16.74 6.89371 16.862L7.07171 17.933C7.22271 18.837 8.00471 19.5 8.92171 19.5H10.7657C11.6817 19.5 12.4647 18.837 12.6157 17.933L12.7937 16.861C12.8137 16.741 12.9077 16.601 13.0907 16.512C13.4347 16.347 13.7637 16.156 14.0757 15.942C14.2427 15.828 14.4107 15.817 14.5257 15.86L15.5457 16.242C15.9612 16.3972 16.4183 16.4001 16.8357 16.2502C17.2532 16.1002 17.6039 15.8071 17.8257 15.423L18.7487 13.826C18.9706 13.4416 19.049 12.991 18.9699 12.5543C18.8908 12.1176 18.6593 11.7231 18.3167 11.441L17.4767 10.749C17.3817 10.671 17.3067 10.52 17.3227 10.319C17.3511 9.93987 17.3511 9.55913 17.3227 9.18C17.3067 8.98 17.3817 8.828 17.4757 8.75L18.3157 8.058C19.0237 7.476 19.2067 6.468 18.7487 5.673L17.8267 4.076C17.6047 3.69159 17.2535 3.3984 16.8357 3.24861C16.4178 3.09883 15.9604 3.10215 15.5447 3.258L14.5247 3.64C14.4107 3.683 14.2427 3.671 14.0757 3.557C13.7623 3.3423 13.433 3.15175 13.0907 2.987C12.9077 2.9 12.8137 2.76 12.7937 2.639L12.6147 1.567C12.5418 1.12906 12.3158 0.731216 11.977 0.444267C11.6383 0.157318 11.2087 -0.00011124 10.7647 5.89742e-08H8.92171H8.92071ZM9.84271 13.5C10.8373 13.5 11.7911 13.1049 12.4944 12.4017C13.1976 11.6984 13.5927 10.7446 13.5927 9.75C13.5927 8.75544 13.1976 7.80161 12.4944 7.09835C11.7911 6.39509 10.8373 6 9.84271 6C8.84815 6 7.89432 6.39509 7.19106 7.09835C6.4878 7.80161 6.09271 8.75544 6.09271 9.75C6.09271 10.7446 6.4878 11.6984 7.19106 12.4017C7.89432 13.1049 8.84815 13.5 9.84271 13.5Z",
  fill: "#6B7280",
  className: icon.foreground
}));

// src/internal/svg/walletSvg.tsx
var walletSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-walletSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M0 10C0 15.5222 4.47778 20 10 20C15.5222 20 20 15.5222 20 10C20 4.47778 15.5222 0 10 0C4.47778 0 0 4.47778 0 10ZM7.44444 6.77778C7.075 6.77778 6.77778 7.075 6.77778 7.44444V12.5556C6.77778 12.925 7.075 13.2222 7.44444 13.2222H12.5556C12.925 13.2222 13.2222 12.925 13.2222 12.5556V7.44444C13.2222 7.075 12.925 6.77778 12.5556 6.77778H7.44444Z",
  className: icon.foreground
}));

// src/internal/hooks/useIcon.tsx
var useIcon = /* @__PURE__ */ __name(({ icon: icon2 }) => {
  return useMemo4(() => {
    if (icon2 === void 0) {
      return null;
    }
    switch (icon2) {
      case "coinbasePay":
        return coinbasePaySvg;
      case "fundWallet":
        return fundWalletSvg;
      case "swapSettings":
        return swapSettingsSvg;
      case "wallet":
        return walletSvg;
    }
    if (/* @__PURE__ */ isValidElement(icon2)) {
      return icon2;
    }
  }, [
    icon2
  ]);
}, "useIcon");

// src/checkout/components/CheckoutButton.tsx
function CheckoutButton({ className, coinbaseBranded, disabled, icon: icon2, text: text2 = "Pay" }) {
  if (coinbaseBranded) {
    icon2 = "coinbasePay";
    text2 = "Pay with Crypto";
  }
  const { lifecycleStatus, onSubmit } = useCheckoutContext();
  const iconSvg = useIcon({
    icon: icon2
  });
  const isLoading = lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.PENDING;
  const isFetchingData = lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.FETCHING_DATA;
  const isDisabled = disabled || isLoading || isFetchingData;
  const buttonText = useMemo5(() => {
    if (lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.SUCCESS) {
      return "View payment details";
    }
    if (lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.ERROR && lifecycleStatus?.statusData.error === "User has insufficient balance") {
      return "Get USDC";
    }
    return text2;
  }, [
    lifecycleStatus?.statusName,
    lifecycleStatus?.statusData,
    text2
  ]);
  const shouldRenderIcon = buttonText === text2 && iconSvg;
  return /* @__PURE__ */ React.createElement("button", {
    className: cn(coinbaseBranded ? pressable.coinbaseBranding : pressable.primary, border.radius, isDisabled && pressable.disabled, text.headline, "mt-4 w-full px-4 py-3", className),
    onClick: onSubmit,
    type: "button",
    disabled: isDisabled
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center justify-center whitespace-nowrap"
  }, isLoading ? /* @__PURE__ */ React.createElement(Spinner, {
    className: "h-5 w-5"
  }) : /* @__PURE__ */ React.createElement(React.Fragment, null, shouldRenderIcon && /* @__PURE__ */ React.createElement("div", {
    className: "mr-2 flex h-5 w-5 shrink-0 items-center justify-center"
  }, iconSvg), /* @__PURE__ */ React.createElement("span", {
    className: cn(text.headline, coinbaseBranded ? "text-gray-50" : color.inverse)
  }, buttonText))));
}
__name(CheckoutButton, "CheckoutButton");

// src/checkout/hooks/useGetCheckoutStatus.tsx
import { useMemo as useMemo6 } from "react";
function useGetCheckoutStatus() {
  const { errorMessage, lifecycleStatus } = useCheckoutContext();
  const isPending = lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.PENDING;
  const isSuccess = lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.SUCCESS;
  return useMemo6(() => {
    let label = "";
    let labelClassName = color.foregroundMuted;
    if (isPending) {
      label = "Payment in progress...";
    }
    if (isSuccess) {
      label = "Payment successful!";
      labelClassName = color.success;
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
    isPending,
    isSuccess
  ]);
}
__name(useGetCheckoutStatus, "useGetCheckoutStatus");

// src/checkout/components/CheckoutStatus.tsx
function CheckoutStatus({ className }) {
  const { label, labelClassName } = useGetCheckoutStatus();
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex justify-between", className)
  }, /* @__PURE__ */ React.createElement("div", {
    className: text.label2
  }, /* @__PURE__ */ React.createElement("p", {
    className: labelClassName
  }, label)));
}
__name(CheckoutStatus, "CheckoutStatus");
export {
  Checkout,
  CheckoutButton,
  CheckoutStatus
};
//# sourceMappingURL=index.js.map