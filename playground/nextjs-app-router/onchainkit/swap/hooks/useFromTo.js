function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState } from 'react';
import { useValue } from '../../internal/hooks/useValue.js';
import { useSwapBalances } from './useSwapBalances.js';
const useFromTo = address => {
  const _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    fromAmount = _useState2[0],
    setFromAmount = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    fromAmountUSD = _useState4[0],
    setFromAmountUSD = _useState4[1];
  const _useState5 = useState(),
    _useState6 = _slicedToArray(_useState5, 2),
    fromToken = _useState6[0],
    setFromToken = _useState6[1];
  const _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    toAmount = _useState8[0],
    setToAmount = _useState8[1];
  const _useState9 = useState(''),
    _useState10 = _slicedToArray(_useState9, 2),
    toAmountUSD = _useState10[0],
    setToAmountUSD = _useState10[1];
  const _useState11 = useState(),
    _useState12 = _slicedToArray(_useState11, 2),
    toToken = _useState12[0],
    setToToken = _useState12[1];
  const _useState13 = useState(false),
    _useState14 = _slicedToArray(_useState13, 2),
    toLoading = _useState14[0],
    setToLoading = _useState14[1];
  const _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    fromLoading = _useState16[0],
    setFromLoading = _useState16[1];
  const _useSwapBalances = useSwapBalances({
      address,
      fromToken,
      toToken
    }),
    fromBalanceString = _useSwapBalances.fromBalanceString,
    fromTokenBalanceError = _useSwapBalances.fromTokenBalanceError,
    toBalanceString = _useSwapBalances.toBalanceString,
    toTokenBalanceError = _useSwapBalances.toTokenBalanceError,
    fromTokenResponse = _useSwapBalances.fromTokenResponse,
    toTokenResponse = _useSwapBalances.toTokenResponse;
  const from = useValue({
    balance: fromBalanceString,
    balanceResponse: fromTokenResponse,
    amount: fromAmount,
    setAmount: setFromAmount,
    amountUSD: fromAmountUSD,
    setAmountUSD: setFromAmountUSD,
    token: fromToken,
    setToken: setFromToken,
    loading: fromLoading,
    setLoading: setFromLoading,
    error: fromTokenBalanceError
  });
  const to = useValue({
    balance: toBalanceString,
    balanceResponse: toTokenResponse,
    amount: toAmount,
    amountUSD: toAmountUSD,
    setAmountUSD: setToAmountUSD,
    setAmount: setToAmount,
    token: toToken,
    setToken: setToToken,
    loading: toLoading,
    setLoading: setToLoading,
    error: toTokenBalanceError
  });
  return {
    from,
    to
  };
};
export { useFromTo };
//# sourceMappingURL=useFromTo.js.map
