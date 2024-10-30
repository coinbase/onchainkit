var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/network/definitions/swap.ts
var CDP_LIST_SWAP_ASSETS = "cdp_listSwapAssets";
var CDP_GET_SWAP_QUOTE = "cdp_getSwapQuote";
var CDP_GET_SWAP_TRADE = "cdp_getSwapTrade";

// src/version.ts
var version = "0.35.2";

// src/network/constants.ts
var POST_METHOD = "POST";
var JSON_HEADERS = {
  "Content-Type": "application/json",
  "OnchainKit-Version": version
};
var JSON_RPC_VERSION = "2.0";

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

// src/swap/constants.ts
var GENERAL_SWAP_ERROR_CODE = "SWAP_ERROR";
var GENERAL_SWAP_QUOTE_ERROR_CODE = "SWAP_QUOTE_ERROR";
var GENERAL_SWAP_BALANCE_ERROR_CODE = "SWAP_BALANCE_ERROR";
var LOW_LIQUIDITY_ERROR_CODE = "SWAP_QUOTE_LOW_LIQUIDITY_ERROR";
var TOO_MANY_REQUESTS_ERROR_CODE = "TOO_MANY_REQUESTS_ERROR";
var UNCAUGHT_SWAP_QUOTE_ERROR_CODE = "UNCAUGHT_SWAP_QUOTE_ERROR";
var UNCAUGHT_SWAP_ERROR_CODE = "UNCAUGHT_SWAP_ERROR";

// src/swap/utils/getSwapErrorCode.ts
function getSwapErrorCode(context, errorCode) {
  if (errorCode === -32001) {
    return TOO_MANY_REQUESTS_ERROR_CODE;
  }
  if (errorCode === -32602) {
    return LOW_LIQUIDITY_ERROR_CODE;
  }
  if (context === "uncaught-swap") {
    return UNCAUGHT_SWAP_ERROR_CODE;
  }
  if (context === "uncaught-quote") {
    return UNCAUGHT_SWAP_QUOTE_ERROR_CODE;
  }
  if (context === "quote") {
    return GENERAL_SWAP_QUOTE_ERROR_CODE;
  }
  if (context === "balance") {
    return GENERAL_SWAP_BALANCE_ERROR_CODE;
  }
  return GENERAL_SWAP_ERROR_CODE;
}
__name(getSwapErrorCode, "getSwapErrorCode");

// src/swap/utils/fromReadableAmount.ts
function fromReadableAmount(amount, decimals) {
  const [wholePart, fractionalPart = ""] = amount.split(".");
  const paddedFractionalPart = fractionalPart.padEnd(decimals, "0");
  const trimmedFractionalPart = paddedFractionalPart.slice(0, decimals);
  return (BigInt(wholePart + trimmedFractionalPart) * BigInt(10) ** BigInt(decimals - trimmedFractionalPart.length)).toString();
}
__name(fromReadableAmount, "fromReadableAmount");

// src/swap/utils/toReadableAmount.ts
function toReadableAmount(amount, decimals) {
  if (amount.includes(".")) {
    const [wholePart2, fractionalPart2] = amount.split(".");
    const paddedFractionalPart = fractionalPart2.padEnd(decimals, "0");
    const combinedAmount = wholePart2 + paddedFractionalPart;
    return combinedAmount;
  }
  const bigIntAmount = BigInt(amount);
  const divisor = BigInt(10) ** BigInt(decimals);
  const wholePart = (bigIntAmount / divisor).toString();
  const fractionalPart = (bigIntAmount % divisor).toString().padStart(decimals, "0");
  const trimmedFractionalPart = fractionalPart.replace(/0+$/, "");
  return trimmedFractionalPart ? `${wholePart}.${trimmedFractionalPart}` : wholePart;
}
__name(toReadableAmount, "toReadableAmount");

// src/swap/utils/formatDecimals.ts
function formatDecimals(amount, inputInDecimals = true, decimals = 18) {
  let result;
  if (inputInDecimals) {
    result = toReadableAmount(amount, decimals);
  } else {
    result = fromReadableAmount(amount, decimals);
  }
  return result;
}
__name(formatDecimals, "formatDecimals");

// src/api/utils/getAPIParamsForToken.ts
function getAPIParamsForToken(params) {
  const { from, to, amount, amountReference, isAmountInDecimals } = params;
  const { fromAddress } = params;
  const decimals = amountReference === "from" ? from.decimals : to.decimals;
  if (typeof amount !== "string" || amount.trim() === "") {
    return {
      code: "INVALID_INPUT",
      error: "Invalid input: amount must be a non-empty string",
      message: ""
    };
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    return {
      code: "INVALID_INPUT",
      error: "Invalid input: decimals must be a non-negative integer",
      message: ""
    };
  }
  if (!/^(?:0|[1-9]\d*|\.\d+)(?:\.\d*)?$/.test(amount)) {
    return {
      code: "INVALID_INPUT",
      error: "Invalid input: amount must be a non-negative number string",
      message: ""
    };
  }
  return {
    fromAddress,
    from: from.address || "ETH",
    to: to.address || "ETH",
    amount: isAmountInDecimals ? amount : formatDecimals(amount, false, decimals),
    amountReference: amountReference || "from"
  };
}
__name(getAPIParamsForToken, "getAPIParamsForToken");

// src/api/utils/getSwapTransaction.ts
function getSwapTransaction(rawTx, chainId) {
  const { data, gas, to, value } = rawTx;
  return {
    chainId: Number(chainId),
    data,
    gas: BigInt(gas),
    to,
    value: BigInt(value)
  };
}
__name(getSwapTransaction, "getSwapTransaction");

// src/api/buildSwapTransaction.ts
async function buildSwapTransaction(params) {
  const defaultParams = {
    amountReference: "from",
    isAmountInDecimals: false
  };
  const apiParamsOrError = getAPIParamsForToken({
    ...defaultParams,
    ...params
  });
  if (apiParamsOrError.error) {
    return apiParamsOrError;
  }
  let apiParams = apiParamsOrError;
  if (!params.useAggregator) {
    apiParams = {
      v2Enabled: true,
      ...apiParams
    };
  }
  if (params.maxSlippage) {
    let slippagePercentage = params.maxSlippage;
    if (params.useAggregator) {
      slippagePercentage = (Number(params.maxSlippage) * 10).toString();
    }
    apiParams = {
      slippagePercentage,
      ...apiParams
    };
  }
  try {
    const res = await sendRequest(CDP_GET_SWAP_TRADE, [
      apiParams
    ]);
    if (res.error) {
      return {
        code: getSwapErrorCode("swap", res.error?.code),
        error: res.error.message,
        message: ""
      };
    }
    const trade = res.result;
    return {
      approveTransaction: trade.approveTx ? getSwapTransaction(trade.approveTx, trade.chainId) : void 0,
      fee: trade.fee,
      quote: trade.quote,
      transaction: getSwapTransaction(trade.tx, trade.chainId),
      warning: trade.quote.warning
    };
  } catch (_error) {
    return {
      code: getSwapErrorCode("uncaught-swap"),
      error: "Something went wrong",
      message: ""
    };
  }
}
__name(buildSwapTransaction, "buildSwapTransaction");

// src/network/definitions/pay.ts
var CDP_HYDRATE_CHARGE = "cdp_hydrateCharge";
var CDP_CREATE_PRODUCT_CHARGE = "cdp_createProductCharge";

// src/checkout/constants.ts
var GENERAL_CHECKOUT_ERROR_MESSAGE = "CHECKOUT_ERROR";
var CHECKOUT_TOO_MANY_REQUESTS_ERROR_MESSAGE = "CHECKOUT_TOO_MANY_REQUESTS_ERROR";
var CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE = "CHECKOUT_INVALID_CHARGE_ERROR";
var CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE = "CHECKOUT_INVALID_PARAMETER_ERROR";
var UNCAUGHT_CHECKOUT_ERROR_MESSAGE = "UNCAUGHT_CHECKOUT_ERROR";

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

// src/api/getSwapQuote.ts
async function getSwapQuote(params) {
  const defaultParams = {
    amountReference: "from",
    isAmountInDecimals: false
  };
  const apiParamsOrError = getAPIParamsForToken({
    ...defaultParams,
    ...params
  });
  if (apiParamsOrError.error) {
    return apiParamsOrError;
  }
  let apiParams = apiParamsOrError;
  if (!params.useAggregator) {
    apiParams = {
      v2Enabled: true,
      ...apiParams
    };
  }
  if (params.maxSlippage) {
    let slippagePercentage = params.maxSlippage;
    if (params.useAggregator) {
      slippagePercentage = (Number(params.maxSlippage) * 10).toString();
    }
    apiParams = {
      slippagePercentage,
      ...apiParams
    };
  }
  try {
    const res = await sendRequest(CDP_GET_SWAP_QUOTE, [
      apiParams
    ]);
    if (res.error) {
      return {
        code: getSwapErrorCode("quote", res.error?.code),
        error: res.error.message,
        message: ""
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: getSwapErrorCode("uncaught-quote"),
      error: "Something went wrong",
      message: ""
    };
  }
}
__name(getSwapQuote, "getSwapQuote");

// src/api/getTokens.ts
async function getTokens(options) {
  const defaultFilter = {
    limit: "50",
    page: "1"
  };
  const filters = {
    ...defaultFilter,
    ...options
  };
  try {
    const res = await sendRequest(CDP_LIST_SWAP_ASSETS, [
      filters
    ]);
    if (res.error) {
      return {
        code: "AmGTa01",
        error: res.error.code.toString(),
        message: res.error.message
      };
    }
    return res.result;
  } catch (error) {
    return {
      code: "AmGTa02",
      error: JSON.stringify(error),
      message: "Request failed"
    };
  }
}
__name(getTokens, "getTokens");
export {
  buildPayTransaction,
  buildSwapTransaction,
  getSwapQuote,
  getTokens
};
//# sourceMappingURL=index.js.map