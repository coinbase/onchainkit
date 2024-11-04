function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { CDP_GET_SWAP_QUOTE } from '../network/definitions/swap.js';
import { sendRequest } from '../network/request.js';
import { getSwapErrorCode } from '../swap/utils/getSwapErrorCode.js';
import { getAPIParamsForToken } from './utils/getAPIParamsForToken.js';

/**
 * Retrieves a quote for a swap from Token A to Token B.
 */
async function getSwapQuote(params) {
  // Default parameters
  const defaultParams = {
    amountReference: 'from',
    isAmountInDecimals: false
  };
  const apiParamsOrError = getAPIParamsForToken(_objectSpread(_objectSpread({}, defaultParams), params));
  if (apiParamsOrError.error) {
    return apiParamsOrError;
  }
  let apiParams = apiParamsOrError;
  if (!params.useAggregator) {
    apiParams = _objectSpread({
      v2Enabled: true
    }, apiParams);
  }
  if (params.maxSlippage) {
    let slippagePercentage = params.maxSlippage;
    // Adjust slippage for V1 API (aggregator)
    // V1 expects slippage in tenths of a percent (e.g., 30 = 3%)
    if (params.useAggregator) {
      slippagePercentage = (Number(params.maxSlippage) * 10).toString();
    }
    apiParams = _objectSpread({
      slippagePercentage: slippagePercentage
    }, apiParams);
  }
  try {
    const res = await sendRequest(CDP_GET_SWAP_QUOTE, [apiParams]);
    if (res.error) {
      return {
        code: getSwapErrorCode('quote', res.error?.code),
        error: res.error.message,
        message: ''
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: getSwapErrorCode('uncaught-quote'),
      error: 'Something went wrong',
      message: ''
    };
  }
}
export { getSwapQuote };
//# sourceMappingURL=getSwapQuote.js.map
